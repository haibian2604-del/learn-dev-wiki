# Wiki 日志 (Log)

> 时间线记录，**append-only**，只允许在末尾追加，绝不改写历史。
> 每次 ingest / query / lint / update 追加一条。
> 可解析性：`grep "^## \[" 01-Wiki/log.md | tail -5` 查看最近 5 条活动。

## 操作类型

| 前缀 | 触发时机 | 内容要点 |
|------|----------|----------|
| `init` | 初始化/重构 | 本次变更概要 |
| `ingest` | 摄入新源 | 源文件名、新增/更新的页面清单、归档位置 |
| `query` | 查询后归档 | 问题、归档的新页面名 |
| `lint` | 健康检查 | 发现的问题数、修复数、遗留缺口 |
| `update` | 页面修订 | 修订的页面、原因（新源反驳/纠错等） |

## 记录格式

```markdown
## [YYYY-MM-DD] 操作 | 简述

- 要点 1
- 要点 2
```

---

## [2026-07-31] init | 初始化 LLM Wiki 知识库

- 按 Karpathy LLM Wiki 方法论搭建三层架构
- 目录：00-Raw（只读源）/ 01-Wiki（LLM 维护）/ 02-Rules（schema）
- 约定详见 [[02-Rules/AGENTS.md]]
- 下一步：摄入第一篇源，实测 ingest 全链路

## [2026-07-31] update | 目录英文化

- 00-原始资料/待处理 → `00-Raw/inbox`
- 01-Wiki/实体/摘要/概念 → `01-Wiki/entities|summaries|concepts`
- 02-规则 → `02-Rules`
- 已同步更新 AGENTS.md、index.md、log.md、分类体系.md、00-Raw/README.md 中的全部路径与链接
- 发现：Clippings/ 下已有剪藏「第 19 章 RAG 检索增强生成」，待 ingest

## [2026-07-31] ingest | 第 19 章 RAG 检索增强生成

- 源文件：Clippings/ → 已归档至 `00-Raw/rag/第 19 章 RAG 检索增强生成.md`
- 新增摘要页：[[01-Wiki/summaries/第 19 章 RAG 检索增强生成]]
- 新增概念页：[[01-Wiki/concepts/RAG]]、[[01-Wiki/concepts/文本分块]]、[[01-Wiki/concepts/Document]]
- 新增实体页：[[01-Wiki/entities/LangChain]]、[[01-Wiki/entities/Redis向量库]]
- 已同步更新 [[01-Wiki/index.md]]（登记 6 页 + 3 项待办缺口）
- 分类：domain=tech，tags=rag/langchain/llm/chunking/vector-db/document/retrieval

<!-- 示例（下一条 ingest 后删除）：
## [2026-07-31] ingest | <源标题>

- 源文件：00-Raw/inbox/<源文件> → 已归档至 00-Raw/
- 新增摘要页：[[01-Wiki/summaries/<源标题>]]
- 新增概念页：[[01-Wiki/concepts/<术语>]]
- 更新实体页：[[01-Wiki/entities/<实体>]]
- 已同步更新 [[01-Wiki/index.md]]
-->

## [2026-07-31] ingest | 第 20 章 MCP 模型上下文协议

- 源文件：Clippings/ → 已归档至 `00-Raw/mcp/第 20 章 MCP 模型上下文协议.md`
- 新增摘要页：[[01-Wiki/summaries/第 20 章 MCP 模型上下文协议]]
- 新增概念页：[[01-Wiki/concepts/MCP]]
- 新增实体页：[[01-Wiki/entities/FastMCP]]
- 已同步更新 [[01-Wiki/index.md]]（现共 10 页 + 5 项待办缺口）
- 已同步 wiki-colors.css：新增 mcp/fastmcp/agent/protocol/python 标签颜色（分类体系 §8.3 约定）
- 分类：domain=tech，tags=mcp/agent/langchain/fastmcp/protocol/python

## [2026-07-31] ingest | hello-agents 教程四章（批量摄入）

- 源文件（Clippings/ 4 分片，已重命名归档至 00-Raw/）：
  - Extra05-Agent Skills与MCP.md、Extra08-如何写出好的Skill.md、第九章-上下文工程.md、第四章-智能体经典范式构建.md
- 新增摘要页 ×4：Agent Skills 与 MCP、如何写出好的 Skill、第九章 上下文工程、第四章 智能体经典范式构建
- 新增概念页 ×3：[[01-Wiki/concepts/Agent Skills]]、[[01-Wiki/concepts/上下文工程]]、[[01-Wiki/concepts/ReAct]]
- 新增实体页 ×1：[[01-Wiki/entities/hello-agents]]
- 已同步更新 [[01-Wiki/index.md]]（现共 18 页）
- 已同步 wiki-colors.css：新增 skills/context-engineering/react/framework 标签颜色
- 分类：domain=tech，tags=agent/skills/mcp/context-engineering/react/framework/python

## [2026-07-31] ingest | JavaGuide AI Agent 系列 5 篇（批量）

- 源文件：Clippings/ 5 分片 → 重命名归档至 00-Raw/
  - JavaGuide-上下文工程.md、Harness Engineering.md、Loop Engineering.md、MCP.md、Workflow Graph Loop.md
- 新增摘要页 ×5：JavaGuide 上下文工程（补充已有）、Harness Engineering、MCP（补充已有）、Loop Engineering、Workflow Graph Loop
- 新增概念页 ×3：[[01-Wiki/concepts/Harness Engineering]]、[[01-Wiki/concepts/Loop Engineering]]、[[01-Wiki/concepts/Workflow Graph]]
- 更新已有概念页 ×2：[[01-Wiki/concepts/上下文工程]]（+审计清单/条件注入/Compaction触发）、[[01-Wiki/concepts/MCP]]（+工具选择/生产级关注点）
- 已同步更新 [[01-Wiki/index.md]]（现共 26 页）
- 分类：domain=tech

## [2026-07-31] ingest | JavaGuide Spring 系列 5 篇（批量）

- 源文件：Clippings/ 5 分片（Clipper 文件名残留 drawio-chart-skill，实为 Spring 系列）→ 重命名归档至 00-Raw/
  - JavaGuide-Spring IoC与AOP.md、SpringBoot自动装配.md、Spring设计模式.md、Spring面试题.md、Spring事务.md
