---
type: entity
domain: tech
tags: [vector-db]
created: 2026-08-01
updated: 2026-08-01
sources: ["[[01-Wiki/summaries/向量数据库全面解析]]"]
status: seedling
---

# Pinecone

## 是什么

完全托管的商业向量数据库 SaaS，零运维、与 OpenAI / Vercel / LangChain 深度集成。

## 关键事实

- **优势**：全托管不操心基础设施；SDK 丰富、上手极快；延迟稳定
- **劣势**：纯商业、价格高；数据在第三方，安全合规存疑；不开源、不可控
- **混合检索** ✅、**全文搜索** ❌、**多租户** ✅（Namespace）
- 选型定位：无运维团队时的首选（→ [[01-Wiki/concepts/向量数据库]]）

## 相关

- 同类对比：[[01-Wiki/entities/Milvus]]、[[01-Wiki/entities/Qdrant]]、[[01-Wiki/entities/Chroma]]、[[01-Wiki/entities/Weaviate]]、[[01-Wiki/entities/pgvector]]
- 相关概念：[[01-Wiki/concepts/RAG]]、[[01-Wiki/concepts/向量数据库]]
