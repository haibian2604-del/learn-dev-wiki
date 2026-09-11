# Wiki 索引 (Index)

> 内容目录。每次 ingest / lint 后必须更新。
> 回答查询时先读本文件定位页面，再深入阅读。
> 条目格式：`- [[链接]] — 一句话摘要（YYYY-MM-DD，来源 ×N）`
> 分类规则见 [[02-Rules/分类体系]]：每个页面必标 `domain`（主题领域）+ `tags`（细分主题）。

## 📌 概览

本 wiki 采用 Karpathy LLM Wiki 三层架构：`00-Raw`（只读源）→ `01-Wiki`（LLM 维护）→ `02-Rules`（schema）。
完整规则见 [[02-Rules/AGENTS.md]]。

```dataview
TABLE domain AS 领域, type AS 类型, status AS 状态, date(updated) AS 更新于
FROM "01-Wiki"
WHERE type
SORT domain, updated DESC
```

## 🗂️ 按主题领域浏览 (By Domain)

> 领域词表见 [[02-Rules/分类体系]]（tech / product / business / academic / life / reading / other）。

```dataview
TABLE rows.file.link AS 页面
FROM "01-Wiki"
WHERE type AND domain
GROUP BY domain
```

## 📚 摘要 (Summaries) — `01-Wiki/summaries/`