- 新增摘要页 ×5（对应 5 篇源）
- 新增概念页 ×2：[[01-Wiki/concepts/IoC]]、[[01-Wiki/concepts/AOP]]
- 新增实体页 ×1：[[01-Wiki/entities/Spring]]（来源 ×5）
- 已同步更新 [[01-Wiki/index.md]]（现共 34 页）
- 分类：domain=tech，tags=spring/ioc/aop/java

## [2026-07-31] ingest | JavaGuide 杂项 4 篇（MyBatis/高可用/限流/坏习惯）

- 源文件：Clippings/ 4 分片 → 重命名归档至 00-Raw/
  - JavaGuide-MyBatis面试题.md、高可用系统设计面试题.md、服务限流详解.md、糟糕程序员的20个坏习惯.md
- 新增摘要页 ×4
- 新增概念页 ×1：[[01-Wiki/concepts/限流]]
- 新增实体页 ×1：[[01-Wiki/entities/MyBatis]]
- 已同步更新 [[01-Wiki/index.md]]
- 分类：domain=tech，tags=mybatis/rate-limit/high-availability

## [2026-07-31] ingest | 容器化 3 篇（Docker/K8s/对比）

- 源文件：Clippings/ 3 篇 → 归档至 00-Raw/
  - Docker超详细教程-CSDN笔记.md、Kubernetes超详细教程-从入门到实战.md、Docker与K8s对比-阿里云.md
- 新增摘要页 ×3：Docker超详细教程、Kubernetes超详细教程、Docker与K8s对比
- 新增概念页 ×2：[[01-Wiki/concepts/Docker]]、[[01-Wiki/concepts/Kubernetes]]
- 已同步更新 [[01-Wiki/index.md]]
- 分类：domain=tech，tags=docker/kubernetes/container/devops

## [2026-07-31] ingest | Loop Engineering 深度解析（知乎，补充已有概念）

- 源文件：Clippings/ → 归档至 `00-Raw/loop-engineering/Loop Engineering深度解析-知乎.md`
- 新增摘要页：[[01-Wiki/summaries/Loop Engineering深度解析]]
- 更新已有概念页：[[01-Wiki/concepts/Loop Engineering]]（+五阶段循环/六大要素/闭环五要素/状态外置哲学）
- 已同步更新 [[01-Wiki/index.md]]
- 分类：domain=tech，tags=loop-engineering/agent/ai-coding

## [2026-07-31] ingest | Loop Engineering 完全指南（muximxc，补充已有概念）

- 源文件：Clippings/ → 归档至 `00-Raw/loop-engineering/Loop Engineering完全指南-muximxc.md`
- 新增摘要页：[[01-Wiki/summaries/Loop Engineering完全指南]]
- 更新已有概念页：[[01-Wiki/concepts/Loop Engineering]]（+三段演化/Open-Loop vs Closed-Loop/与 Vibe Coding·Harness·Agentic 辨析/学术基础 TTT/实战反模式与成本策略；status 升 mature，sources ×3）
- 已同步更新 [[01-Wiki/index.md]]（Loop Engineering 概念条目来源 ×2 → ×3）
- 分类：domain=tech，tags=loop-engineering/harness/vibe-coding

## [2026-08-01] ingest | GraphRAG 系列 5 篇（Datawhale all-in-rag 第7/9章）

- 源文件：Clippings/ 5 篇 → 归档至 `00-Raw/`（基于知识图谱的RAG / 图RAG架构设计 / 图数据建模与准备 / Milvus索引构建 / 智能查询路由与检索策略）
- 新增摘要页 ×5：[[01-Wiki/summaries/基于知识图谱的RAG]]、[[01-Wiki/summaries/图RAG架构设计]]、[[01-Wiki/summaries/图数据建模与准备]]、[[01-Wiki/summaries/Milvus索引构建]]、[[01-Wiki/summaries/智能查询路由与检索策略]]
- 新增概念页 ×4：[[01-Wiki/concepts/GraphRAG]]、[[01-Wiki/concepts/知识图谱]]、[[01-Wiki/concepts/查询路由]]、[[01-Wiki/concepts/实体关系抽取]]
- 新增实体页 ×2：[[01-Wiki/entities/Neo4j]]、[[01-Wiki/entities/Milvus]]
- 更新已有页：[[01-Wiki/concepts/RAG]]（补 GraphRAG 分支入口）、[[01-Wiki/entities/Redis向量库]]（补 Milvus 对比）
- 已同步更新 [[01-Wiki/index.md]]（+11 条目，2 项开放问题标注已覆盖）
- 新增标签 `#graphrag`（#c2255c），已同步 graph.json（32 组）与 wiki-colors.css
- 分类：domain=tech，tags=graphrag（全系列统一聚类）

## [2026-08-01] ingest | 向量数据库全面解析（6 大方案对比+选型）
- 源文件：Clippings/【实战选型】向量数据库全面解析… → 归档至 `00-Raw/`
- 新增摘要页 ×1：[[01-Wiki/summaries/向量数据库全面解析]]
- 新增概念页 ×1：[[01-Wiki/concepts/向量数据库]]（ANN 算法/与传统DB区别）
- 新增实体页 ×5：[[01-Wiki/entities/Pinecone]]、[[01-Wiki/entities/Qdrant]]、[[01-Wiki/entities/Chroma]]、[[01-Wiki/entities/Weaviate]]、[[01-Wiki/entities/pgvector]]
- 更新已有页：[[01-Wiki/entities/Milvus]]（加 vector-db 标签+选型定位+5 家链接）、[[01-Wiki/entities/Redis向量库]]（补六方横评链接）
- 已同步更新 [[01-Wiki/index.md]]（+7 条目：1 摘要/1 概念/5 实体；开放问题"生产级向量库选型"标注已覆盖）
- 标签复用 `#vector-db`（#fd7e14，分类体系 §8.4 已登记），无需新配色
- 分类：domain=tech，tags=vector-db

