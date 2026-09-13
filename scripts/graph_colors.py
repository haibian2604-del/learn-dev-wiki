#!/usr/bin/env python3
"""重建 .obsidian/graph.json 的 colorGroups（关系图谱配色）。

背景：Obsidian 在关闭图谱视图时会重写 `.obsidian/graph.json`，历史上曾把
`colorGroups` 覆写成空数组 `[]`（表现为**整个图谱全灰**）。本脚本用单一数据源
把配色重新写回，避免手工重录 37 组。

数据源 = 下方 GRAPH_GROUPS，改动时需与 [[02-Rules/分类体系]] §8.4 与
`.obsidian/snippets/wiki-colors.css` 保持一致。

用法：
    python3 scripts/graph_colors.py            # 写回配色
    python3 scripts/graph_colors.py --check    # 只校验，不改文件（退出码 1 表示不一致）
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GRAPH = ROOT / ".obsidian" / "graph.json"

# (query, 颜色) —— 顺序即优先级：节点取**第一个**匹配的组。
# 第一层：子域标签组（同主题的摘要/概念/实体聚成"主题簇"）
TAG_GROUPS: list[tuple[str, str]] = [
    ("#rag", "#e03131"), ("#graphrag", "#c2255c"), ("#mcp", "#3b5bdb"),
    ("#langchain", "#4263eb"), ("#llamaindex", "#6741d9"), ("#skills", "#e64980"),
    ("#loop-engineering", "#f76707"), ("#harness", "#d9480f"),
    ("#context-engineering", "#0c8599"),
    ("#react", "#7048e8"), ("#reflection", "#94d82d"), ("#workflow", "#9775fa"),
    ("#agent", "#fab005"), ("#planning", "#69db7c"), ("#evals", "#a61e4d"),
    ("#tool-use", "#4dabf7"),
    ("#spring", "#66a80f"), ("#java", "#f1c40f"), ("#mybatis", "#0ca678"),
    ("#transaction", "#845ef7"), ("#design-pattern", "#d6336c"), ("#interview", "#b197fc"),
    ("#rate-limit", "#f59f00"), ("#high-availability", "#ff922b"),
    ("#system-design", "#ffe066"),
    ("#docker", "#1098ad"), ("#kubernetes", "#1c7ed6"), ("#container", "#22b8cf"),
    ("#devops", "#15aabf"), ("#coding-habits", "#a0611a"), ("#vector-db", "#fd7e14"),
    ("#python", "#5f3dc4"),
]

# 第二层：路径兜底组（保证没打上述标签的节点也有色）
PATH_GROUPS: list[tuple[str, str]] = [
    ("path:01-Wiki/summaries", "#f08c00"),
    ("path:01-Wiki/entities", "#1971c2"),
    ("path:01-Wiki/concepts", "#2f9e44"),
    ("path:02-Rules", "#9c36b5"),
    ("path:00-Raw", "#868e96"),
]

GROUPS = TAG_GROUPS + PATH_GROUPS


def desired() -> list[dict]:
    return [
        {"query": q, "color": {"a": 1, "rgb": int(hex_color.lstrip("#"), 16)}}
        for q, hex_color in GROUPS
    ]


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="只校验，不写文件")
    args = parser.parse_args()

    if not GRAPH.exists():
        print(f"✗ 找不到 {GRAPH.relative_to(ROOT)}", file=sys.stderr)
        return 1

    data = json.loads(GRAPH.read_text(encoding="utf-8"))
    want = desired()
    current = data.get("colorGroups", [])

    if current == want:
        print(f"✓ 配色已是最新（{len(want)} 组：{len(TAG_GROUPS)} 标签 + {len(PATH_GROUPS)} 路径）")
        return 0

    if args.check:
        print(f"✗ 配色不一致：文件里 {len(current)} 组，应为 {len(want)} 组")
        if not current:
            print("  ⚠ colorGroups 为空 → 图谱会整体显示为灰色")
        print("  运行 `python3 scripts/graph_colors.py` 修复")
        return 1

    data["colorGroups"] = want
    GRAPH.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"✓ 已写回 {len(want)} 组配色（{len(TAG_GROUPS)} 标签 + {len(PATH_GROUPS)} 路径）")
    print("  在 Obsidian 中关闭并重开图谱视图（或 Cmd+R 重载）后生效")
    return 0


if __name__ == "__main__":
    sys.exit(main())