- [[01-Wiki/summaries/第 19 章 RAG 检索增强生成|第 19 章 RAG 检索增强生成]] — LangChain 实现层 RAG 全链路：加载→切分→向量化→检索→生成（2026-07-31，来源 ×1）
- [[01-Wiki/summaries/第 20 章 MCP 模型上下文协议|第 20 章 MCP 模型上下文协议]] — MCP 标准化接入：Host/Client/Server、Tool/Resource/Prompt、stdio/HTTP 传输（2026-07-31，来源 ×1）
- [[01-Wiki/summaries/Agent Skills 与 MCP|Agent Skills 与 MCP]] — 智能体能力扩展两种范式：连接性(MCP)与能力(Skills)分离（2026-07-31，来源 ×1）
- [[01-Wiki/summaries/如何写出好的 Skill|如何写出好的 Skill]] — skill-creator 最佳实践：简洁约束、信息分层、自由度光谱、六步流程（2026-07-31，来源 ×1）
- [[01-Wiki/summaries/第九章 上下文工程|第九章 上下文工程]] — GSSC 流水线、上下文腐蚀、JIT 上下文、长时程三手段（2026-07-31，来源 ×1）
- [[01-Wiki/summaries/第四章 智能体经典范式构建|第四章 智能体经典范式构建]] — ReAct/Plan-and-Solve/Reflection 三大范式从零实现（2026-07-31，来源 ×1）
- [[01-Wiki/summaries/JavaGuide 上下文工程|JavaGuide 上下文工程]] — 电商售后案例、上下文审计清单、条件注入（2026-07-31，来源 ×1，补充已有概念）
- [[01-Wiki/summaries/JavaGuide Harness Engineering|JavaGuide Harness Engineering]] — Agent=Model+Harness 六层架构（2026-07-31，来源 ×1）
- [[01-Wiki/summaries/JavaGuide MCP|JavaGuide MCP]] — MCP 企业级实践、四层分层、工具选择策略（2026-07-31，来源 ×1，补充已有概念）
- [[01-Wiki/summaries/JavaGuide Loop Engineering|JavaGuide Loop Engineering]] — 循环终止策略、防无限循环（2026-07-31，来源 ×1）
- [[01-Wiki/summaries/JavaGuide Workflow Graph Loop|JavaGuide Workflow Graph Loop]] — DAG + 循环边建模 Agent 执行路径（2026-07-31，来源 ×1）
- [[01-Wiki/summaries/JavaGuide Spring IoC与AOP|JavaGuide Spring IoC与AOP]] — 控制反转与切面编程原理详解（2026-07-31，来源 ×1）
- [[01-Wiki/summaries/JavaGuide SpringBoot自动装配|JavaGuide SpringBoot自动装配]] — @EnableAutoConfiguration 条件装配机制（2026-07-31，来源 ×1）
- [[01-Wiki/summaries/JavaGuide Spring设计模式|JavaGuide Spring设计模式]] — 工厂/代理/单例/模板方法等在 Spring 中的应用（2026-07-31，来源 ×1）
- [[01-Wiki/summaries/JavaGuide Spring面试题|JavaGuide Spring面试题]] — Bean 生命周期/循环依赖/注入方式高频考点（2026-07-31，来源 ×1）
- [[01-Wiki/summaries/JavaGuide Spring事务|JavaGuide Spring事务]] — @Transactional 传播行为/隔离级别/失效场景（2026-07-31，来源 ×1）
- [[01-Wiki/summaries/JavaGuide MyBatis面试题|JavaGuide MyBatis面试题]] — #{}与${}、动态 SQL、缓存、分页插件（2026-07-31，来源 ×1）
- [[01-Wiki/summaries/JavaGuide 高可用系统设计面试题|JavaGuide 高可用系统设计面试题]] — SLA/RTO/RPO、熔断、幂等、容灾（2026-07-31，来源 ×1）
- [[01-Wiki/summaries/JavaGuide 服务限流详解|JavaGuide 服务限流详解]] — 四种限流算法 + 单机/分布式实现（2026-07-31，来源 ×1）
- [[01-Wiki/summaries/JavaGuide 糟糕程序员的20个坏习惯|JavaGuide 糟糕程序员的20个坏习惯]] — 学习/工作/协作/工程思维四维坏习惯盘点（2026-07-31，来源 ×1）
- [[01-Wiki/summaries/Docker超详细教程|Docker超详细教程]] — 容器原理/命令/Dockerfile/Compose 全流程（2026-07-31，来源 ×1）
- [[01-Wiki/summaries/Kubernetes超详细教程|Kubernetes超详细教程]] — Pod 深入、架构、集群搭建、面试高频（2026-07-31，来源 ×1）
- [[01-Wiki/summaries/Docker与K8s对比|Docker与K8s对比]] — 容器打包 vs 集群编排的定位与选型（2026-07-31，来源 ×1）
- [[01-Wiki/summaries/Loop Engineering深度解析|Loop Engineering深度解析]] — 五阶段循环/六大要素/闭环开环/CI修复实战（2026-07-31，来源 ×1，补充已有概念）
- [[01-Wiki/summaries/Loop Engineering完全指南|Loop Engineering完全指南]] — 三段演化/Open-Loop vs Closed-Loop/与 Vibe Coding·Harness·Agentic 辨析/5 案例/反模式（2026-07-31，来源 ×1，补充已有概念）
- [[01-Wiki/summaries/基于知识图谱的RAG|基于知识图谱的RAG]] — GraphRAG 总论：传统RAG 7 局限、KG 4 优势、三阶段架构、方法论三分、前沿框架、评估（2026-08-01，来源 ×1）
- [[01-Wiki/summaries/图RAG架构设计|图RAG架构设计]] — 图RAG 系统六大模块、Neo4j/Milvus 环境配置、数据流（2026-08-01，来源 ×1）
- [[01-Wiki/summaries/图数据建模与准备|图数据建模与准备]] — LLM 抽取实体关系→CSV→Cypher 导入 Neo4j、图→文档转换与分块（2026-08-01，来源 ×1）
- [[01-Wiki/summaries/Milvus索引构建|Milvus索引构建]] — 图RAG 向量索引 Schema、IVF_FLAT+COSINE、对比 FAISS（2026-08-01，来源 ×1）
- [[01-Wiki/summaries/智能查询路由与检索策略|智能查询路由与检索策略]] — 四维度查询分析、三策略（混合/图/组合）、RRF 与 Round-robin（2026-08-01，来源 ×1）
- [[01-Wiki/summaries/向量数据库全面解析|向量数据库全面解析]] — 六大向量库(Milvus/Pinecone/Qdrant/Chroma/Weaviate/pgvector)原理对比 + 选型决策树 + 踩坑（2026-08-01，来源 ×1）
- [[01-Wiki/summaries/2026 年 AI Agent 技术全景|2026 年 AI Agent 技术全景]] — Agent 定义/6 大模块/3 大协议(MCP/A2A/Skills)/12 框架横评/10 大趋势（2026-08-01，来源 ×1）
- [[01-Wiki/summaries/2026年AI Agent框架选型实战|2026年AI Agent框架选型实战]] — 10 开源框架技术对比、四维选型方法论、分场景工程建议（2026-08-01，来源 ×1）
- [[01-Wiki/summaries/时空可组合性编程范式|时空可组合性编程范式]] — 动态组合编程范式：可逆效应+响应式余效应、Cordis 元框架、Koishi 案例（2026-08-15，来源 ×1）
- [[01-Wiki/summaries/为什么需要 LlamaIndex？（RAG 的痛点与 LlamaIndex 的定位）|为什么需要 LlamaIndex？]] — ⚠️ 剪藏残缺（源仅含"LlamaIndex"一词），仅登记元数据待补全（2026-08-19，来源 ×1）
- [[01-Wiki/summaries/统一数据接入：LlamaIndex 的 Connector 体系|统一数据接入：LlamaIndex 的 Connector 体系]] — ⚠️ 剪藏残缺，仅登记元数据待补全（2026-08-19，来源 ×1）
- [[01-Wiki/summaries/文档解析的深度挑战|文档解析的深度挑战]] — SentenceSplitter 默认分块三痛点、语义vs粒度矛盾、PDF/HTML/DOCX 解析难点、4 量化评估指标（2026-08-19，来源 ×1）
- [[01-Wiki/summaries/VectorStoreIndex 深入：向量索引的内部机制与优化|VectorStoreIndex 深入]] — 向量/嵌入模型选型、余弦相似度、构建三步、存储后端、性能优化与 4 局限（2026-08-19，来源 ×1）
- [[01-Wiki/summaries/Query Engine 架构与工作原理|Query Engine 架构与工作原理]] — Retriever+Synthesizer 两段式、4 合成模式、5 阶段生命周期、对比 LangChain Chain（2026-08-19，来源 ×1）
- [[01-Wiki/summaries/混合检索：向量搜索 + 关键词搜索的协同|混合检索：向量搜索 + 关键词搜索的协同]] — RRF 融合公式、BM25Retriever、QueryFusionRetriever、权重调优与误区（2026-08-19，来源 ×1）
- [[01-Wiki/summaries/9.1 项目概述与需求分析|9.1 项目概述与需求分析]] — 企业级知识库问答系统需求分析：5 功能+3 非功能需求、技术栈选型、目录结构、里程碑（2026-08-19，来源 ×1）
- [[01-Wiki/summaries/10.1 多模态 RAG 概述与场景分析|10.1 多模态 RAG 概述与场景分析]] — 多模态 RAG 概念/场景/架构/挑战：CLIP 跨模态对齐、GPT-4V、图表理解（2026-08-19，来源 ×1）
- [[01-Wiki/summaries/Harness Engineering 完全指南|Harness Engineering 完全指南]] — Agent=Model+Harness 完全指南：三大支柱/定量ROI/十大设计哲学/Claude Code 源码级/竞品对比（2026-08-21，来源 ×1）
- [[01-Wiki/summaries/什么是 Agent|什么是 Agent]] — 工程视角最小定义：Agent=LLM+Context+Tools、围绕目标持续推进、判断三件事（2026-08-26，来源 ×1）
- [[01-Wiki/summaries/Workflow 和 Agent 的区别|Workflow 和 Agent 的区别]] — LLM App/Workflow/Agent 三类边界：分界线在"下一步由谁决定"、为何很多场景不需 Agent（2026-08-26，来源 ×1）
- [[01-Wiki/summaries/一个 Agent 系统的核心组成|一个 Agent 系统的核心组成]] — 7 核心模块：Goal/State/Model/Context/Tools/Memory/Planner-Guardrails、工具三类型安全策略（2026-08-26，来源 ×1）
- [[01-Wiki/summaries/为什么很多 Agent Demo 一落地就不稳定|为什么很多 Agent Demo 一落地就不稳定]] — Demo→生产六大断层：目标模糊/无状态/工具乐观/伪执行/无预算/无可观测（2026-08-26，来源 ×1）
- [[01-Wiki/summaries/大模型 API 输入输出与 Tool Calling|大模型 API 输入输出与 Tool Calling]] — 无状态 API、消息角色、工具调用闭环≥2请求、call ID 因果、并行/流式/工具设计（2026-08-26，来源 ×1）
- [[01-Wiki/summaries/Context、State 与 Memory|Context、State 与 Memory]] — 五概念区分、四种记忆模式、上下文压缩、KV Cache vs Prompt Cache（2026-08-27，来源 ×1）
- [[01-Wiki/summaries/Planning、Reflection、RAG 分别解决什么问题|Planning、Reflection、RAG 分别解决什么问题]] — 三概念职责：下一步做什么/刚才对不对/缺什么信息，避免缺信息误判多思考（2026-08-27，来源 ×1）
- [[01-Wiki/summaries/单 Agent 和多 Agent 的边界|单 Agent 和多 Agent 的边界]] — 单 Agent 优先、三协作模式(Fan-out/Pipeline/Adversarial)、选择性共享上下文（2026-08-27，来源 ×1）
- [[01-Wiki/summaries/Agent Infra：从 Harness 到生产环境|Agent Infra：从 Harness 到生产环境]] — Loop/Harness/Infra 边界、调用生命周期六步、六层基础设施、企业 vs Demo 对比（2026-08-27，来源 ×1）
- [[01-Wiki/summaries/Loop Engineering：让 Agent 自主迭代直到正确|Loop Engineering：让 Agent 自主迭代直到正确]] — 四种 Loop 模式、退出条件多重组合、Loop Guard/Token Budget/Checkpoint（2026-08-27，来源 ×1）
- [[01-Wiki/summaries/Agent 评估：怎么知道你的 Agent 好不好|Agent 评估：怎么知道你的 Agent 好不好]] — 四维度(完成率/效率/安全/鲁棒)、四评测方法、持续监控>一次性评测（2026-08-27，来源 ×1）
- [[01-Wiki/summaries/Coding Agent：最成功的 Agent 落地形态|Coding Agent：最成功的 Agent 落地形态]] — 成功四因(外部验证器/工具即工具/结构化上下文/失败可控)、三工程模式、四通用原则（2026-08-27，来源 ×1）
- [[01-Wiki/summaries/Context Engineering：系统化设计模型输入|Context Engineering：系统化设计模型输入]] — Context 五组成、Skills 三层加载、Status Bar、三设计原则（2026-08-27，来源 ×1）
- [[01-Wiki/summaries/多模态与实时交互 Agent|多模态与实时交互 Agent]] — Voice 三范式(Cascaded/Omni/Full-duplex)、GUI Agent、快慢解耦、Embodied 延伸（2026-08-27，来源 ×1）
- [[01-Wiki/summaries/Agent 自进化：不改权重也能持续变强|Agent 自进化：不改权重也能持续变强]] — 三机制(经验学习/工具创造/策略自优化)、经验库工程、风险约束（2026-08-27，来源 ×1）
- [[01-Wiki/summaries/高级 RAG 与记忆架构|高级 RAG 与记忆架构]] — Contextual Retrieval/GraphRAG/RAPTOR/双层记忆、记忆评估与隐私遗忘（2026-08-27，来源 ×1）
- [[01-Wiki/summaries/异步 Agent 与事件驱动架构|异步 Agent 与事件驱动架构]] — 三异步模式、事件驱动、连续时间推理、Safety Sidecar、三层隔离（2026-08-27，来源 ×1）
- [[01-Wiki/summaries/Agent SFT 关键细节：从轨迹数据到 Loss Mask|Agent SFT 关键细节：从轨迹数据到 Loss Mask]] — 轨迹数据构造、Loss Mask（只对 tool_call/回复算 loss）、数据配比防能力崩塌（2026-08-27，来源 ×1）
- [[01-Wiki/summaries/Agent RL 实战：用强化学习提升推理与决策质量|Agent RL 实战：用强化学习提升推理与决策质量]] — Reward 设计(结果+过程)、PPO/GRPO/Rejection Sampling、Reward Hacking、RLVP（2026-08-27，来源 ×1）
- [[01-Wiki/summaries/GRPO vs PPO：Agent 强化学习算法深度对比与选型|GRPO vs PPO：Agent 强化学习算法深度对比与选型]] — 优势估计分歧(Critic vs 组内比较)、显存/rollout/Reward 区分度、混合方案先 GRPO 后 PPO（2026-08-27，来源 ×1）
- [[01-Wiki/summaries/训练数据配比实战：Agent 不只吃轨迹数据|训练数据配比实战：Agent 不只吃轨迹数据]] — 六类数据配比、能力偏移、模型规模差异、数据飞轮（2026-08-27，来源 ×1）
- [[01-Wiki/summaries/Agent 评测：怎么衡量你训练出来的 Agent 到底行不行|Agent 评测：怎么衡量你训练出来的 Agent 到底行不行]] — 四层指标(完成/效率/鲁棒/安全)、评测环境三方案、五大陷阱、三阶段流程（2026-08-27，来源 ×1）
- [[01-Wiki/summaries/从 SFT 到部署：Agent 模型上线全流程|从 SFT 到部署：Agent 模型上线全流程]] — checkpoint 选择、量化/蒸馏、KV Cache/并行化、Agent Runtime、灰度监控（2026-08-27，来源 ×1）
- [[01-Wiki/summaries/Agent 训练环境工程：从仿真沙箱到数据回流闭环|Agent 训练环境工程：从仿真沙箱到数据回流闭环]] — 四平面闭环、环境契约、沙箱四硬规则、Verifier 隔离、数据回流保证据（2026-08-27，来源 ×1）
- [[01-Wiki/summaries/架构师AI杜 Day19 MCP协议深度解析|架构师AI杜 Day19 MCP协议深度解析]] — MCP 协议导读：起源、Server/Tool/Resource 三概念、四层架构、JSON-RPC 流程、认证授权三层粒度 ⚠️ 含与官方规范出入对照（2026-09-04，来源 ×1）
- [[01-Wiki/summaries/架构师AI杜 Day20 MCP Server开发基础|架构师AI杜 Day20 MCP Server开发基础]] — 纯 FastAPI 手搓 MCP Server：六组件、资源与工具建模、method 分发、错误处理、API Key 鉴权、Docker 部署（2026-09-04，来源 ×1）
- [[01-Wiki/summaries/架构师AI杜 Day21 MCP工具开发|架构师AI杜 Day21 MCP工具开发]] — 工具设计八原则、Pydantic 五道验证闸门、统一结果信封、执行统计、三类实战工具集、路径白名单与注入防护（2026-09-04，来源 ×1）
- [[01-Wiki/summaries/架构师AI杜 Day35 Agent基础概念|架构师AI杜 Day35 Agent基础概念]] — 经典理论视角：五特征、Agent=<Perception,Reasoning,Action,Learning>、三轴分类（能力/数量/目标）、四核心组件（2026-09-04，来源 ×1）
- [[01-Wiki/summaries/架构师AI杜 Day38 LangChain框架上|架构师AI杜 Day38 LangChain框架（上）]] — Models/Prompts/Output Parsers 三组件、Simple-Sequential-Router 三级链、ReAct Agent、自定义工具两种写法 ⚠️ 0.1.x 旧版 API（2026-09-04，来源 ×1）
- [[01-Wiki/summaries/架构师AI杜 Day39 LangChain框架下|架构师AI杜 Day39 LangChain框架（下）]] — 四种高级 Agent 模式、五种 Memory 策略、Callback 九钩子、自定义 Parser、缓存/异步/批量/流式四招 ⚠️ 含 eval 安全反例（2026-09-04，来源 ×1）
- [[01-Wiki/summaries/AI Agent 面试题库 - Agent 核心篇|AI Agent 面试题库 - Agent 核心篇]] — 52 道 Agent 岗面试题（标注字节/阿里/腾讯高频与真题）：七大部分结构、八大模块的标准答法要点、工程题"分层+量化"套路（2026-09-11，来源 ×1）