## [2026-08-01] ingest | AI Agent 框架系列 2 篇（12 框架全景 + 10 开源选型）
- 源文件：Clippings/ 2 篇 → 归档至 `00-Raw/`（2026 年 AI Agent 技术全景 / 2026年AI Agent框架选型实战）
- 新增摘要页 ×2：[[01-Wiki/summaries/2026 年 AI Agent 技术全景]]、[[01-Wiki/summaries/2026年AI Agent框架选型实战]]
- 新增概念页 ×1：[[01-Wiki/concepts/AI Agent]]（6 大模块 + MCP/A2A/Skills 三大协议 + 与传统 AI 对比）
- 新增实体页 ×5：[[01-Wiki/entities/AutoGen]]、[[01-Wiki/entities/AutoGPT]]、[[01-Wiki/entities/LangGraph]]、[[01-Wiki/entities/LlamaIndex]]、[[01-Wiki/entities/CrewAI]]
- 更新已有页：[[01-Wiki/entities/LangChain]]（+agent 标签/框架定位）、[[01-Wiki/concepts/Workflow Graph]]（+LangGraph 实现）、[[01-Wiki/concepts/MCP]]（+三大协议生态）、[[01-Wiki/concepts/Harness Engineering]]（+趋势印证）、[[01-Wiki/concepts/Agent Skills]]（+协议定位）
- 已同步更新 [[01-Wiki/index.md]]（+8 条目：2 摘要/1 概念/5 实体）
- 标签复用 `#agent`（分类体系 §8.4 已登记），无需新配色
- 分类：domain=tech，tags=agent（LangGraph 附加 workflow，LlamaIndex 附加 rag）

## [2026-08-15] ingest | 论文《A Programming Paradigm for Spatiotemporal Composability》（北大+DeepSeek-AI）
- 源文件：Clippings/paper.pdf → 归档至 `00-Raw/academic/A Programming Paradigm for Spatiotemporal Composability.pdf`
- 新增摘要页 ×1：[[01-Wiki/summaries/时空可组合性编程范式]]（academic，tags=harness,agent）
- 新增概念页 ×1：[[01-Wiki/concepts/时空可组合性]]（可逆效应+响应式余效应+组件演算）
- 新增实体页 ×2：[[01-Wiki/entities/Cordis]]（元框架）、[[01-Wiki/entities/Koishi]]（4000+ 插件案例）
- 更新已有页：[[01-Wiki/concepts/Harness Engineering]]（+动态化延伸：自进化 Harness 形式化基础）
- 已同步更新 [[01-Wiki/index.md]]（+4 条目：1 摘要/1 概念/2 实体）
- 标签复用 `#harness`（#d9480f）与 `#agent`（#fab005），无需新配色
- 分类：摘要 domain=academic（论文），概念/实体 domain=tech

## [2026-08-19] ingest | PyLLM LlamaIndex 系列 8 篇（RAG 框架实现与工程化）

- 源文件：Clippings/ 8 篇 → 归档至 `00-Raw/`（为什么需要 LlamaIndex？ / 统一数据接入 Connector 体系 / 文档解析的深度挑战 / VectorStoreIndex 深入 / Query Engine 架构 / 混合检索 / 9.1 项目概述与需求分析 / 10.1 多模态 RAG 概述）
- 新增摘要页 ×8：[[01-Wiki/summaries/为什么需要 LlamaIndex？（RAG 的痛点与 LlamaIndex 的定位）]]、[[01-Wiki/summaries/统一数据接入：LlamaIndex 的 Connector 体系]]、[[01-Wiki/summaries/文档解析的深度挑战]]、[[01-Wiki/summaries/VectorStoreIndex 深入：向量索引的内部机制与优化]]、[[01-Wiki/summaries/Query Engine 架构与工作原理]]、[[01-Wiki/summaries/混合检索：向量搜索 + 关键词搜索的协同]]、[[01-Wiki/summaries/9.1 项目概述与需求分析]]、[[01-Wiki/summaries/10.1 多模态 RAG 概述与场景分析]]
  - ⚠️ 2 篇（为什么需要 LlamaIndex？、统一数据接入 Connector 体系）剪藏残缺（正文仅含 "LlamaIndex" 一词），摘要页仅登记元数据并标注待补全（status=seedling）
- 新增概念页 ×6：[[01-Wiki/concepts/Query Engine]]、[[01-Wiki/concepts/混合检索]]、[[01-Wiki/concepts/BM25]]、[[01-Wiki/concepts/多模态 RAG]]、[[01-Wiki/concepts/文档解析]]、[[01-Wiki/concepts/嵌入模型]]
- 新增实体页 ×1：[[01-Wiki/entities/PyLLM]]（教程来源，来源 ×8）
- 更新实体页 ×1：[[01-Wiki/entities/LlamaIndex]]（补 Connector/文档解析/VectorStoreIndex/Query Engine/混合检索/企业级落地/多模态 内部架构要点，status 升 mature，sources ×1→×9）
- 已同步更新 [[01-Wiki/index.md]]（+8 摘要条目、LlamaIndex 实体条目 ×1→×9、开放问题标注混合检索已深化）
- 链接校验：0 真实死链（8 条 00-Raw 源链接随归档自动修复；index 格式行与 log 示例块占位符为非缺陷误报）；修复 PyLLM.md 畸形链接 `[[01-Wiki/summaries/]]`
- 标签 `llamaindex` 跨 16 页使用但未登记配色，已于 2026-08-21 补登（graph.json 插入 #rag 前 + wiki-colors.css + 分类体系 §8.4，色 #6741d9 靛紫）
- 分类：domain=tech，tags=llamaindex/rag

## [2026-08-21] ingest | Harness Engineering 完全指南（基于 Claude Code 源码级）

- 源文件：Clippings/Harness Engineering 完全指南.md（5033 行，对应 Claude Code ~512K LOC 教程）→ 归档至 `00-Raw/harness/Harness Engineering 完全指南.md`
- 新增摘要页 ×1：[[01-Wiki/summaries/Harness Engineering 完全指南]]（domain=tech，tags=harness/agent）
- 新增实体页 ×1：[[01-Wiki/entities/Claude Code]]（Harness 参考实现，tags=harness/agent）
- 更新已有概念页 ×1：[[01-Wiki/concepts/Harness Engineering]]（补三大支柱/定量 ROI/十大设计哲学/Claude Code 参考实现与竞品对比，status 升 mature，sources ×3→×4）
- 已同步更新 [[01-Wiki/index.md]]（+1 摘要 / +1 实体 / Harness 概念条目 ×1→×4 并标 mature）
- 标签 `harness`/`agent` 已登记（分类体系 §8.4），无需新配色
- 分类：domain=tech，tags=harness/agent

