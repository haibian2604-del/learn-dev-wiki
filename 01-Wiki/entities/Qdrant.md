---
type: entity
domain: tech
tags: [vector-db]
created: 2026-08-01
updated: 2026-08-01
sources: ["[[01-Wiki/summaries/向量数据库全面解析]]"]
status: seedling
---

# Qdrant

## 是什么

Rust 编写的开源向量数据库，主打高性价比与精细过滤，中维向量场景性能突出。

## 关键事实

- **优势**：Rust 性能优、内存占用低；中维(384-768) P99 延迟约 15ms（纯 CPU）；原生全文搜索 + 精细过滤；支持混合云/私有云
- **劣势**：不支持 GPU 加速；超大规模(亿级)不如 Milvus
- **混合检索** ✅、**全文搜索** ✅ 原生、**多租户** ✅（Collection）
- 选型定位：有基本运维团队的生产级 RAG / 中维高性价比首选（→ [[01-Wiki/concepts/向量数据库]]）

## 例子

Agent Memory 混合检索：`search(collection_name="agent_memory", query_vector=..., query_filter=Filter(must=[user_id, timestamp>=...]), limit=10)`

## 相关

- 同类对比：[[01-Wiki/entities/Milvus]]、[[01-Wiki/entities/Pinecone]]、[[01-Wiki/entities/Chroma]]、[[01-Wiki/entities/Weaviate]]、[[01-Wiki/entities/pgvector]]
- 相关概念：[[01-Wiki/concepts/RAG]]、[[01-Wiki/concepts/向量数据库]]
