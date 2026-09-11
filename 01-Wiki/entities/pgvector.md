---
type: entity
domain: tech
tags: [vector-db]
created: 2026-08-01
updated: 2026-08-01
sources: ["[[01-Wiki/summaries/向量数据库全面解析]]"]
status: seedling
---

# pgvector

## 是什么

PostgreSQL 的向量检索扩展，零成本接入已有 PG 生态，适合中小规模。

## 关键事实

- **优势**：PG 扩展、零成本；支持 HNSW 和 IVF-Flat 索引；事务支持、数据一致性有保障；社区成熟、文档丰富
- **劣势**：性能不如专用向量库；百万级以上力不从心；缺少原生的向量管理与监控工具
- **混合检索** ⚠️ 需组合、**全文搜索** ✅ PG 原生、**多租户** ⚠️ 需手动
- 选型定位：已有 PG 的中小型 RAG（100 万以内）；不确定选型时从 pgvector 起步最稳（→ [[01-Wiki/concepts/向量数据库]]）

## 相关

- 同类对比：[[01-Wiki/entities/Milvus]]、[[01-Wiki/entities/Qdrant]]、[[01-Wiki/entities/Pinecone]]、[[01-Wiki/entities/Chroma]]、[[01-Wiki/entities/Weaviate]]
- 相关概念：[[01-Wiki/concepts/RAG]]、[[01-Wiki/concepts/向量数据库]]