## 🏛️ 实体 (Entities) — `01-Wiki/entities/`

- [[01-Wiki/entities/LangChain|LangChain]] — LLM 应用框架，RAG 组件流水线的统一接口 + Chains/Memory/Callback 编排能力 ⚠️ 教程多为 0.1.x 旧版 API（2026-09-04，来源 ×4）
- [[01-Wiki/entities/Redis向量库|Redis 向量库]] — RAG 存储与相似检索后端（2026-07-31，来源 ×1）
- [[01-Wiki/entities/FastMCP|FastMCP]] — MCP Python 服务端高层封装：@mcp.tool/resource/prompt，与手写实现的对照（2026-09-04，来源 ×2）
- [[01-Wiki/entities/hello-agents|hello-agents]] — 从零构建智能体的教学框架：ContextBuilder/NoteTool/TerminalTool（2026-07-31，来源 ×2）
- [[01-Wiki/entities/Spring|Spring]] — Java 企业级框架，IoC 容器与 AOP 两大基石（2026-07-31，来源 ×5）
- [[01-Wiki/entities/MyBatis|MyBatis]] — 半自动 ORM：#{}预编译、动态 SQL、二级缓存（2026-07-31，来源 ×1）
- [[01-Wiki/entities/Neo4j|Neo4j]] — 原生图数据库，GraphRAG 图谱存储与 Cypher 遍历后端（2026-08-01，来源 ×2）
- [[01-Wiki/entities/Milvus|Milvus]] — 云原生向量库，GraphRAG 向量索引后端，生产级替代 FAISS（2026-08-01，来源 ×3）
- [[01-Wiki/entities/Pinecone|Pinecone]] — 全托管商业 SaaS，零运维，与 OpenAI/Vercel/LangChain 集成（2026-08-01，来源 ×1）
- [[01-Wiki/entities/Qdrant|Qdrant]] — Rust 开源，高性价比，中维(384-768)P99≈15ms（2026-08-01，来源 ×1）
- [[01-Wiki/entities/Chroma|Chroma]] — 轻量开源，pip 即用，本地开发/PoC（2026-08-01，来源 ×1）
- [[01-Wiki/entities/Weaviate|Weaviate]] — Go 开源，向量+关键词混合搜索，模块化（2026-08-01，来源 ×1）
- [[01-Wiki/entities/pgvector|pgvector]] — PostgreSQL 扩展，零成本，中小规模（2026-08-01，来源 ×1）
- [[01-Wiki/entities/AutoGen|AutoGen]] — 微软多 Agent 框架：对话协作、AutoGen Studio、企业级（2026-08-01，来源 ×2）
- [[01-Wiki/entities/AutoGPT|AutoGPT]] — 184K Stars 全自主代理平台：微服务/可视化构建器（2026-08-01，来源 ×1）
- [[01-Wiki/entities/LangGraph|LangGraph]] — 135K Stars 状态化图基 Agent 工作流，Workflow Graph 典型实现（2026-08-01，来源 ×1）
- [[01-Wiki/entities/LlamaIndex|LlamaIndex]] — 企业数据检索/RAG 框架，LlamaParse 文档解析、Connector/Query Engine/混合检索/多模态全链路（2026-08-19，来源 ×9）
- [[01-Wiki/entities/CrewAI|CrewAI]] — 多 Agent 团队协作：Crews+Flows 双模式，不依赖 LangChain（2026-08-01，来源 ×2）
- [[01-Wiki/entities/Cordis|Cordis]] — 时空可组合性元框架：effect 追踪+coeffect 解析+热模块替换（2026-08-15，来源 ×1）
- [[01-Wiki/entities/Koishi|Koishi]] — Cordis 上的聊天框架：4000+ 插件实证动态组合（2026-08-15，来源 ×1）
- [[01-Wiki/entities/PyLLM|PyLLM]] — Python+大模型教程系列，LlamaIndex 章节本批 8 篇来源（2026-08-19，来源 ×8）
- [[01-Wiki/entities/Claude Code|Claude Code]] — Anthropic 终端 AI 编码 Agent，Harness 开源可分析参考实现 + Coding Agent Verification Loop 典型（2026-08-27，来源 ×2）
- [[01-Wiki/entities/zero2Agent|zero2Agent]] — 工程视角 AI Agent 开源教程系列（onefly.top），learn-agent-basic 01-17 + learn-agent-training 01-07 来源（2026-08-27，来源 ×24）
- [[01-Wiki/entities/Cursor|Cursor]] — 代码库索引驱动 AI 编码 Agent（IDE 形态），8 并行 Agent+worktree，Coding Agent 成功梯队（2026-08-27，来源 ×2）
- [[01-Wiki/entities/架构师AI杜|架构师AI杜]] — weekr.net 中文 AI 工程连载（第 N 天），MCP 三篇 + LangChain 两篇 + Agent 理论一篇，偏可运行代码 ⚠️ 含规范出入与旧版 API（2026-09-04，来源 ×6）

