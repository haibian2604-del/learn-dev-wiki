---
type: summary
domain: tech
tags: [graphrag]
created: 2026-08-01
updated: 2026-08-01
sources: ["[[00-Raw/rag/第一节 基于知识图谱的RAG]]"]
status: growing
---

# 基于知识图谱的 RAG（GraphRAG 总论）

> 系统论述传统 RAG 的局限、知识图谱如何赋能 RAG，以及 GraphRAG 的通用架构、方法论分类、前沿框架与评估体系。（Datawhale all-in-rag 第 7 章 §20）

## 核心观点

- **传统 RAG 的 7 大局限**：关系理解缺失、上下文碎片化、检索噪声与幻觉、推理能力有限、跨文档联结弱、实体歧义与别名、时效性与版本一致性不足（→ [[01-Wiki/concepts/GraphRAG]]）
- **知识图谱的 4 大优势**：结构化语义表达、增强推理（多跳）、事实性与可解释性、异构数据集成；进阶含本体约束、溯源/置信度、时间态建模
- **三阶段通用架构**：知识图谱构建 → 图谱检索（混合检索主流：实体定位 + 子图探索 + 证据抽取 + 社区检测）→ 增强生成（图证据 + 原文联合注入）
- **方法论三分**：知识驱动（强逻辑/可解释）、索引驱动（集成成本低）、混合型（稳健但复杂）
- **前沿框架**：Microsoft GraphRAG（Leiden 社区分层摘要）、LightRAG（轻量双层）、FRAG（模块分流）、GraphIRAG（迭代检索）
- **评估维度**：检索质量（Context Precision/Recall、Citation）、生成质量（Faithfulness/ROUGE/EM）、系统性能（Latency/QPS/Cost）
- **生产挑战**：图谱动态维护、可扩展性、安全隐私（中毒/注入）、成本

## 关键数据

| 指标 | 数值/说明 | 出处 |
|------|-----------|------|
| 基准集（多跳） | HotpotQA、2WikiMultihopQA、MuSiQue | 本文 §4.2 |
| 基准集（复杂） | WebQSP、ComplexWebQuestions(CWQ) | 本文 §4.2 |
| KGQA 基准 | KGQAgen-10k | 本文 §4.2 |
| RRF 平滑常数 k | 默认 60 | 关联 [[01-Wiki/concepts/查询路由]] |

## 亮点与不足

- 亮点：从"为什么"到"怎么做"到"框架对比"到"评估"的完整认知闭环；给出可落地的 Cypher 示例（两跳收购路径）
- 不足：偏综述，具体工程实现需结合后续章节（第 9 章）

## 与既有知识的联系

- 是 [[01-Wiki/concepts/RAG]] 的进阶范式，建议作为 RAG 页的"GraphRAG 分支"入口
- 直接支撑 [[01-Wiki/concepts/GraphRAG]]、[[01-Wiki/concepts/知识图谱]] 两概念页
- 同系列：[[01-Wiki/summaries/图RAG架构设计]]、[[01-Wiki/summaries/图数据建模与准备]]、[[01-Wiki/summaries/Milvus索引构建]]、[[01-Wiki/summaries/智能查询路由与检索策略]]

## 延伸问题

- 社区检测（Leiden）的层级摘要具体如何生成与应用？
- GraphRAG 在金融/医疗领域的落地案例与隐私方案？
