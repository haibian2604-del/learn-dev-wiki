# AGENTS.md — LLM Wiki 维护手册

> 本文件是知识库的 **schema 层**（参考 Karpathy LLM Wiki 方法论）。
> 任何在本仓库工作的 LLM 代理都必须阅读并遵守本文件。
> 用户与本文件共同演进：发现更好用的约定，随时补充到这里。

## 1. 三层架构

```
my-knowledge/  (Obsidian vault = 一个普通文件夹)
├── 00-Raw/           # RAW 层：内容不可变，只读。按「知识点」分文件夹存放源文件
│   ├── inbox/        # 新源文件暂存区（未分类），LLM ingest 前放这里
│   ├── <knowledge-point>/   # 知识点文件夹，如 agent-basics/ rag/ mcp/ java-backend/
│   └── README.md     # 使用说明 + 知识点目录清单
├── 01-Wiki/          # WIKI 层：LLM 全权维护的 markdown 页面
│   ├── index.md      # 内容索引（目录）
│   ├── log.md        # 时间日志（append-only）
│   ├── entities/     # 实体页：人、组织、产品、项目、作品
│   ├── concepts/     # 概念页：理论、术语、方法
│   └── summaries/    # 来源摘要页：每个源文件一篇
└── 02-Rules/         # SCHEMA 层：本文件所在处，LLM 的纪律来源
    ├── AGENTS.md     # 维护手册（本文件）
    └── 分类体系.md   # 知识点分类规则（taxonomy）
```

**铁律**
- **原始资料「内容」不可修改**。`00-Raw/` 下源文件的正文一经入库即冻结，LLM 绝不能编辑、改写、删除其内容。
- **但允许按知识点重组目录**：LLM 可将源文件在 `00-Raw/` **内部移动**（`inbox/` → 知识点文件夹、跨夹调整），以保持分类有序。**移动 ≠ 修改内容**，这是唯一被允许的 `00-Raw` 写操作。
- **知识库按知识点分文件夹**：不同知识点的源文件放入不同文件夹；出现全新知识点时**新建文件夹**并在 [[02-Rules/分类体系]] §9 登记。
- **Wiki 层完全由 LLM 维护**，用户只读和浏览。
- 好答案（对比、分析、发现的联系）必须**归档回 wiki**，不能消失在对话里。
- **每个页面必须按 [[02-Rules/分类体系]] 标注分类**（domain + tags），不得自创游离标签。

## 2. 页面约定

### 2.1 Frontmatter（YAML，必填）

```yaml
---
type: summary | entity | concept | index
domain: tech | product | business | academic | life | reading | other  # 一级主题，见 02-Rules/分类体系.md
tags: [标签1, 标签2]                 # 细分主题，1-3 个，从分类体系词表选
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: ["[[00-Raw/<知识点>/<源文件名>]]"]  # 关联的原始资料，summary 必填；必须含知识点文件夹
status: seedling | growing | mature  # 成熟度：新生 / 成长中 / 成熟
---
```

> 分类规则详见 [[02-Rules/分类体系]]：domain 词表、topic 命名规范、扩展规则。

### 2.2 页面类型

| 类型 | 目录 | 内容 |
|------|------|------|
| 摘要 summary | `01-Wiki/summaries/` | 每篇原始资料一篇：核心观点、关键数据、亮点/不足、与既有知识的联系 |
| 实体 entity | `01-Wiki/entities/` | 人/组织/产品/项目：定义、关键事实、相关页面链接 |
| 概念 concept | `01-Wiki/concepts/` | 理论/术语：定义、机制、例子、相关概念链接 |

### 2.3 命名与链接

- 文件名 = 页面主体名，如 `01-Wiki/concepts/Transformer.md`、`01-Wiki/entities/OpenAI.md`
- 页面内用 **Obsidian 双向链接** `[[concepts/Transformer]]` 交叉引用，禁止无链接的孤岛页面
- 一个来源首次出现在 wiki 时，`summaries/` 页必须链回原始资料，实体/概念页必须链向摘要页

### 2.4 一致性规则

- 新源**反驳**旧观点时：在相关页面明确标注"⚠️ 已被 [[链接]] 更新/反驳"，不得静默覆盖
- 每个页面顶部标注状态和最后更新时间，确保读者知道新鲜度

### 2.5 页面模板（LLM 新建页面时按此骨架写）

**摘要页** `01-Wiki/summaries/<源标题>.md`：

```markdown
---
type: summary
domain: <主题领域，见分类体系>
tags: [主题标签]
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: ["[[00-Raw/<源文件名>]]"]
status: growing
---

# <源标题>

> 一句话概括全文主旨。

## 核心观点
- **观点 1**：说明（→ 关联 [[concepts/xxx]] / [[entities/yyy]]）
- **观点 2**：说明

## 关键数据
| 指标 | 数值 | 出处 |
|------|------|------|
| ... | ... | ... |

## 亮点与不足
- 亮点：
- 不足：

## 与既有知识的联系
- 支持/反驳 [[concepts/既有概念]]（反驳时加 ⚠️ 标注）
- 补充 [[entities/既有实体]] 的新事实

## 延伸问题
- 待深挖的问题（lint 时转为新页面候选）
```

