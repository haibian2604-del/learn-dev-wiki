---
type: summary
domain: tech
tags: [graphrag]
created: 2026-08-01
updated: 2026-08-01
sources: ["[[00-Raw/rag/图RAG架构设计]]"]
status: growing
---

# 图 RAG 架构设计（系统搭建与模块划分）

> 手把手搭建一个图 RAG 系统：引入 [[01-Wiki/entities/Neo4j]] 与智能查询路由，模块化设计六大组件，解决传统 RAG 复杂查询与关系推理短板。（Datawhale all-in-rag 第 9 章 §1）

## 核心观点

- **演进动机**：传统 RAG（父子分块）能答简单菜谱查询，但缺关系建模、跨文档关联、多跳推理（→ [[01-Wiki/concepts/GraphRAG]]）
- **系统核心优势**：结构化知识表达、增强推理、智能查询路由、事实性与可解释性
- **模块化六大组件**：
  1. 图数据准备（GraphDataPreparationModule）：连 Neo4j、构建结构化菜谱文档
  2. 向量索引（MilvusIndexConstructionModule）：BGE-small-zh-v1.5，512 维
  3. 混合检索（HybridRetrievalModule）：双层 + 向量 + BM25 → RRF 融合
  4. 图 RAG 检索（GraphRAGRetrieval）：多跳遍历、子图提取
  5. 智能查询路由（IntelligentQueryRouter）：LLM 分析查询选策略
  6. 生成集成（GenerationIntegrationModule）：流式输出、错误重试
- **数据流**：数据准备（Neo4j 加载→结构化文档→分块→Milvus 索引）→ 查询处理（路由分析→选策略→检索→生成）→ 错误降级（高级失败回退传统，传统失败报异常）

## 关键数据

| 项 | 值 | 出处 |
|----|----|------|
| Neo4j Web 端口 | 7474（Bolt 7687） | 本文 §2.3 |
| Milvus 端口 | 19530 | 本文 §2.4 |
| 嵌入维度 | 512（BGE-small-zh-v1.5） | 本文 §3.2 |
| LLM | Moonshot（.env 配置 API Key） | 本文 §2.5 |

## 亮点与不足

- 亮点：环境配置（Docker Compose + .env）可直接复现；模块边界清晰，便于维护
- 不足：示例 domain 局限于菜谱，通用化需改造；系统自述"不完善，仅作流程理解"

## 与既有知识的联系

- 落地 [[01-Wiki/concepts/GraphRAG]] 的架构；依赖 [[01-Wiki/entities/Neo4j]]、[[01-Wiki/entities/Milvus]]
- 路由逻辑详见 [[01-Wiki/summaries/智能查询路由与检索策略]]
- 同系列：[[01-Wiki/summaries/基于知识图谱的RAG]]、[[01-Wiki/summaries/图数据建模与准备]]、[[01-Wiki/summaries/Milvus索引构建]]

## 延伸问题

- 智能查询路由的 LLM 调用成本如何优化（缓存/轻量模型）？
- 生产级图 RAG 的增量更新与缓存策略？