## [2026-08-26] ingest | zero2Agent Agent 基础系列 5 篇（工程视角入门）

- 源文件：Clippings/ 5 篇 → 归档至 `00-Raw/`（什么是 Agent / Workflow 和 Agent 的区别 / 一个 Agent 系统的核心组成 / 为什么很多 Agent Demo 一落地就不稳定 / 大模型 API 输入输出与 Tool Calling）
- 来源：https://onefly.top/zero2Agent/（learn-agent-basic 01-05 章节，工程视角 Agent 教程系列）
- 新增摘要页 ×5：[[01-Wiki/summaries/什么是 Agent]]、[[01-Wiki/summaries/Workflow 和 Agent 的区别]]、[[01-Wiki/summaries/一个 Agent 系统的核心组成]]、[[01-Wiki/summaries/为什么很多 Agent Demo 一落地就不稳定]]、[[01-Wiki/summaries/大模型 API 输入输出与 Tool Calling]]（均 domain=tech，tags=agent）
- 新增概念页 ×1：[[01-Wiki/concepts/Tool Calling]]（工具调用闭环≥2 请求、call ID 因果、并行/流式、Structured Output 边界、工具设计五清晰）
- 新增实体页 ×1：[[01-Wiki/entities/zero2Agent]]（教程来源系列，来源 ×5）
- 更新已有概念页 ×1：[[01-Wiki/concepts/AI Agent]]（补工程视角最小定义 Agent=LLM+Context+Tools、7 核心模块、Workflow vs Agent 分界线、Demo→生产六大断层，status 升 mature，sources ×1→×6）
- 已同步更新 [[01-Wiki/index.md]]（+5 摘要 / +1 实体 / +1 概念 / AI Agent 概念条目 ×1→×6）
- 标签 `agent`（#fab005）已登记，无需新配色
- 分类：domain=tech，tags=agent

## [2026-08-27] ingest | zero2Agent 进阶系列 12 篇（章节 06-17，Agent 工程全链路）

- 源文件：Clippings/ 12 篇 → 归档至 `00-Raw/`（Context、State 与 Memory / Planning、Reflection、RAG / 单 Agent 和多 Agent / Agent Infra / Loop Engineering / Agent 评估 / Coding Agent / Context Engineering / 多模态与实时交互 / Agent 自进化 / 高级 RAG 与记忆架构 / 异步 Agent 与事件驱动）
- 来源：https://onefly.top/zero2Agent/（learn-agent-basic 06-17 章节，承接 2026-08-26 摄入的 01-05）
- 新增摘要页 ×12（均 domain=tech）：Context State Memory（tags=agent/llm）、Planning Reflection RAG（agent/llm）、单多 Agent（agent）、Agent Infra（agent/harness）、Loop Engineering（agent/loop-engineering）、Agent 评估（agent）、Coding Agent（agent）、Context Engineering（agent/context-engineering）、多模态实时（agent）、Agent 自进化（agent）、高级 RAG 记忆（agent/rag）、异步事件驱动（agent）
- 新增概念页 ×6：[[01-Wiki/concepts/Agent 评估]]、[[01-Wiki/concepts/Coding Agent]]、[[01-Wiki/concepts/Agent 自进化]]、[[01-Wiki/concepts/异步 Agent 与事件驱动架构]]、[[01-Wiki/concepts/多模态与实时交互 Agent]]、[[01-Wiki/concepts/单 Agent 与多 Agent]]
- 新增实体页 ×1：[[01-Wiki/entities/Cursor]]（代码库索引 AI 编码 Agent，来源 ×2）
- 更新已有概念页 ×4：[[01-Wiki/concepts/上下文工程]]（补 Context/State/Memory 区分、Skills 三层、Status Bar、三原则，sources ×1→×3）、[[01-Wiki/concepts/Loop Engineering]]（补四 Loop 模式、退出条件组合、Loop Guard/Budget/Checkpoint，sources ×3→×4）、[[01-Wiki/concepts/Harness Engineering]]（补 Loop/Harness/Infra 边界、六层 Infra、调用生命周期，sources ×4→×5）、[[01-Wiki/concepts/AI Agent]]（补进阶章节导航 06-17，sources ×6→×8）
- 更新实体页 ×2：[[01-Wiki/entities/zero2Agent]]（章节 01-05 → 01-17 全表，sources ×5→×17，status 升 mature）、[[01-Wiki/entities/Claude Code]]（补 Coding Agent Verification Loop 来源，链接 Cursor 实体，sources ×1→×2）
- 已同步更新 [[01-Wiki/index.md]]（+12 摘要 / +6 概念 / +1 实体 / 4 概念条目与 2 实体条目升级）
- 标签 `agent`/`harness`/`rag`/`llm`/`loop-engineering`/`context-engineering` 均已在分类体系 §8.4 登记，无需新配色
- 分类：domain=tech，tags=agent（主体）/harness/rag/llm/loop-engineering/context-engineering

## [2026-08-27] ingest | zero2Agent learn-agent-training 系列 7 篇（Agent 模型训练全链路）

