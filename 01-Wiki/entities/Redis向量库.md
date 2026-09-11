---
type: entity
domain: tech
tags: [vector-db, rag, redis]
created: 2026-07-31
updated: 2026-08-01
sources: ["[[01-Wiki/summaries/第 19 章 RAG 检索增强生成]]", "[[01-Wiki/summaries/Milvus索引构建]]", "[[01-Wiki/summaries/向量数据库全面解析]]"]
status: seedling
---

# Redis 向量库

> RAG 中存储"文本片段 + 向量 + metadata"并支持相似检索的向量数据库后端（Redis / RedisStack）。

## 是什么

向量数据库负责 RAG 索引阶段的存储与检索阶段的相似召回。核心要点：**真正参与向量化的是正文 `page_content`，`metadata` 用于来源展示、过滤、结果解释**。

## 关键事实

- **写入**：`Redis.from_documents(documents, embedding, redis_url, index_name)`——一步完成向量化+建索引；或先建 `RedisVectorStore` 实例再 `add_texts(texts, metadata)` 追加（内部自动调 `embed_documents`）
- **检索**：`vector_store.as_retriever(search_kwargs={"k": n})` 得到检索器；`similarity_search_with_score(query, k)` 返回 `(Document, score)` 列表——**score 多为"距离"，越小越相似**（示例中 `1 - score` 换算成相似度仅为展示直观）
- **关键约束**：写入与检索的 `index_name`、`redis_url` 必须一致；Embedding 模型须一致以保持向量空间一致
- **示例环境**：`redis://localhost:26379`，嵌入模型 `DashScopeEmbeddings`（text-embedding-v3，向量维度 1024）

## 边界与常见误区

- **RAG 的本质不是绑定 Redis**：换 Chroma、FAISS、Milvus、PgVector 思路不变
- 项目规模变大后考虑 Milvus 等专业向量库的 HNSW、BM25、Analyzer、标量过滤与混合检索能力

## 相关

- 相关概念：[[01-Wiki/concepts/RAG]]、[[01-Wiki/concepts/Document]]
- 相关实体：[[01-Wiki/entities/LangChain]]、[[01-Wiki/entities/Milvus]]（生产级向量库，第 9 章取代 FAISS）；与 Pinecone/Qdrant/Chroma/Weaviate/pgvector 六方横评见 [[01-Wiki/summaries/向量数据库全面解析]]
- 相关来源：[[01-Wiki/summaries/第 19 章 RAG 检索增强生成]]、[[01-Wiki/summaries/Milvus索引构建]]、[[01-Wiki/summaries/向量数据库全面解析]]
