---
type: entity
domain: tech
tags: [vector-db]
created: 2026-08-01
updated: 2026-08-01
sources: ["[[01-Wiki/summaries/向量数据库全面解析]]"]
status: seedling
---

# Weaviate

## 是什么

Go 编写的开源向量数据库，模块化架构，主打向量 + 关键词混合搜索。

## 关键事实

- **优势**：向量+关键词混合搜索；模块架构、生态丰富；内置多种向量化模块
- **劣势**：学习曲线陡；部分高级功能配置复杂
- **混合检索** ✅、**全文搜索** ✅、**多租户** ✅
- 选型定位：需要混合搜索（向量+关键词一起）的场景（→ [[01-Wiki/concepts/向量数据库]]）

## 相关

- 同类对比：[[01-Wiki/entities/Milvus]]、[[01-Wiki/entities/Qdrant]]、[[01-Wiki/entities/Pinecone]]、[[01-Wiki/entities/Chroma]]、[[01-Wiki/entities/pgvector]]
- 相关概念：[[01-Wiki/concepts/RAG]]、[[01-Wiki/concepts/向量数据库]]