- 源文件：Clippings/ 7 篇 → 归档至 `00-Raw/`（Agent SFT 关键细节 / Agent RL 实战 / GRPO vs PPO / 训练数据配比实战 / Agent 评测 / 从 SFT 到部署 / Agent 训练环境工程）
- 来源：https://onefly.top/zero2Agent/learn-agent-training/（01-07 章节，承接 learn-agent-basic 系列）
- 新增摘要页 ×7（均 domain=tech，tags=agent/llm）：Agent SFT（Loss Mask/轨迹数据）、Agent RL 实战（Reward 设计/算法选型/Reward Hacking）、GRPO vs PPO（优势估计分歧/选型指南）、训练数据配比（六类数据/能力偏移/数据飞轮）、Agent 评测（四层指标/环境方案/五陷阱）、从 SFT 到部署（压缩/推理优化/Agent Runtime/灰度）、Agent 训练环境（四平面闭环/沙箱四硬规则/数据回流）
- 新增概念页 ×6：[[01-Wiki/concepts/Agent SFT]]、[[01-Wiki/concepts/Agent 强化学习]]、[[01-Wiki/concepts/PPO 与 GRPO]]、[[01-Wiki/concepts/Agent 训练数据]]、[[01-Wiki/concepts/Agent 模型部署]]、[[01-Wiki/concepts/Agent 训练环境]]
- 更新已有概念页 ×1：[[01-Wiki/concepts/Agent 评估]]（补训练评测视角：四层指标/评测环境三方案/防泄露，sources ×1→×2，status 升 mature）
- 更新实体页 ×1：[[01-Wiki/entities/zero2Agent]]（补 learn-agent-training 01-07 子系列表格与概念链接，来源 ×17→×24）
- 已同步更新 [[01-Wiki/index.md]]（+7 摘要 / +6 概念 / zero2Agent 实体条目 ×17→×24 / Agent 评估条目 ×1→×2）
- 标签 `agent`（#fab005）/`llm`（#4263eb）已登记，无需新配色
- 分类：domain=tech，tags=agent/llm

## [2026-09-04] ingest | 架构师AI杜系列 6 篇（MCP 协议与开发 / Agent 基础 / LangChain 框架）

- 源文件：Clippings/ 6 篇 → 归档至 `00-Raw/`（重命名为「架构师AI杜 DayNN 标题」以消除同名：源文件 title 全为「架构师AI杜技术文档」，仅 description 区分天数与主题）
- 来源：https://www.weekr.net/ai/day-N.html（Day 19/20/21 MCP、Day 35 Agent、Day 38/39 LangChain）
- 新增摘要页 ×6（均 domain=tech）：Day19 MCP协议深度解析（tags=mcp/agent）、Day20 MCP Server开发基础（mcp/python）、Day21 MCP工具开发（mcp/python）、Day35 Agent基础概念（agent）、Day38 LangChain框架上（langchain/agent）、Day39 LangChain框架下（langchain/agent）
- 新增概念页 ×2：[[01-Wiki/concepts/MCP Server 开发]]（Server 六组件/工具设计八原则/参数验证五闸门/错误转返回值/执行统计/安全三查，来源 ×2）、[[01-Wiki/concepts/LangChain 组件与 Agent 模式]]（Chains 三形态/Memory 五策略/Callback 九钩子/Agent 四模式/性能四招，来源 ×2）
- 新增实体页 ×1：[[01-Wiki/entities/架构师AI杜]]（教程来源系列，来源 ×6，含已摄入章节表与偏差警示）
- 更新已有概念页 ×3：[[01-Wiki/concepts/MCP]]（补手写 Server 实现视角 + **与官方规范出入对照表**，sources ×1→×2，status 升 mature）、[[01-Wiki/concepts/AI Agent]]（补经典理论视角：四元组/三轴分类/与传统 AI 分界/与工程定义映射，sources ×8→×9）、[[01-Wiki/concepts/Tool Calling]]（补工具设计八原则、参数验证五闸门、统一结果信封、执行统计、执行前三查，sources ×1→×2，status 升 mature）
- 更新已有实体页 ×2：[[01-Wiki/entities/LangChain]]（补 Chains/Memory/Callback 章节 + 版本演进与 eval 安全提示，sources ×2→×4，status 升 mature）、[[01-Wiki/entities/FastMCP]]（补「手写 vs SDK」对照表，sources ×1→×2，status 升 growing）
- 已同步更新 [[01-Wiki/index.md]]（+6 摘要 / +2 概念 / +1 实体 / MCP·AI Agent·Tool Calling·LangChain·FastMCP 五条目升级 / 待办区新增 3 条缺口）
- 标签 `mcp`/`langchain`/`agent`/`python` 均已登记配色，无需新增
- 分类：domain=tech，tags=mcp/agent/langchain/python

### ⚠️ 本批记录的三处资料偏差（后续引用需注意）

1. **MCP 部分与官方规范不一致**：方法名 `mcp.list_tools`/`mcp.call_tool`（官方 `tools/list`/`tools/call`）、传输层 HTTP/WebSocket（官方 stdio + Streamable HTTP）、版本号 v1.0~v2.0（官方用日期版本）、两层架构（官方 Host/Client/Server 三角色）、HTTP 错误码（官方 JSON-RPC 错误码）。已在 [[01-Wiki/concepts/MCP]] 与 [[01-Wiki/concepts/MCP Server 开发]] 建立对照表。
2. **LangChain 部分为 0.1.x 旧版 API**：`LLMChain`/`initialize_agent`/`load_tools` 均非当前推荐路径（官方现推 LCEL + LangGraph）。
3. **多处代码含安全反例**：`eval(expression)` 执行模型生成字符串、`CORS allow_origins=["*"]`、`is_safe_path` 的 startswith 前缀绕过。已在各页标注并登记为待办缺口。

## [2026-09-11] lint | 00-Raw 按知识点分文件夹重组 + 规则升级

- **新增 schema 规则**：`00-Raw/` 由「平铺不可变」改为「**按知识点分文件夹**存放，内容仍不可改，仅允许内部移动」。见 [[02-Rules/AGENTS.md]] §1/§2/§3.1 与 [[02-Rules/分类体系]] §9
- **重组 00-Raw**：73 个源文件从根目录平铺 → 归入 **17 个知识点文件夹**
  - agent-basics(10)、agent-engineering(6)、agent-training(7)、agent-frameworks(4)、context-engineering(3)、harness(2)、loop-engineering(5)、mcp(5)、agent-skills(2)、rag(8)、vector-db(2)、llamaindex(6)、java-backend(6)、system-design(2)、devops(3)、coding-habits(1)、academic(1)