## 💡 概念 (Concepts) — `01-Wiki/concepts/`

- [[01-Wiki/concepts/RAG|RAG]] — 先检索再生成的 LLM 架构，两阶段流程与方案对比（2026-07-31，来源 ×1）
- [[01-Wiki/concepts/文本分块|文本分块]] — chunking 策略与分割器、关键参数（2026-07-31，来源 ×1）
- [[01-Wiki/concepts/Document|Document]] — LangChain 统一文档对象：page_content + metadata（2026-07-31，来源 ×1）
- [[01-Wiki/concepts/MCP|MCP]] — 模型上下文协议：外部能力标准化接入层 + 手写 Server 实现视角与官方规范出入对照表（2026-09-04，来源 ×2）
- [[01-Wiki/concepts/Agent Skills|Agent Skills]] — 程序性知识封装：渐进式披露三层架构、SKILL.md 规范（2026-07-31，来源 ×1）
- [[01-Wiki/concepts/上下文工程|上下文工程]] — 推理阶段上下文策划：上下文腐蚀、GSSC、JIT、Context/State/Memory 区分、Skills 三层与 Status Bar（2026-08-27，来源 ×3）
- [[01-Wiki/concepts/ReAct|ReAct]] — 思考-行动-观察循环范式，与 Plan-and-Solve/Reflection 对比；补规划方法谱系 CoT→Self-Consistency→ToT→GoT 与难度路由（2026-09-11，来源 ×2）
- [[01-Wiki/concepts/Harness Engineering|Harness Engineering]] — Agent=Model+Harness 六层架构 + 三大支柱/十哲学/ROI/Claude Code 参考实现 + Loop/Harness/Infra 边界与六层 Infra（2026-08-27，来源 ×5）
- [[01-Wiki/concepts/Workflow Graph|Workflow Graph]] — DAG+循环边建模 vs 自由循环 ReAct（2026-07-31，来源 ×1）
- [[01-Wiki/concepts/IoC|IoC]] — 控制反转思想：对象创建权交给容器，DI 是其实现（2026-07-31，来源 ×2）
- [[01-Wiki/concepts/AOP|AOP]] — 面向切面编程：横切关注点分离，动态代理实现（2026-07-31，来源 ×2）
- [[01-Wiki/concepts/限流|限流]] — 固定/滑动窗口、令牌桶、漏桶与分布式实现（2026-07-31，来源 ×2）
- [[01-Wiki/concepts/Docker|Docker]] — 轻量容器技术：镜像/容器/仓库，一次构建到处运行（2026-07-31，来源 ×2）
- [[01-Wiki/concepts/Kubernetes|Kubernetes]] — 容器编排：Pod/Deployment/Service、控制器模式（2026-07-31，来源 ×2）
- [[01-Wiki/concepts/Loop Engineering|Loop Engineering]] — 循环质量控制 + 系统定义/Open-Loop vs Closed-Loop/与 Harness·Vibe Coding 辨析 + 四 Loop 模式与退出设计（2026-08-27，来源 ×4）
- [[01-Wiki/concepts/GraphRAG|GraphRAG]] — 知识图谱增强 RAG：三阶段流程、方法论三分、前沿框架、评估与生产挑战 + 图谱增量更新与实时性保障（2026-09-11，来源 ×6）
- [[01-Wiki/concepts/知识图谱|知识图谱]] — 节点+边的语义网络，显式关系、多跳推理、本体/溯源/时间建模（2026-08-01，来源 ×2）
- [[01-Wiki/concepts/查询路由|查询路由]] — 按复杂度选策略：传统混合/图RAG/组合，RRF 融合与降级（2026-08-01，来源 ×1）
- [[01-Wiki/concepts/实体关系抽取|实体关系抽取]] — LLM 抽取三元组→CSV→导入图库，图谱构建第一步（2026-08-01，来源 ×1）
- [[01-Wiki/concepts/向量数据库|向量数据库]] — 高维向量存储检索、ANN 算法(HNSW/IVF/DiskANN)、与传统 DB 区别（2026-08-01，来源 ×1）
- [[01-Wiki/concepts/AI Agent|AI Agent]] — 感知→决策→行动→记忆闭环、6 大模块、3 大协议、工程视角最小定义与 7 模块/Workflow 边界/生产断层 + 进阶章节导航 06-17 + 经典理论视角（四元组/三轴分类）（2026-09-04，来源 ×9）
- [[01-Wiki/concepts/Tool Calling|Tool Calling]] — Agent 与大模型 API 交互核心：无状态 API、消息角色、工具调用闭环≥2请求、call ID 因果、并行/流式 + 工具设计八原则与参数验证五闸门 + 失败反馈策略/工具选择打分/Function Calling vs Toolformer（2026-09-11，来源 ×3）
- [[01-Wiki/concepts/Agent 评估|Agent 评估]] — 四维度(完成率/效率/安全/鲁棒)、四评测方法(测试集/LLM-as-Judge/A-B/Red Teaming)、持续监控 + 训练评测四层指标/防泄露 + 鲁棒性对抗测试清单与 fail-safe（2026-09-11，来源 ×3）
- [[01-Wiki/concepts/Coding Agent|Coding Agent]] — 落地最成功 Agent 形态：外部验证器/代码即工具/结构化上下文/失败可控 + 三工程模式（2026-08-27，来源 ×1）
- [[01-Wiki/concepts/Agent 自进化|Agent 自进化]] — 不改权重的运行时自改进：经验学习/工具创造/策略自优化 + 风险约束（2026-08-27，来源 ×1）
- [[01-Wiki/concepts/异步 Agent 与事件驱动架构|异步 Agent 与事件驱动架构]] — 三异步模式、事件驱动、Safety Sidecar、工具三层隔离、Correlation ID（2026-08-27，来源 ×1）
- [[01-Wiki/concepts/多模态与实时交互 Agent|多模态与实时交互 Agent]] — Voice 三范式、GUI Agent、快慢解耦、延迟预算、Embodied 延伸（2026-08-27，来源 ×1）
- [[01-Wiki/concepts/Agent SFT|Agent SFT]] — 用轨迹数据微调：Loss Mask 只对 tool_call/回复算 loss、含失败轨迹、SFT 后 RL（2026-08-27，来源 ×1）
- [[01-Wiki/concepts/Agent 强化学习|Agent 强化学习]] — 任务级 Reward 超越 SFT 上限：Reward 设计、算法选型、Reward Hacking、RLVP/信用分配（2026-08-27，来源 ×2）
- [[01-Wiki/concepts/PPO 与 GRPO|PPO 与 GRPO]] — 优势估计分歧(Critic vs 组内比较)、N=8 sweet spot、选型指南与混合方案（2026-08-27，来源 ×1）
- [[01-Wiki/concepts/Agent 训练数据|Agent 训练数据]] — 六类数据配比、能力偏移、模型越小越保守、质量>数量、数据飞轮（2026-08-27，来源 ×1）
- [[01-Wiki/concepts/Agent 模型部署|Agent 模型部署]] — checkpoint 选择/量化(INT8 默认)/KV Cache/Agent Runtime/循环硬限制/灰度监控（2026-08-27，来源 ×1）
- [[01-Wiki/concepts/Agent 训练环境|Agent 训练环境]] — 四平面闭环、环境契约、沙箱四硬规则、Verifier 隔离、数据回流保证据（2026-08-27，来源 ×1）
- [[01-Wiki/concepts/单 Agent 与多 Agent|单 Agent 与多 Agent]] — 单 Agent 优先、三协作模式、上下文选择性共享、涌现行为 + 协作机制六形态与收敛容错机制（2026-09-11，来源 ×2）
- [[01-Wiki/concepts/时空可组合性|时空可组合性]] — 动态组合双维度：可逆效应(时间)+响应式余效应(空间)、组件演算（2026-08-15，来源 ×1）
- [[01-Wiki/concepts/Query Engine|Query Engine]] — LlamaIndex 检索+合成指挥中心：Retriever+Synthsizer、4 合成模式、请求生命周期（2026-08-19，来源 ×1）
- [[01-Wiki/concepts/混合检索|混合检索]] — 向量(dense)+BM25(sparse) 协同，RRF 融合、权重调优（2026-08-19，来源 ×1）
- [[01-Wiki/concepts/BM25|BM25]] — 概率相关性打分，关键词检索核心，jieba 支持中文（2026-08-19，来源 ×1）
- [[01-Wiki/concepts/多模态 RAG|多模态 RAG]] — 文本/图/表/图多模态检索生成，CLIP 跨模态对齐（2026-08-19，来源 ×1）
- [[01-Wiki/concepts/文档解析|文档解析]] — 切分粒度矛盾、结构保留、格式难点，质量决定检索上限（2026-08-19，来源 ×1）
- [[01-Wiki/concepts/嵌入模型|嵌入模型]] — 语义指纹，模型选型/误区/领域微调，决定检索天花板（2026-08-19，来源 ×1）
- [[01-Wiki/concepts/MCP Server 开发|MCP Server 开发]] — 协议落地：Server 六组件、工具元数据与执行函数解耦、错误转返回值、鉴权三层粒度、路径白名单与注入防护（2026-09-04，来源 ×2）
- [[01-Wiki/concepts/LangChain 组件与 Agent 模式|LangChain 组件与 Agent 模式]] — Chains 三形态、Memory 五策略、Callback 九钩子、四种 Agent 模式、性能四招 ⚠️ 旧版 API 与 eval 安全反例（2026-09-04，来源 ×2）
- [[01-Wiki/concepts/Agent 记忆系统|Agent 记忆系统]] — 五层记忆划分、写入/读取双链路、**记忆衰减七机制**、海量历史查询三招(减数据/缩空间/快索引)（2026-09-11，来源 ×1）
- [[01-Wiki/concepts/Agent 安全与对齐|Agent 安全与对齐]] — 纵深防御七层、三条底线(拦住/看见/撤销)、隐私与越权双解法、间接 Prompt 注入（2026-09-11，来源 ×1）
- [[01-Wiki/concepts/A2A 协议|A2A 协议]] — 跨厂商 Agent 互操作协议：Agent Card/Task/Artifact、与 MCP 的纵横分工（agent↔agent vs agent↔工具）（2026-09-11，来源 ×1）

