---
type: entity
domain: tech
tags: [agent, rag, llamaindex]
created: 2026-08-01
updated: 2026-08-19
sources: ["[[01-Wiki/summaries/2026 年 AI Agent 技术全景]]", "[[01-Wiki/summaries/为什么需要 LlamaIndex？（RAG 的痛点与 LlamaIndex 的定位）]]", "[[01-Wiki/summaries/统一数据接入：LlamaIndex 的 Connector 体系]]", "[[01-Wiki/summaries/9.1 项目概述与需求分析]]", "[[01-Wiki/summaries/10.1 多模态 RAG 概述与场景分析]]", "[[01-Wiki/summaries/Query Engine 架构与工作原理]]", "[[01-Wiki/summaries/VectorStoreIndex 深入：向量索引的内部机制与优化]]", "[[01-Wiki/summaries/文档解析的深度挑战]]", "[[01-Wiki/summaries/混合检索：向量搜索 + 关键词搜索的协同]]"]
status: mature
---

# LlamaIndex（原 GPT Index）

## 是什么

Meta 开发的 Agent/数据框架，专注企业数据检索与 RAG，将非结构化数据接入 LLM 应用。

## 关键事实

- **GitHub Stars**：40.9k+（Python/TypeScript）
- **核心能力**：强大的 RAG 能力；支持 PDF、API、SQL 等多种数据源；LlamaParse 文档解析业界领先
- **典型用法**：`VectorStoreIndex.from_documents(docs)` → `index.as_query_engine()`
- **适用场景**：知识库问答、企业数据检索、RAG 系统（→ [[01-Wiki/concepts/RAG]]）
- **选型定位**：RAG 场景首选（与 LangChain 搭配：LangChain 编排 + LlamaIndex 检索）

**内部架构要点（PyLLM 教程系列深化）**
- **数据接入 Connector 体系**：Reader/Loader 抽象，统一多源（文件/DB/API）接入；与 LangChain Loader 同思路（→ [[01-Wiki/summaries/统一数据接入：LlamaIndex 的 Connector 体系]]，源内容待补全）
- **文档解析**：默认 `SentenceSplitter(chunk_size=1024, overlap=20)`；核心矛盾是"小粒度保精准 vs 大粒度保完整"（→ [[01-Wiki/concepts/文档解析]]）
- **VectorStoreIndex**：Document→Node→Embedding→Vector Store，与存储后端解耦、可增量更新（→ [[01-Wiki/summaries/VectorStoreIndex 深入：向量索引的内部机制与优化]]）
- **Query Engine**：Retriever + Response Synthesizer 两段式，4 种合成模式，内置来源追踪；对比 LangChain Chain 代码量约 1/4（→ [[01-Wiki/concepts/Query Engine]]）
- **混合检索**：VectorIndexRetriever + BM25Retriever 经 QueryFusionRetriever(RRF) 融合（→ [[01-Wiki/concepts/混合检索]]、[[01-Wiki/concepts/BM25]]）
- **企业级落地**：多源接入 + RBAC 权限 + 引用溯源 + 管理后台，技术栈 LlamaIndex+FastAPI+Qdrant+PostgreSQL+Redis+OpenAI（→ [[01-Wiki/summaries/9.1 项目概述与需求分析]]）
- **多模态 RAG**：原生 MultiModalNode/ImageDocument/ImageRetriever，CLIP 跨模态对齐（→ [[01-Wiki/concepts/多模态 RAG]]）

## 时间线
- 2026-08-01：初建实体（来源 ×1，AI Agent 全景）
- 2026-08-19：批量摄入 PyLLM LlamaIndex 系列 8 篇，补内部架构要点，status 升 mature（来源 ×9）

## 相关

- 相关概念：[[01-Wiki/concepts/RAG]]、[[01-Wiki/concepts/AI Agent]]、[[01-Wiki/concepts/向量数据库]]、[[01-Wiki/concepts/Query Engine]]、[[01-Wiki/concepts/混合检索]]、[[01-Wiki/concepts/BM25]]、[[01-Wiki/concepts/文档解析]]、[[01-Wiki/concepts/多模态 RAG]]、[[01-Wiki/concepts/嵌入模型]]
- 同类框架：[[01-Wiki/entities/LangChain]]、[[01-Wiki/entities/AutoGen]]
- 教程来源：[[01-Wiki/entities/PyLLM]]
