---
type: entity
domain: tech
tags: [vector-db, graphrag]
created: 2026-08-01
updated: 2026-08-01
sources: ["[[01-Wiki/summaries/Milvus索引构建]]", "[[01-Wiki/summaries/图RAG架构设计]]", "[[01-Wiki/summaries/向量数据库全面解析]]"]
status: seedling
---

# Milvus

> 云原生向量数据库，在 [[01-Wiki/concepts/GraphRAG]] 中承担向量索引构建与语义相似检索；生产级替代 FAISS。同类参见 [[01-Wiki/entities/Redis向量库]]。

## 是什么

Milvus 是高性能、分布式的向量数据库，用于存储和检索 embeddings，支持复杂 Schema、CRUD、分布式部署。在图 RAG 中作为语义向量召回后端。

## 关键事实

- **部署**：Milvus standalone Docker Compose（`docker-compose up -d`），端口 19530；`.env` 配置 `MILVUS_HOST/MILVUS_PORT`
- **嵌入模型**：默认 `BAAI/bge-small-zh-v1.5`（中文优化），512 维向量空间
- **集合 Schema**：除 `vector`(FLOAT_VECTOR 512) 外，保留图数据特化元数据——`node_id`、`recipe_name`、`node_type`、`category`、`cuisine_type`、`difficulty`、`chunk_id`、`parent_id` 等，支持复合过滤
- **索引**：`IVF_FLAT` + `COSINE` 相似度，`nlist=1024`；批量插入（batch_size 100）+ `_safe_truncate` 防字段超长
- **验证**：`describe_collection` / `query count(*)` / `search` 测试向量自检
- **为何取代 FAISS**（→ [[01-Wiki/summaries/Milvus索引构建]]）：FAISS 纯库模式、无持久化、单机限制、元数据支持有限、高并发受限；Milvus 提供完整 DB 功能、云原生扩缩容、丰富元数据、企业级监控/备份

## 时间线（本项目）

- 2026-08-01：在图 RAG 系统中替代第 8 章的 FAISS，构建烹饪知识图谱向量集合 `cooking_knowledge`

## 选型定位（→ [[01-Wiki/summaries/向量数据库全面解析]]）

- **超大规模首选**：GPU 加速、亿级数据、水平分片；与 Qdrant/Pinecone/Chroma/Weaviate/pgvector 横评见对比摘要
- 劣势：部署依赖 etcd/MinIO、运维门槛高；小数据量杀鸡用牛刀

## 相关

- 相关实体：[[01-Wiki/entities/Neo4j]]（同系统图存储）、[[01-Wiki/entities/Redis向量库]]（另一向量后端对比）、[[01-Wiki/entities/Qdrant]]、[[01-Wiki/entities/Pinecone]]、[[01-Wiki/entities/Chroma]]、[[01-Wiki/entities/Weaviate]]、[[01-Wiki/entities/pgvector]]
- 相关概念：[[01-Wiki/concepts/GraphRAG]]、[[01-Wiki/concepts/RAG]]、[[01-Wiki/concepts/向量数据库]]