**实体页** `01-Wiki/entities/<名称>.md`：

```markdown
---
type: entity
domain: <主题领域>
tags: [标签]
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: ["[[01-Wiki/summaries/xxx]]"]
status: seedling
---

# <名称>

## 是什么
- 定义与简介

## 关键事实
- 事实（→ 来源 [[01-Wiki/summaries/xxx]]）

## 时间线（如适用）
- 2026-XX-XX：事件

## 相关
- 相关实体：[[entities/xxx]]
- 相关概念：[[concepts/xxx]]
```

**概念页** `01-Wiki/concepts/<术语>.md`：

```markdown
---
type: concept
domain: <主题领域>
tags: [标签]
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: ["[[01-Wiki/summaries/xxx]]"]
status: seedling
---

# <术语>

## 定义
- 一句话定义

## 机制/原理
- 逐步说明

## 例子
- 具体例子（→ 来源）

## 边界与常见误区
- 易混淆点、适用/不适用范围

## 相关概念
- [[concepts/相关1]]、[[concepts/相关2]]
```

## 3. 工作流

### 3.1 Ingest（摄入，最核心）

用户放入新源文件到 `00-Raw/inbox/` 并说"处理这个"时：

1. **读**：读取源文件全文，理解内容
2. **讨论**：先和用户过一遍关键要点，确认强调重点（单篇摄入时）
3. **写摘要**：在 `01-Wiki/summaries/` 创建摘要页
4. **更新索引**：更新 `index.md`，添加该页条目
5. **联动更新**：新建/更新涉及的实体页、概念页，添加交叉引用（一篇源可能触碰 10-15 个页面）
6. **记日志**：向 `log.md` 追加一条，格式见下
7. **归档**：判定源文件的**知识点**，将其从 `inbox/` 移入 `00-Raw/<知识点文件夹>/`；若无匹配文件夹 → **新建一个**（英文小写连字符命名，见 [[02-Rules/分类体系]] §9）并登记到分类体系与 `log.md`
   - 移动文件后，**必须同步更新** `sources:` 等所有指向该源的 `[[00-Raw/...]]` 链接，避免死链
8. **刷新看板**：`python3 scripts/build.py`，让根目录的网页看板与内容同步（见 §7）

批量摄入（用户一次性放多篇）时流程相同，但第 2 步可以跳过，逐篇处理并保持索引一致。

### 3.2 Query（查询）

1. 先读 `01-Wiki/index.md` 定位相关页面，再深入阅读
2. 答案必须**引用来源**（链到对应摘要页/原始资料）
3. 有价值的答案（对比、分析、总结）→ 询问用户是否归档为新 wiki 页面

### 3.3 Lint（健康检查，定期做）

检查项：
- 页面间的**矛盾**（新源是否反驳旧页）
- **过期声明**（被新源取代的旧观点）
- **孤儿页**（没有入链的页面 → 补链接或标记）
- **缺失页**（摘要中反复出现的概念却没有自己的页面 → 建议新建）
- **数据缺口**（哪些问题值得上网搜索补齐）

产出：一份修复清单，与用户确认后执行修复；尚未处理的缺口登记到 `index.md` 的「待办与缺口」区。

## 4. 日志格式（可被 unix 工具解析）

`log.md` 中每条记录固定前缀：

```markdown
## [2026-07-31] ingest | 文章标题
## [2026-07-31] query | 用户问题简述
## [2026-07-31] lint | 发现 3 处矛盾，修复 2 处
```

可用 `grep "^## \[" 01-Wiki/log.md | tail -5` 查看最近 5 条活动。

## 5. 协作模式

- 本仓库是**一个普通 git 仓库**，LLM 每次会话的工作成果 = 一次 commit
- Obsidian 是 IDE，LLM 是程序员，wiki 是代码库
- 用户负责：选源、提问、判断方向。LLM 负责：全部书呆子活（总结、交叉引用、归档、维护）

## 6. 可选工具（按需启用）

- **qmd**：本地 markdown 搜索引擎（BM25+向量+重排），wiki 规模大了以后替代 index.md 手工检索
- **Obsidian Dataview**：基于 frontmatter 自动生成动态表格。在 `index.md` 顶部可放 Dataview 代码块，自动列出全部页面（不依赖手工登记）：

````markdown
```dataview
TABLE type AS 类型, status AS 状态, date(updated) AS 更新于
FROM "01-Wiki"
WHERE type
SORT updated DESC
```
````

- **Marp**：从 wiki 内容一键生成幻灯片
- **Obsidian Web Clipper**：浏览器插件，把网页一键转 markdown 投入 `00-Raw/inbox/`