## 📋 待办与缺口 (Open Questions)

> Lint 发现的缺口、用户想深挖的问题，处理完后移出本区。

- Agent 式 RAG 完整实现（第 21 章 Agent 智能体）
- 混合检索（BM25+向量）+ RRF 融合排序调优（已由 [[01-Wiki/summaries/智能查询路由与检索策略]] 覆盖 RRF 融合；本批新增 [[01-Wiki/concepts/混合检索]] + [[01-Wiki/summaries/混合检索：向量搜索 + 关键词搜索的协同]] 深化）
- 生产级向量库选型（Milvus/HNSW）与 Redis 对比（已建 [[01-Wiki/entities/Milvus]]、[[01-Wiki/entities/Redis向量库]]，六方横评见 [[01-Wiki/summaries/向量数据库全面解析]]）
- Streamable HTTP 与 SSE 迁移路径
- MCP 企业级安全实践（鉴权/审计方案）（本批 [[01-Wiki/concepts/MCP Server 开发]] 已覆盖鉴权三层粒度与执行前三查；**审计方案仍缺**）
- `eval` / `python-repl` 类代码执行工具的安全替代方案：AST 白名单解析 vs 容器沙箱 vs 受限 DSL（多份教程直接 `eval` 模型输出，是系统性风险，见 [[01-Wiki/concepts/LangChain 组件与 Agent 模式]]）
- LangChain 0.1.x → LCEL / LangGraph 的迁移路径与成本（多份资料停留在 `LLMChain` + `initialize_agent` 旧版写法）
- 工具数量规模化后的按需加载机制（Tool RAG）：几十上百个工具时全量 `tools/list` 会撑爆上下文
- **A2A 协议规范细节**（Agent Card / Task / Artifact 字段定义 + 跨组织落地案例）——已建 [[01-Wiki/concepts/A2A 协议]]，**规范层与实战案例仍缺**（2026-09-11）
- **工具选择打分（tool router）** 的公开数据集与 baseline（2026-09-11）
- **间接 Prompt 注入**（工具返回内容藏指令）的检测率/误杀率基准（2026-09-11）
- **Agent 记忆衰减参数**的量化标定（时间衰减因子 / importance 阈值如何用评测集标定）（2026-09-11）

## 维护约定

1. 添加/更新页面后：在对应分类下增改一行条目，格式见文件头
2. 条目必须含：wikilink、一句话摘要、日期、来源数
3. 同步更新 `log.md`；本文件分类与 `02-Rules/AGENTS.md` 保持一致
4. 页面删除时同步删除对应条目，避免死链