- **同步改链**：74 个文件、95 处 `[[00-Raw/...]]` 引用全部加上知识点文件夹路径（`sources:` frontmatter + 正文），校验 73 条真实链接零死链
- **更新文档**：[[02-Rules/AGENTS.md]]（铁律/架构图/ingest 归档步骤）、[[02-Rules/分类体系]]（§1 原则 + 新增 §9 知识点目录规范）、[[00-Raw/README.md]]（目录清单）、根 [[AGENTS.md]]（速览）
- **备份**：重组前已打包 `/tmp/my-knowledge-backup-20260911-102601.tar.gz`
- **待办**：根目录 `Clippings/` 有 1 篇新剪藏「AgentGuidedocs04-interview02-rag-questions」待 ingest

## [2026-09-11] ingest | AI Agent 面试题库 - Agent 核心篇（52 题）

- 源文件：`Clippings/AgentGuidedocs04-interview02-rag-questions.md at main.md` → 归档至 `00-Raw/agent-interview/AI Agent 面试题库 - Agent 核心篇.md`
  - **新建知识点夹** `00-Raw/agent-interview/`（第 18 个），已登记 [[02-Rules/分类体系]] §9.1 + `00-Raw/README.md` + 根 [[README.md]]
  - **重命名**：原文件名带 URL 残留（`... at main.md`），归档时改为文档标题；`Clippings/` 现已清空
  - ⚠️ 归档前已在源文件内**逐题补写参考答案**（52 题，1354 行 / ~75 KB），源文件内容自此冻结
- 来源：https://github.com/adongwanai/AgentGuide（docs/04-interview/）
- 新增摘要页 ×1：[[01-Wiki/summaries/AI Agent 面试题库 - Agent 核心篇]]（domain=tech，tags=agent/interview，status=growing）
- 新增概念页 ×3（均为 wiki 此前的**空白领域**）：
  - [[01-Wiki/concepts/Agent 记忆系统]]（五层划分 / 读写链路 / **记忆衰减七机制** / 海量历史查询三招）
  - [[01-Wiki/concepts/Agent 安全与对齐]]（纵深防御七层 / 三条底线 / 隐私越权双解法 / **间接注入**）
  - [[01-Wiki/concepts/A2A 协议]]（Agent Card/Task/Artifact、与 MCP 的纵横分工，status=seedling）
- 更新已有概念页 ×5（加交叉引用 + 补内容提要 + sources 递增）：
  - [[01-Wiki/concepts/ReAct]]（×1→×2）：补规划方法谱系 CoT→Self-Consistency→ToT→GoT
  - [[01-Wiki/concepts/Tool Calling]]（×2→×3）：补失败反馈策略 / 工具选择打分 / 约束解码 / FC vs Toolformer
  - [[01-Wiki/concepts/单 Agent 与多 Agent]]（×1→×2）：补协作机制六形态与收敛容错
  - [[01-Wiki/concepts/Agent 评估]]（×2→×3）：补 Prompt 优化判定 + 鲁棒性对抗测试清单
  - [[01-Wiki/concepts/GraphRAG]]（×5→×6）：补图谱增量更新与实时性保障
- 已同步更新 [[01-Wiki/index.md]]（+1 摘要 / +3 概念 / 5 条目升级 / 待办区新增 4 条缺口）
- 标签 `agent`/`interview` 配色已在 `.obsidian/graph.json` 与 `wiki-colors.css` 登记，无需新增

### ⚠️ 本批记录的三处资料偏差

1. **源文件命名与内容不符**：剪藏文件名与 frontmatter `title` 为 `02-rag-questions.md`，正文实为 **Agent 核心篇**，而 frontmatter `source` 又指向 `03-agent-questions.md`——剪藏器串号，已在摘要页标注
2. **原文仅有题面、无任何答案**：52 题答案为本次补写，属**二次加工内容**而非原始资料；后续引用需区分「题目来自 AgentGuide，答案来自本 wiki」
3. **题目无项目背景**：Q6/Q23/Q42 等"你有没有做过"类题目，标准答法与实际答法差异极大，摘要页已提示

## [2026-09-11] ingest | AgentGuide 面试题库 2 篇（RAG 系统篇 22 题 + 开发岗专项 45 题）

- 源文件（均自 `Clippings/` 归档并重命名）：
  - `Clippings/AgentGuidedocs04-interviewREADME.md at main.md` → `00-Raw/agent-interview/AI Agent 面试题库 - RAG 系统篇.md`
  - `Clippings/AgentGuidedocs04-interviewREADME.md at main 1.md` → `00-Raw/agent-interview/开发岗专项面试题库.md`
  - 两篇**原名完全相同**（`README.md at main`），仅靠浏览器下载后缀 ` 1` 区分——剪藏器串号，归档时按正文标题重命名
  - ⚠️ 归档前已逐题补写参考答案（22 + 45 = 67 题），源文件内容自此冻结
- 来源：https://github.com/adongwanai/AgentGuide（docs/04-interview/）
- **归档判断**：两篇均入 `00-Raw/agent-interview/`（该夹由 1 篇增至 3 篇）
  - 理由：与「Agent 核心篇」同属 AgentGuide 04-interview 系列；两篇均横跨子域（RAG 系统篇跨检索/评估/工程，开发岗专项跨系统设计/工程/选型/业务），符合该夹「跨子域」定义
  - ⚠️ **待复议**：RAG 系统篇主题上也可归入 `rag/`（§9.3 优先级 1「核心主题」倾向 rag）。本次按「同系列同处」原则归入 agent-interview，如需以主题优先请复议
- 新增摘要页 ×2（domain=tech）：
  - [[01-Wiki/summaries/AI Agent 面试题库 - RAG 系统篇]]（tags=rag/interview）
  - [[01-Wiki/summaries/开发岗专项面试题库]]（tags=agent/interview）
- 新增概念页 ×3（均为 wiki 空白领域）：
  - [[01-Wiki/concepts/RAG 评估]]（检索层/生成层分阶段指标 + 四类评估方法 + 分层定位瓶颈）
  - [[01-Wiki/concepts/高级 RAG 范式]]（迭代/自适应/纠偏检索 + 子问题分解 + **成本控制是真正的工程难点**）
  - [[01-Wiki/concepts/Agent 可观测性]]（Trace/Metrics/Logs 三支柱 + 回放·Diff·归因三能力）
