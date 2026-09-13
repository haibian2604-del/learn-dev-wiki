#!/usr/bin/env python3
"""扫描 01-Wiki / 00-Raw / log.md，生成 data/wiki-data.js 供看板消费。

纯标准库，无第三方依赖。用法：
    python3 scripts/build.py            # 生成 data/wiki-data.js
    python3 scripts/build.py --serve    # 另起本地预览服务（非必需）

产物是 `window.KB_DATA = {...}` 形式的普通脚本，而不是 .json：
这样 index.html 双击即可打开（file:// 下 fetch 会被 CORS 拦截，
但 <script src> 不受影响），无需起服务、无需联网。
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WIKI = ROOT / "01-Wiki"
RAW = ROOT / "00-Raw"
OUT = ROOT / "data" / "wiki-data.js"

KIND_TO_TYPE = {"summaries": "summary", "entities": "entity", "concepts": "concept"}

# 与 02-Rules/分类体系.md §8 保持一致；改动需同步该文件
TYPE_META = {
    "summary": {"label": "摘要", "color": "#f08c00"},
    "entity": {"label": "实体", "color": "#1971c2"},
    "concept": {"label": "概念", "color": "#2f9e44"},
    "index": {"label": "索引", "color": "#9c36b5"},
}
DOMAIN_META = {
    "tech": {"label": "技术", "color": "#1971c2"},
    "product": {"label": "产品", "color": "#9c36b5"},
    "business": {"label": "商业", "color": "#e8590c"},
    "academic": {"label": "学术", "color": "#0c8599"},
    "life": {"label": "生活", "color": "#2f9e44"},
    "reading": {"label": "阅读", "color": "#e64980"},
    "other": {"label": "其他", "color": "#868e96"},
}
STATUS_META = {
    "seedling": {"label": "新生", "color": "#adb5bd"},
    "growing": {"label": "成长中", "color": "#4dabf7"},
    "mature": {"label": "成熟", "color": "#2f9e44"},
}
BLURB_MAX = 120
LINK_RE = re.compile(r"\[\[([^\]|]+)(?:\|([^\]]+))?\]\]")


# ---------- frontmatter ----------

def split_frontmatter(text: str) -> tuple[dict, str]:
    if not text.startswith("---"):
        return {}, text
    parts = text.split("\n")
    end = None
    for i, line in enumerate(parts[1:], start=1):
        if line.strip() == "---":
            end = i
            break
    if end is None:
        return {}, text
    meta: dict = {}
    for line in parts[1:end]:
        if not line.strip() or line.lstrip().startswith("#") or ":" not in line:
            continue
        key, _, val = line.partition(":")
        meta[key.strip()] = val.strip()
    return meta, "\n".join(parts[end + 1:])


def parse_list(raw: str) -> list[str]:
    raw = raw.strip()
    if raw.startswith("[") and raw.endswith("]"):
        raw = raw[1:-1]
    items = []
    for chunk in raw.split(","):
        chunk = chunk.strip().strip("\"'").strip()
        if chunk:
            items.append(chunk)
    return items


def plain(text: str) -> str:
    """去掉 markdown 标记与双链语法，得到纯文本。"""
    text = LINK_RE.sub(lambda m: m.group(2) or m.group(1).split("/")[-1], text)
    text = re.sub(r"`([^`]*)`", r"\1", text)
    text = re.sub(r"\*\*([^*]*)\*\*", r"\1", text)
    text = re.sub(r"(?<!\*)\*([^*]*)\*(?!\*)", r"\1", text)
    text = re.sub(r"^\s*[-*+]\s+", "", text)
    text = re.sub(r"^\s*\d+\.\s+", "", text)
    return re.sub(r"\s+", " ", text).strip()


def trim(text: str, limit: int = BLURB_MAX) -> str:
    text = plain(text)
    if len(text) <= limit:
        return text
    return text[:limit].rstrip() + "…"


def extract_blurb(body: str, page_type: str) -> str:
    """摘要页取 H1 后的首个引用块；实体/概念页取首个正文章节的首句话。"""
    lines = body.split("\n")
    if page_type == "summary":
        for line in lines:
            if line.startswith("> "):
                return trim(line[2:])
    # 通用兜底：跳过标题/表格，取第一个有实义的段落或列表项
    for line in lines:
        stripped = line.strip()
        if not stripped or stripped.startswith("#") or stripped.startswith("|"):
            continue
        if stripped.startswith("---"):
            continue
        if stripped.startswith("> "):
            stripped = stripped[2:]
        return trim(first_sentence(plain(stripped)))
    return ""


def first_sentence(text: str) -> str:
    match = re.search(r"[。！？!?]", text)
    return text[: match.end()] if match else text


# ---------- 分类体系中的知识点中文名 ----------

def load_knowledge_labels() -> dict[str, str]:
    labels: dict[str, str] = {}
    doc = ROOT / "02-Rules" / "分类体系.md"
    if not doc.exists():
        return labels
    for line in doc.read_text(encoding="utf-8").split("\n"):
        m = re.match(r"\|\s*`00-Raw/([^/`]+)/`\s*\|\s*([^|]+?)\s*\|", line)
        if m:
            name = m.group(1).strip()
            label = re.sub(r"（[^）]*）", "", m.group(2)).strip()
            if name != "inbox":
                labels[name] = label
    return labels


# ---------- 扫描 ----------

def scan_pages() -> tuple[list[dict], Counter, Counter, Counter, Counter, int]:
    pages: list[dict] = []
    by_type: Counter = Counter()
    by_domain: Counter = Counter()
    by_status: Counter = Counter()
    by_tag: Counter = Counter()
    link_count = 0

    for kind in ("summaries", "entities", "concepts"):
        for path in sorted((WIKI / kind).glob("*.md")):
            text = path.read_text(encoding="utf-8")
            meta, body = split_frontmatter(text)
            page_type = meta.get("type", kind[:-2].rstrip("e") if kind != "concepts" else "concept")
            page_type = meta.get("type") or {"summaries": "summary", "entities": "entity", "concepts": "concept"}[kind]
            tags = parse_list(meta.get("tags", ""))
            domain = meta.get("domain", "other")
            status = meta.get("status", "seedling")
            sources = [plain(s) for s in parse_list(meta.get("sources", ""))]

            title = plain(path.stem)
            for line in body.split("\n"):
                if line.startswith("# "):
                    title = plain(line[2:])
                    break

            pages.append(
                {
                    "title": title,
                    "kind": page_type,
                    "domain": domain,
                    "tags": tags,
                    "status": status,
                    "created": meta.get("created", ""),
                    "updated": meta.get("updated", ""),
                    "sources": sources,
                    "blurb": extract_blurb(body, page_type),
                    "code": path.name,
                }
            )
            by_type[page_type] += 1
            by_domain[domain] += 1
            by_status[status] += 1
            for tag in tags:
                by_tag[tag] += 1
            link_count += len(LINK_RE.findall(text))

    return pages, by_type, by_domain, by_status, by_tag, link_count


def scan_raw(labels: dict[str, str]) -> list[dict]:
    folders = []
    for path in sorted(RAW.iterdir()):
        if not path.is_dir() or path.name == "inbox":
            continue
        files = [f for f in sorted(path.iterdir()) if f.is_file() and not f.name.startswith(".")]
        # 知识点夹 = 含源文件（.md/.pdf）的目录；纯附件目录（如 images/）不计入
        sources = [f for f in files if f.suffix.lower() in {".md", ".pdf"}]
        if not sources:
            continue
        folders.append(
            {
                "folder": path.name,
                "label": labels.get(path.name, path.name),
                "count": len(sources),
            }
        )
    return sorted(folders, key=lambda f: -f["count"])


def scan_log() -> tuple[list[dict], Counter]:
    entries: list[dict] = []
    kinds: Counter = Counter()
    log = WIKI / "log.md"
    if not log.exists():
        return entries, kinds
    for line in log.read_text(encoding="utf-8").split("\n"):
        m = re.match(r"^##\s*\[(\d{4}-\d{2}-\d{2})\]\s*(\S+)\s*\|\s*(.+?)\s*$", line)
        if not m:
            continue
        day, kind, title = m.groups()
        entries.append({"date": day, "kind": kind, "title": title})
        kinds[kind] += 1
    return entries, kinds


def build_timeline(pages: list[dict], logs: list[dict]) -> list[dict]:
    created: Counter = Counter()
    for page in pages:
        key = (page.get("created") or "")[:7]
        if re.match(r"^\d{4}-\d{2}$", key):
            created[key] += 1
    ingested: Counter = Counter()
    for entry in logs:
        if entry["kind"] == "ingest":
            ingested[entry["date"][:7]] += 1

    months = sorted(set(created) | set(ingested))
    cumulative = 0
    rows = []
    for month in months:
        cumulative += created.get(month, 0)
        rows.append(
            {
                "month": month,
                "created": created.get(month, 0),
                "cumulative": cumulative,
                "ingests": ingested.get(month, 0),
            }
        )
    return rows


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--serve", action="store_true", help="生成后启动本地预览服务")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()

    labels = load_knowledge_labels()
    pages, by_type, by_domain, by_status, by_tag, link_count = scan_pages()
    raw_folders = scan_raw(labels)
    logs, log_kinds = scan_log()
    timeline = build_timeline(pages, logs)

    counts = Counter(p["kind"] for p in pages)
    data = {
        "generatedAt": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "stats": {
            "pages": len(pages),
            "summaries": counts.get("summary", 0),
            "entities": counts.get("entity", 0),
            "concepts": counts.get("concept", 0),
            "rawSources": sum(f["count"] for f in raw_folders),
            "knowledgePoints": len(raw_folders),
            "links": link_count,
            "logs": len(logs),
            "tags": len(by_tag),
        },
        "typeMeta": TYPE_META,
        "domainMeta": DOMAIN_META,
        "statusMeta": STATUS_META,
        # 图表系列色同样从上面的分类色派生，前端不硬编码任何色值
        "palette": {
            "primary": DOMAIN_META["tech"]["color"],   # #1971c2
            "accent": TYPE_META["index"]["color"],     # #9c36b5
            "warn": TYPE_META["summary"]["color"],     # #f08c00
        },
        "byType": dict(by_type),
        "byDomain": dict(by_domain),
        "byStatus": dict(by_status),
        "topTags": [{"tag": t, "count": c} for t, c in by_tag.most_common(20)],
        "byKnowledgePoint": raw_folders,
        "timeline": timeline,
        "logKinds": dict(log_kinds),
        "activity": list(reversed(logs))[:12],
        "pages": {
            "summaries": [p for p in pages if p["kind"] == "summary"],
            "entities": [p for p in pages if p["kind"] == "entity"],
            "concepts": [p for p in pages if p["kind"] == "concept"],
        },
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(data, ensure_ascii=False, indent=2)
    OUT.write_text(
        "/* 由 scripts/build.py 自动生成，请勿手工编辑。 */\n"
        "window.KB_DATA = " + payload + ";\n",
        encoding="utf-8",
    )
    size_kb = OUT.stat().st_size / 1024
    print(f"✓ {OUT.relative_to(ROOT)} 已生成 ({size_kb:.1f} KB)")
    print(f"  页面 {data['stats']['pages']} · 源 {data['stats']['rawSources']} · 知识点 {data['stats']['knowledgePoints']} · 双链 {link_count}")
    orphans = [p["title"] for p in pages if not p["blurb"]]
    if orphans:
        print(f"  ⚠ {len(orphans)} 页未提取到简介: {', '.join(orphans[:5])}")
    print("  查看方式：直接双击 index.html")

    if args.serve:
        import functools
        import http.server
        import socketserver

        handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(ROOT))
        with socketserver.TCPServer(("127.0.0.1", args.port), handler) as httpd:
            print(f"  本地服务 → http://localhost:{args.port}/index.html  (Ctrl+C 停止)")
            httpd.serve_forever()
    return 0


if __name__ == "__main__":
    sys.exit(main())
