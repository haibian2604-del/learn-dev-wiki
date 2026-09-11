---
type: summary
domain: tech
tags: [llamaindex, rag]
created: 2026-08-19
updated: 2026-08-19
sources: ["[[00-Raw/llamaindex/Query Engine 架构与工作原理]]"]
status: growing
---

# Query Engine 架构与工作原理

> LlamaIndex Query Engine 是连接"数据层"与"答案层"的指挥中心：协调 Retriever（检索）+ Response Synthesizer（合成）完成从问题到答案的完整流程。

## 核心观点
- **两段式架构**：Retriever（从 Index 找相关 Node）+ Response Synthesizer（Node+问题→答案），理解这一点就懂了 Query Engine 80%（→ [[01-Wiki/concepts/Query Engine]]）
- **retrieve() vs query()**：前者只检索返回 List[NodeWithScore]、不调 LLM（调试用）；后者调 LLM 合成完整 Response（生产用）
- **四种合成模式**：REFINE（默认，逐 Node 精炼，<20 个）、SIMPLE_SUMMARIZE（少而快，<5）、COMPACT_ACCUMULATE（自适应压缩）、TREE_SUMMARIZE（多而结构化，>20）
- **一次查询生命周期**：预处理→检索→后处理（node_postprocessors 过滤/rerank/去重）→响应合成→构建 Response（含 source_nodes 来源追踪）
- **vs LangChain Chain**：LlamaIndex 面向 RAG 的高级抽象、开箱即用、来源追踪内置、代码量不到 1/4；代价是灵活性降低（→ [[01-Wiki/entities/LangChain]]）

## 关键数据
| 指标 | 数值 | 出处 |
|------|------|------|
| LlamaIndex 代码量 | ~10 行（同任务 LangChain ~40 行） | 代码对比 |
| similarity_top_k | 默认 5 | 示例 |

## 亮点与不足
- 亮点：每个 phase 可独立定制替换；同一 Index 可建多个不同配置的 Query Engine
- 不足：高度封装下，深度定制需退回手动组装 RetrieverQueryEngine

## 与既有知识的联系
- Retriever 是 [[01-Wiki/concepts/RAG]] 检索阶段的具象
- 后处理 rerank 呼应 [[01-Wiki/concepts/查询路由]] 的融合排序
- 合成模式与 [[01-Wiki/concepts/文本分块]] 的 chunk 粒度互相影响

## 延伸问题
- node_postprocessors 的 rerank 与查询路由的 rerank 是否同一层
- streaming 模式下 Response 构建如何变化