## 7. 看板维护（根目录 `index.html`）

> 看板是知识库的**只读展示层**：把 `01-Wiki/` 的内容以网页形式呈现，供用户快速浏览与纵览规模。
> 它**不产生新知识、不参与分类**——改看板 ≠ 改知识。

### 7.1 硬约束（不得违反）

| 约束 | 说明 |
|------|------|
| **双击即用** | 直接双击 `index.html` 用浏览器打开（`file://`）即可浏览，**不需要起服务、不需要联网、不需要装依赖** |
| **数据与视图分离** | 数据由 `scripts/build.py` 生成到 `data/wiki-data.js`，页面只负责渲染；**禁止手工编辑生成产物** |
| **配色不另起一套** | 全部色值取自 [[02-Rules/分类体系]] §8，与 Obsidian 的 `wiki-colors.css` / `graph.json` 保持一致 |
| **只读** | 看板不得修改 `00-Raw/` 与 `01-Wiki/` 的任何内容 |

### 7.2 文件结构

```
index.html                 # 概览看板：规模 / 构成分布 / 主题分布 / 增长 / 最近活动
pages/summaries.html       # 摘要列表
pages/entities.html        # 实体列表
pages/concepts.html        # 概念列表
assets/style.css           # 共用样式（分类体系配色 token 落在这里）
assets/nav.js              # 顶部导航 + 页脚；NAV 数组是导航的唯一数据源
assets/app.js              # 渲染与交互逻辑（零依赖、零网络请求）
assets/vendor/             # 第三方库本地副本（当前：Chart.js 4.4.1 UMD）
data/wiki-data.js          # ← 生成产物，必须提交 git
scripts/build.py           # 生成器（Python 纯标准库，无第三方依赖）
```

### 7.3 生成与查看

```bash
python3 scripts/build.py            # 刷新 data/wiki-data.js
python3 scripts/build.py --serve    # 可选：另起本地服务（非必需）
```

- 产物形如 `window.KB_DATA = {...}`，用 `<script src>` 引入。**不要改回 `.json` + `fetch()`**——`file://` 协议下 fetch 会被 CORS 拦截，双击打开会白屏。
- 第三方库一律放 `assets/vendor/` 本地副本，**禁止改用 CDN**，否则断网或被墙时图表全白。
- `data/wiki-data.js` **必须提交进 git**：clone 下来无需装环境、无需跑脚本即可直接浏览。

### 7.4 数据来源与提取规则

| 看板字段 | 提取来源 |
|----------|----------|
| 页面元数据 | 各页 frontmatter 的 `type / domain / tags / status / created / updated / sources` |
| 一句话简介 | 摘要页取 H1 后的首个 `>` 引用块；实体 / 概念页取首个正文章节的首句话 |
| 规模统计 | `01-Wiki/` 页数、`00-Raw/` 文件数、`[[...]]` 双链总数、标签数 |
| 知识点分布 | `00-Raw/` 各知识点夹的文件数，中文名读自 [[02-Rules/分类体系]] §9.1 |
| 增长曲线 | 累计页面取 frontmatter 的 `created`；摄入量取 `log.md` 的 `ingest` 记录 |
| 最近活动 | `log.md` 最后 12 条 |

> ⚠️ 由上看板的数据质量**直接受写页习惯影响**：frontmatter 字段缺失、摘要页删掉一句话引用块、`log.md` 不按 §4 格式追加，都会让看板缺数据。**写页时必须守住这三条**。

### 7.5 何时更新

- **每次 ingest / lint / update 之后**：作为工作流最后一步跑一次 `build.py`（见 §3.1 第 8 步）
- 只改看板代码 / 样式时：**无需**重新生成数据，浏览器刷新即可
- 看板右上角显示「数据生成于 …」时间戳，可据此判断是否需要刷新

### 7.6 扩展规则

- **新增知识点**：`00-Raw/` 建新夹 → 在 [[02-Rules/分类体系]] §9.1 登记 → 重新生成数据，看板的「按知识点分布」自动出现新条目
- **新增 domain / 常用 tag**：在 §8 登记颜色 → 同步 `assets/style.css` 的 CSS 变量与 `scripts/build.py` 的 `DOMAIN_META`，与 `wiki-colors.css` / `graph.json` 共四处一致
- **新增页面类型**：① `01-Wiki/` 建目录 → ② `pages/<类型>.html` 新建列表页 → ③ `assets/nav.js` 的 `NAV` 加一项 → ④ `scripts/build.py` 的 `TYPE_META` 与 `KIND_DIR` 登记
- **拆包阈值**：单个列表页超过约 **120 条**时拆成 `pages/<类型>-<子分组>.html`（按 domain 或首字母分组），并在 `NAV` 挂为二级入口；`index.html` **始终只放概览，不放长列表**
- **前端不硬编码色值**：分类色统一从 `data/wiki-data.js` 的 `typeMeta / domainMeta / statusMeta / palette` 读取
