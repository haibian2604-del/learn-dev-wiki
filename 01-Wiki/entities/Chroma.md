---
type: entity
domain: tech
tags: [vector-db]
created: 2026-08-01
updated: 2026-08-01
sources: ["[[01-Wiki/summaries/向量数据库全面解析]]"]
status: seedling
---

# Chroma

## 是什么

极轻量的开源向量数据库，开发者友好，适合本地开发与快速原型（PoC）。

## 关键事实

- **优势**：`pip install chromadb` 即用；内存模式、小数据秒级响应；Python/TS SDK 友好
- **劣势**：不适合大规模生产；无混合搜索等高级特性
- **混合检索** ❌、**全文搜索** ❌、**多租户** ❌
- 选型定位：快速原型/PoC；先跑通逻辑再迁移生产的验证层（→ [[01-Wiki/concepts/向量数据库]]）

## 例子

```python
client = chromadb.Client()
collection = client.create_collection("knowledge_base")
collection.add(documents=[...], ids=[...])
collection.query(query_texts=["哪个向量数据库性能最好"], n_results=3)
```

## 相关

- 同类对比：[[01-Wiki/entities/Milvus]]、[[01-Wiki/entities/Qdrant]]、[[01-Wiki/entities/Pinecone]]、[[01-Wiki/entities/Weaviate]]、[[01-Wiki/entities/pgvector]]
- 相关概念：[[01-Wiki/concepts/RAG]]、[[01-Wiki/concepts/向量数据库]]
