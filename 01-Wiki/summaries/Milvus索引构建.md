---
type: summary
domain: tech
tags: [graphrag]
created: 2026-08-01
updated: 2026-08-01
sources: ["[[00-Raw/vector-db/Milvus索引构建]]"]
status: growing
---

# Milvus 索引构建（图 RAG 向量索引）

> 把图数据库构建的结构化文档向量化并存入 [[01-Wiki/entities/Milvus]]，专为图 RAG 设计带图谱元数据的集合 Schema，并对比 FAISS。（Datawhale all-in-rag 第 9 章 §3）

## 核心观点

- **索引构建流程**：文档构建器 → 分块处理器 → 向量化模型 → Milvus 索引（连接图数据与向量检索的关键环节）
- **模块设计**：`MilvusIndexConstructionModule`（host/port/collection/dimension/model 可配，中文默认 BGE-small-zh-v1.5）
- **图 RAG 专用 Schema**：`vector`(512) + 图特化字段 `node_id`/`recipe_name`/`node_type`/`category`/`cuisine_type`/`difficulty`/`doc_type`/`chunk_id`/`parent_id`，全部可用于过滤检索
- **索引优化**：批量插入（batch_size 100）、`IVF_FLAT` + `COSINE`（`nlist=1024`）、`force_recreate=True` 保 Schema 一致、`_safe_truncate` 防超长、图元数据完整保留支持复合检索
- **为何从 FAISS 换 Milvus**：FAISS 纯库/无持久化/单机/元数据弱/高并发受限；Milvus 提供完整 DB 功能、云原生扩缩容、丰富元数据、企业级监控备份

## 关键数据

| 项 | 值 | 出处 |
|----|----|------|
| 嵌入维度 | 512 | 本文 §2.1 |
| 嵌入模型 | BAAI/bge-small-zh-v1.5 | 本文 §2.1 |
| 索引类型 | IVF_FLAT，COSINE，nlist=1024 | 本文 §3.2 |
| 批量插入 | batch_size=100 | 本文 §3.1/§4.1 |

## 亮点与不足

- 亮点：Schema 把图结构信息沉淀进向量库，支持"按菜系/难度复合过滤"的复合检索
- 不足：仅单机 standalone 示例，分布式调优未展开

## 与既有知识的联系

- 支撑 [[01-Wiki/entities/Milvus]] 实体页；是 [[01-Wiki/concepts/GraphRAG]] 的向量召回层
- 与 [[01-Wiki/entities/Redis向量库]] 形成向量后端对比
- 同系列：[[01-Wiki/summaries/基于知识图谱的RAG]]、[[01-Wiki/summaries/图RAG架构设计]]、[[01-Wiki/summaries/图数据建模与准备]]、[[01-Wiki/summaries/智能查询路由与检索策略]]

## 延伸问题

- IVF_FLAT 与 HNSW 在图 RAG 规模下的召回/延迟权衡？
- 图元数据过滤与向量检索如何联合下推以获得最佳性能？
