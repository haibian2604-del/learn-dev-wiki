---
type: concept
domain: tech
tags: [rag, llm, retrieval]
created: 2026-07-31
updated: 2026-09-11
sources: ["[[01-Wiki/summaries/第 19 章 RAG 检索增强生成]]", "[[01-Wiki/summaries/VectorStoreIndex 深入：向量索引的内部机制与优化]]", "[[01-Wiki/summaries/混合检索：向量搜索 + 关键词搜索的协同]]", "[[01-Wiki/summaries/AI Agent 面试题库 - RAG 系统篇]]", "[[01-Wiki/summaries/开发岗专项面试题库]]"]
status: growing
---

# RAG（Retrieval-Augmented Generation，检索增强生成）

> 先检索、再生成的 LLM 应用架构：从外部知识库检索相关材料，再与问题一起交给大模型生成答案。

## 定义

用户提问后，系统不从模型记忆直接回答，而是先从外部知识库检索相关材料，再把材料与问题交给模型生成。本质是**用外部知识弥补模型的知识冻结、私有知识缺失与信息滞后**。

## 机制/原理

标准两阶段流程：

**索引阶段（离线，一次性建库）**
1. 加载（Load）：原始文件 → `Document` 对象（→ [[01-Wiki/concepts/Document]]）
2. 分割（Split）：长文档切成片段（→ [[01-Wiki/concepts/文本分块]]）
3. 向量化（Embed）：片段转成向量
4. 存储（Store）：片段内容 + 向量 + metadata 写入向量库（→ [[01-Wiki/entities/Redis向量库]]）

**检索与生成阶段（在线，每次提问执行）**
1. 用户输入问题 → 问题向量化
2. 向量库相似检索，召回相关片段
3. 片段作为 `context` 放入 Prompt
4. `context + question` 一起发给大模型生成答案

**生产级增强**：召回后补过滤/重排（rerank）、生成后保留来源（文件名/页码）、持续评测与观测。

## 管道式 vs Agent 式

| 维度 | 管道式 RAG（2-Step） | Agent 式 RAG |
|------|---------------------|-------------|
| 是否检索 | 代码写死，每次必检 | 模型自决：何时检、检几次 |
| 结构 | 检索器+Prompt+LLM 固定流水线 | 智能体编排（多工具决策） |
| 适用 | 企业知识库问答、FAQ、手册 | 复杂查询、多步推理 |

## 与其他方案对比

| 方案 | 本质 | 优势 | 局限 |
|------|------|------|------|
| 直接问模型 | 无外部知识 | 上手最快 | 幻觉多、不知私有/最新知识 |
| RAG | 先检索再生成 | 更新快、可追溯、改动小 | 依赖文档质量/分块/检索效果 |
| 微调 | 调模型参数 | 改变风格与任务习惯 | 成本高、更新慢 |
| RAG+微调 | 两者结合 | 兼顾知识与表达 | 成本与复杂度更高 |

## 边界与常见误区

- RAG **不是免费的**：每次问答多一次检索 → 时延更高；检索结果进 Prompt → Token 消耗更高
- RAG **不是绑定某个向量库**：换 Chroma/FAISS/Milvus/PgVector，整体思路不变
- 长上下文模型 ≠ 不用切块：整篇塞进上下文会稀释关键信息
- 回答质量由整条链路决定：文档解析质量"决定了一半"，不全是模型问题

## 相关概念

- [[01-Wiki/concepts/文本分块]]、[[01-Wiki/concepts/Document]]、[[01-Wiki/concepts/文档解析]]（解析为何是质量的一半）
- [[01-Wiki/concepts/GraphRAG]]（知识图谱增强范式，详见图 RAG 系列摘要）
- 进阶：混合检索（BM25+向量，见 [[01-Wiki/concepts/混合检索]] / [[01-Wiki/concepts/BM25]]）、Rerank、查询改写（HyDE）
- 框架实现：[[01-Wiki/entities/LangChain]]、[[01-Wiki/entities/LlamaIndex]]（含 Query Engine / VectorStoreIndex 内部机制）
- 补充：[[01-Wiki/summaries/AI Agent 面试题库 - RAG 系统篇]]（Q1 原理与 vs 微调边界、Q2 离线/在线双链路流水线、Q10 部署挑战、Q12 开源框架选型）、[[01-Wiki/summaries/开发岗专项面试题库]]（一-Q1 日均百万级 RAG 系统设计与容量推算、二-Q7 增量索引）
