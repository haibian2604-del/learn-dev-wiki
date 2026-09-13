# my-knowledge · LLM Wiki

> 个人技术知识库：以 [Karpathy LLM Wiki](https://github.com/karpathy) 方法论搭建的 **Obsidian vault**。
> 原始资料冻结存档，Wiki 页由 LLM 全权维护，分类规则写入 schema 层。

- **源文件**：107 篇（18 个知识点文件夹）
- **Wiki 页面**：191 页（107 摘要 / 28 实体 / 56 概念）
- **远端仓库**：`git@github.com:haibian2604-del/learn-dev-wiki.git`

---

## 一、三层架构

```
my-knowledge/                    # Obsidian vault = 一个普通文件夹
├── 00-Raw/                      # RAW 层：内容不可变，只读；按知识点分文件夹
│   ├── inbox/                   #   新源文件暂存区，ingest 前放这里
│   ├── <knowledge-point>/       #   18 个知识点文件夹（见下表）
│   ├── images/                  #   剪藏源文件的本地配图（供 `../images/` 相对引用，非知识点）
│   └── README.md                #   本层使用说明 + 目录清单
├── 01-Wiki/                     # WIKI 层：LLM 全权维护
│   ├── index.md                 #   内容索引（回答查询先读这里）
│   ├── log.md                   #   时间日志（append-only）
│   ├── summaries/               #   来源摘要：每个源一篇
│   ├── entities/                #   实体页：人 / 组织 / 产品 / 项目
│   └── concepts/                #   概念页：理论 / 术语 / 方法
├── 02-Rules/                    # SCHEMA 层：LLM 的纪律来源
│   ├── AGENTS.md                #   维护手册（工作流 + 页面模板 + 看板规则）
│   └── 分类体系.md              #   分类规则（domain 词表 + 知识点目录 + 配色）
├── index.html                   # 展示层：知识库看板（双击直接打开，无需服务）
│   ├── pages/                   #   列表子页：summaries / entities / concepts
│   ├── assets/                  #   看板样式与脚本；vendor/ 存第三方库本地副本
│   ├── data/wiki-data.js        #   看板数据（由 scripts/build.py 生成，需提交 git）
│   └── scripts/                 #   build.py 看板数据生成器 · graph_colors.py 图谱配色生成器
├── Clippings/                   # 网页剪藏落地区（待 ingest）
└── AGENTS.md                    # 代理入口速览
```

**铁律**

1. `00-Raw/` 源文件**内容永不修改**（唯一允许的写操作：在层内移动以分类）
2. Wiki 层完全由 LLM 维护，用户只读浏览
3. 好答案（对比 / 分析 / 发现的联系）必须归档回 Wiki，不能消失在对话里
4. 每个页面必标 `domain` + `tags`，不得自创游离标签

---

## 二、00-Raw 知识点目录（18 个）

不同知识点的源文件放入不同文件夹；出现**全新知识点**则新建文件夹并登记到 [[02-Rules/分类体系]] §9。

| 文件夹 | 知识点 | 篇数 | | 文件夹 | 知识点 | 篇数 |
|--------|--------|:---:|---|--------|--------|:---:|
| `agent-basics/` | Agent 入门与架构 | 33 | | `agent-skills/` | Agent Skills 编写 | 2 |
| `agent-engineering/` | Agent 工程化 | 13 | | `rag/` | RAG 与检索 | 8 |
| `agent-training/` | Agent 训练与评测 | 7 | | `vector-db/` | 向量数据库 | 2 |
| `agent-frameworks/` | 框架全景与选型 | 4 | | `llamaindex/` | LlamaIndex | 6 |
| `agent-interview/` | Agent 面试题库与考点 | 3 | | `java-backend/` | Java 后端 | 6 |
| `context-engineering/` | 上下文工程 | 3 | | `system-design/` | 系统设计与高可用 | 2 |
| `harness/` | Harness Engineering | 2 | | `devops/` | Docker / K8s | 3 |
| `loop-engineering/` | Loop Engineering | 5 | | `coding-habits/` | 工程素养 | 1 |
| `mcp/` | MCP 协议与开发 | 6 | | `academic/` | 学术论文 | 1 |
| `inbox/` | 暂存区（未分类） | — | | `images/` | 剪藏配图附件（非知识点） | 70 |

---

## 三、工作流

| 流程 | 触发 | 动作 |
|------|------|------|
| **Ingest** | 新源放入 `00-Raw/inbox/` 并说"处理这个" | 读源 → 写摘要 → 更新 `index.md` → 联动实体/概念页 → 记 `log.md` → 按知识点归档 + 同步改链 |
| **Query** | 向 LLM 提问 | 先读 `index.md` 定位 → 深入阅读 → 答案引用来源 → 有价值的答案归档为新页 |
| **Lint** | 定期健康检查 | 查矛盾 / 过期声明 / 孤儿页 / 缺失页 / 数据缺口 → 产出修复清单 |

> 详细步骤与页面模板见 [[02-Rules/AGENTS.md]]。

---

## 四、分类体系

- **domain（一级主题，必填且唯一）**：`tech` / `product` / `business` / `academic` / `life` / `reading` / `other`
- **tags（细分主题，1-3 个）**：小写英文连字符（如 `rag`、`mcp`、`loop-engineering`），从词表选取
- **status（成熟度）**：`seedling` → `growing` → `mature`

「两层各用各的维度」：`01-Wiki/` 目录按**页面类型**组织、主题靠 frontmatter；`00-Raw/` 目录按**知识点**组织。完整规则见 [[02-Rules/分类体系]]。

---

## 五、看板（根目录 `index.html`）

> 知识库的**只读展示层**。**双击 `index.html` 就能看** —— 不需要起服务、不需要联网、不需要装依赖。

| 页面 | 内容 |
|------|------|
| `index.html` | 概览看板：规模统计 / 类型·状态·领域构成 / 知识点分布 / 高频标签 / 增长曲线 / `log.md` 最近活动 |
| `pages/summaries.html` | 摘要列表（107），支持领域 · 状态 · 标签筛选 + 关键词搜索 |
| `pages/entities.html` | 实体列表（28），同上 |
| `pages/concepts.html` | 概念列表（56），同上 |

```bash
# 每次 ingest 后刷新数据（唯一需要的命令）
python3 scripts/build.py

# 可选：另起本地服务（非必需，双击打开即可）
python3 scripts/build.py --serve
```

设计约束（详见 [[02-Rules/AGENTS.md]] §7）：数据与视图分离 · 第三方库本地化不用 CDN · 生成产物 `data/wiki-data.js` 提交 git · 前端不硬编码色值。

---

## 六、可视化约定

- **颜色片段**：`.obsidian/snippets/wiki-colors.css`，需在「设置 → 外观 → CSS 代码片段」启用 `wiki-colors`
- **类型配色**：摘要🟠 / 实体🔵 / 概念🟢 / 规则🟣
- **图谱配色**：`.obsidian/graph.json` 双层策略 —— 32 个子域标签组（按 `#tag` 着色）在前，5 个路径兜底组在后
  - ⚠️ **2026-09-13 修复**：`colorGroups` 曾被 Obsidian 覆写成空数组 `[]`，导致**整张图谱全灰**；已写回 37 组。配置的唯一数据源是 `scripts/graph_colors.py`，再遇全灰先跑 `python3 scripts/graph_colors.py --check`
- **Dataview**：`index.md` 顶部含动态查询块，需安装 Dataview 插件
- **网页看板**：与以上共用同一套配色，不另起一套（见 [[02-Rules/分类体系]] §8.5）

---

## 七、仓库与协作

```bash
# 克隆
git clone git@github.com:haibian2604-del/learn-dev-wiki.git

# 日常
git add -A && git commit -m "..." && git push
```

- `.gitignore` 排除：`.DS_Store`、`.obsidian/workspace.json`（易变的 UI 状态）、`.workbuddy/`（工具内部记忆）
- 每次会话的工作成果 ≈ 一次 commit；`log.md` 记录每次 Ingestion / Query / Lint
- 看板数据 `data/wiki-data.js` **要提交**：clone 后无需装环境即可直接浏览

---

## 八、给 LLM 代理

**开始工作前必须阅读 [[02-Rules/AGENTS.md]]**（维护手册）与 [[02-Rules/分类体系]]（分类规则）。

要点：源不可改但可移动分类 · Wiki 全权维护 · 分类必标 `domain` + `tags` · 移动文件后必须同步更新 `[[00-Raw/...]]` 链接 · ingest 后跑 `scripts/build.py` 刷新看板。