- 更新已有概念页 ×18（追加 sources + 补回链 bullet + updated）：
  RAG(×3→×5)、文本分块(×1→×2)、嵌入模型(×1→×2)、混合检索(×1→×3)、BM25(×1→×2)、查询路由(×1→×2)、向量数据库(×1→×3)、GraphRAG(×6→×7)、Agent 评估(×3→×5)、Agent 记忆系统(×1→×2)、Agent 模型部署(×1→×2)、LangChain 组件与 Agent 模式(×2→×3)、单 Agent 与多 Agent(×2→×3)、Agent 安全与对齐(×1→×3)、Tool Calling(×3→×4)、Kubernetes(×2→×3)、限流(×2→×3)、异步 Agent 与事件驱动架构(×1→×2)
- 文档同步：[[01-Wiki/index.md]]（+2 摘要 / +3 概念 / 18 条目来源数重算 / 待办 +4）、[[02-Rules/分类体系]] §9.1（agent-interview 1→3 篇）、根 [[README.md]]（76 源 / 150 Wiki 页）

### ⚠️ 本批记录的资料偏差

1. **两篇原文件名完全相同**：均为 `AgentGuide/docs/04-interview/README.md at main`，仅靠下载后缀 ` 1` 区分；frontmatter `source` 分别指向 `02-rag-questions.md` 与 `06-development-specialized.md`——剪藏器串号，需靠正文标题辨识
2. **原文只有题面与要点标题**：开发岗专项第四部分 Q5/Q6/Q7 原文的「设计要点/保护措施/实现方式」是**空标题**；67 题答案全部为本次补写，属**二次加工内容**而非原始资料
3. **题目编号分部分重复**：开发岗专项四个部分各从 Q1 开始，引用必须带部分前缀（已统一标注为一-/二-/三-/四-）

---

## [2026-09-12] update | 新增知识库网页看板（展示层）

- **动机**：为 wiki 增加一个只读展示层，把 `01-Wiki/` 的内容与规模以网页形式呈现；用户要求**双击 `index.html` 直接可看**，不跑脚本、不起服务
- **产出**（新增，不改动任何既有 wiki 页面内容）：
  - `index.html` —— 概览看板：6 张规模卡片 / 类型·状态·领域三张环形图 / 知识点分布条形图 / 高频标签 / 增长曲线 / `log.md` 最近 12 条
  - `pages/summaries.html`、`pages/entities.html`、`pages/concepts.html` —— 三个列表子页，各含领域·状态·标签筛选 + 关键词搜索
  - `assets/style.css`、`assets/nav.js`、`assets/app.js`、`assets/vendor/chart.umd.min.js`（Chart.js 4.4.1 本地副本）
  - `scripts/build.py` —— 数据生成器（Python 纯标准库），产出 `data/wiki-data.js`
- **关键技术决策**：
  - **数据用 `window.KB_DATA` + `<script src>`，而非 `.json` + `fetch()`**：`file://` 协议下 fetch 会被 CORS 拦截，双击打开会白屏；普通脚本不受限制
  - **Chart.js 本地化放 `assets/vendor/`**，弃用 CDN，保证断网可用
  - **拆包按类型拆**：`index.html` 只放概览，三类内容各自成页（阈值约 120 条，见 [[02-Rules/AGENTS.md]] §7.6）
  - **配色不另起一套**，全部取自 [[02-Rules/分类体系]] §8；图表系列色也由 build.py 从分类色派生，前端零硬编码
- **规则同步**：
  - [[02-Rules/AGENTS.md]] 新增 §7「看板维护」；§3.1 Ingest 流程加第 8 步「刷新看板」
  - [[02-Rules/分类体系]] 新增 §8.5「看板配色」，并**首次为 status 三档登记色值**（seedling `#ced4da` / growing `#4dabf7` / mature `#2f9e44`）
  - 根 [`README.md`] 新增 §五「看板」，架构树补入展示层
- **数据基线**：150 页 / 76 源 / 18 知识点 / 1357 双链 / 49 标签，全部 150 页成功提取到一句话简介（0 缺失）
- **已验证**：`file://` 下三张列表页渲染卡片数 76 / 25 / 49，与数据完全一致

---

## [2026-09-13] ingest | 《Agentic AI》课程 31 篇（吴恩达，模块一~五）

- **来源**：`Clippings/`（网页剪藏，配套 `images/` 70 张配图）；课程内容由社区整理翻译，模块四/五含笔记作者杨若朴的个人批注（以引用块标注）
- **规模**：31 篇摘要，覆盖章节 1.1–5.10；课程本身缺 2.4 / 3.4 / 3.5 / 4.5 / 5.4 / 5.6 / 5.8 / 5.9 共 8 节（剪藏未提供）
- **知识点判定（§9.3：核心主题优先 → 与现有夹重叠则归入，不新建）**
  - `00-Raw/agent-basics/` **+23 → 33**：1.x 概念与设计模式、2.x 反思与外部反馈、3.1–3.6 工具使用与代码执行、5.x 规划与多智能体
  - `00-Raw/agent-engineering/` **+7 → 13**：4.x 评估 / 错误分析 / 组件级评估 / 延迟与成本
  - `00-Raw/mcp/` **+1 → 6**：3.7 MCP
  - ⚠️ **待复议**：agent-basics 已达 33 篇，主题跨"入门 + 设计模式"两簇；若继续增长建议拆出 `agent-design-patterns/`（§9.3 优先级 3 的 tags 映射已具备拆分条件）
- **文件名规范化（§9.2 新增第 6 条规则）**：剪藏原名形如 `1.2 什么是Agentic AI[What is agentic AI].md`，其中 `[` `]` 会**提前闭合 Obsidian 双链** → 统一改名去掉方括号英文标题，**正文一字未动**
- **新增附件目录 `00-Raw/images/`**：本批源文件用 `../images/xxx.png` 相对引用配图，故 70 张图随源移到 `00-Raw/images/`（从 `00-Raw/<知识点>/` 向上一级正好命中该路径，无需改动源文件正文）。已给 `scripts/build.py` 加过滤：**只统计含 `.md`/`.pdf` 的目录**，附件目录不进"按知识点分布"
- **新增摘要页 ×31**（全部 `domain: tech`，tags 取自 agent / llm / workflow / evals / reflection / tool-use / planning / multi-agent / mcp / python / career）
- **新增概念页 ×7**：
  - [[01-Wiki/concepts/Agentic AI 工作流]]（零样本 vs 多步迭代 + 自主性光谱 + 性能/并行/模块化三收益 + 任务难度光谱）
  - [[01-Wiki/concepts/任务分解]]、[[01-Wiki/concepts/反思模式]]、[[01-Wiki/concepts/代码执行]]、[[01-Wiki/concepts/规划模式]]、[[01-Wiki/concepts/错误分析]]、[[01-Wiki/concepts/延迟与成本优化]]
