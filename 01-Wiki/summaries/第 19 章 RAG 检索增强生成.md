---
type: summary
domain: tech
tags: [rag, langchain, llm]
created: 2026-07-31
updated: 2026-07-31
sources: ["[[00-Raw/rag/第 19 章 RAG 检索增强生成]]"]
status: growing
---

# 第 19 章 RAG 检索增强生成

> 《AI 智能体实战速成指南：从零到企业级落地》第 19 章：把 RAG 概念推进到 LangChain 代码实现层，覆盖文档加载、文本切分、Embedding、向量库、检索、Prompt 组装与生成全链路。

## 核心观点

- **RAG = 先检索、再生成**：不靠模型记忆直接回答，先从外部知识库检索相关材料，再与问题一起交给模型生成答案（→ [[01-Wiki/concepts/RAG]]）
- **RAG 解决四类问题**：知识冻结、私有知识缺失、最新信息不可用、回答缺少依据
- **标准两阶段**：索引阶段（离线：加载→切分→向量化→入库）与检索生成阶段（在线：问题向量化→召回→context 组装→生成）
- **RAG ≠ 向量库 + 大模型**：完整链路 = 数据处理、检索策略、上下文组织、答案生成、来源追踪、效果评测
- **影响回答质量的环节**：文档加载是否正确、文本切块是否合理、Embedding 是否稳定、检索是否召回真正相关片段、Prompt 是否用对上下文
- **管道式 RAG vs Agent 式 RAG**：前者流程代码写死（先检索再生成，本教程主线）；后者由模型决定要不要检索、检索几次
- **RAG 的现实代价**：响应时延更高、Token 消耗更高、效果依赖整条链路质量

## 关键数据

| 指标 | 数值 | 出处 |
|------|------|------|
| 章节体量 | 8591 字 / 22 分钟 | 原文 |
| 综合案例切块参数 | chunk_size=1000, overlap=0 | EmbeddingRagLLM.py |
| 检索条数 | k=2 | 综合案例 |
| 示例向量维度 | 1024（DashScope text-embedding-v3） | RedisVectorStore.py 输出 |
| chunk_overlap 建议 | 块大小的 10%~20% | §2.3.3 |

## 亮点与不足

- 亮点：案例用"有 RAG / 无 RAG"同题对比，直观展示外挂知识库的价值；`from_documents` vs `add_texts` 两种入库路线的辨析很实用
- 亮点：LCEL 一行式管道 `{"context": retriever, "question": RunnablePassthrough()} \| prompt \| llm` 是管道式 RAG 的缩影
- 不足：全文依赖 LangChain 生态演示，未覆盖其他框架的等价实现；向量库仅演示 Redis，未展开 Milvus/HNSW 等生产级能力（文中提及但未展开）

## 与既有知识的联系

- 依赖 [[01-Wiki/concepts/文本分块]] 与 [[01-Wiki/concepts/Document]] 两个基础数据结构概念
- 依赖实体 [[01-Wiki/entities/LangChain]]（组件体系）与 [[01-Wiki/entities/Redis向量库]]（存储后端）
- 与第 18 章（向量数据库与 Embedding 实战）衔接：本章补上"文档从哪来、如何切块、如何把检索结果喂给模型"

## 延伸问题

- Agent 式 RAG 的完整实现（第 21 章 Agent 智能体，待摄入）
- 混合检索（BM25 + 向量）与 RRF 融合排序的具体调优
- 生产级向量库（Milvus/HNSW）与 Redis 的选型差异