- **新增实体页 ×3**：[[01-Wiki/entities/吴恩达]]、[[01-Wiki/entities/aisuite]]、[[01-Wiki/entities/smolagents]]
- **更新已有概念页 ×5**（追加 sources + 补充视角小节 + updated）：
  [[01-Wiki/concepts/Agent 评估]](×5→×10，补 Evals 2×2 矩阵与 Rubric 打分)、[[01-Wiki/concepts/Tool Calling]](×4→×7，补"请求-解析-执行-回填"四步与条件性调用判据)、[[01-Wiki/concepts/单 Agent 与多 Agent]](×3→×6，补四种通信拓扑)、[[01-Wiki/concepts/MCP]](×2→×3，补 m×n→m+n 论证)、[[01-Wiki/concepts/AI Agent]](×9→×10，补回链)
- **文档同步**：[[01-Wiki/index.md]]（+31 摘要 / +3 实体 / +7 概念 / 5 条目来源数重算 / 待办 +8）、[[02-Rules/分类体系]]（§6 首次登记 4 个新 tag、§8.4 标签组 27→31、§9.1 三个夹计数 + `images/` 附件行、§9.2 新增第 6 条改名规则）、根 [`README.md`]、[`00-Raw/README.md`]、`.obsidian/snippets/wiki-colors.css`（+4 个 tag 配色）

### ⚠️ 本批 lint 发现

1. ~~**`graph.json` 配色未生效**~~ → **已于同日修复**：当时观察到 `colorGroups` 是空数组，误判为"从未生效"；后续 `git diff` 查明 `HEAD` 里本有 32 组，是**工作副本被 Obsidian 覆写**。详见本文件下方 **[2026-09-13] lint | 修复关系图谱配色** 一条
2. **资料偏差：MCP 提出者**：课程 3.7 写作 "Entropy"，**实为 Anthropic**。已在该摘要页与 [[01-Wiki/concepts/MCP]] 加 ⚠️ 标注，防止错误归属扩散
3. **课程缺章**：剪藏只覆盖 31 节，缺 2.4 / 3.4 / 3.5 / 4.5 / 5.4 / 5.6 / 5.8 / 5.9，若后续补齐需按同批规则增量 ingest
4. **模型性格判断时效性**：4.6 中"Qwen 嘴硬 / Gemini 逆来顺受 / GPT 言简意赅 / DeepSeek 有创意"是笔记作者 2025-11 的**个人经验**，非客观结论，已标注时间点，引用时需注意
5. **多智能体增益数据缺来源**：1.8 表中"人物传记 66%→73.8% / MMLU 63.9%→71.1% / 国际象棋 29.3%→45.2%"未注实验来源与任务设置，已记入 index 待办

- **数据基线**：191 页 / 107 源 / 18 知识点 / 1710 双链 / 53 标签，全部 191 页成功提取到一句话简介（0 缺失）
- **已验证**：68 处 `../images/` 相对引用**全部可解析**（0 缺失）；全库死链扫描仅剩 6 处**占位符文本**（log.md 模板中的 `[[01-Wiki/summaries/<源标题>]]` 等），非真实死链；`build.py` 输出知识点 18 个（附件目录已正确排除）

---

## [2026-09-13] lint | 修复关系图谱配色（colorGroups 被覆写为空 → 全图灰）

- **症状**：关系图谱所有节点与连线均为默认灰，完全看不出主题簇
- **根因（不是"从未生效"）**：`git diff` 显示 `HEAD` 版本里本就有 **32 组配色（27 标签 + 5 路径）**，是**工作副本**的 `colorGroups` 被改成空数组 `[]` 才导致全灰。`.obsidian/graph.json` 是 Obsidian 会自行重写的文件，关闭/切走图谱视图时会把内存里的状态写回磁盘，`colorGroups` 就此丢失
- **已提交版本缺的组**：`#llamaindex` 在 [[02-Rules/分类体系]] §8.4 表里、`wiki-colors.css` 里都有，唯独 graph.json 漏了 → 本次补齐（四处同步的历史缺口）
- **修复动作**
  1. 写回配色：**37 组**（32 标签组 + 5 路径兜底组），标签组在前以保持"主题簇"聚色
  2. 新增 `scripts/graph_colors.py` 作为**配色唯一数据源**：`TAG_GROUPS` + `PATH_GROUPS` → 写回 graph.json；`--check` 只校验，不一致时退出码非 0。理由：该文件会被 Obsidian 覆写，手工重录 37 组不现实
  3. 4 个新 tag 补进配色：`#evals` `#a61e4d`、`#reflection` `#94d82d`、`#tool-use` `#4dabf7`、`#planning` `#69db7c`（`evals`/`reflection` 刻意避开与 `#graphrag`/`#react` 同色，否则两簇在图上无法区分）
- **文档同步**：[[02-Rules/分类体系]] §8.4（表头计数 26→32，补 GraphRAG 行、修正 evals/reflection 色值；新增"新增 tag 四步走""**两处色值本就不同，要求一致的是覆盖范围**""colorGroups 会丢"三条约定）、根 [`README.md`]（§六 + 架构树补 `scripts/graph_colors.py`）
- **一处认知更正**：上一批 lint 记录写的"配色从未落到配置文件"**不准确** —— 实际是曾生效、后被覆写。§8.4 与根 README 中的相应表述已改正
- **待用户确认**：需在 Obsidian 中**关闭并重开图谱视图**（或 `Cmd+R` 重载）方能生效；若重开后仍全灰，说明被再次覆写，跑一次 `scripts/graph_colors.py --check` 即可判定
