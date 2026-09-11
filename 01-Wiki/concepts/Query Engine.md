---
type: concept
domain: tech
tags: [llamaindex, rag]
created: 2026-08-19
updated: 2026-08-19
sources: ["[[01-Wiki/summaries/Query Engine 架构与工作原理]]"]
status: seedling
---

# Query Engine

> LlamaIndex 中与系统交互的主要接口：协调 Retriever（检索）与 Response Synthesizer（合成），完成"用户问题→最终答案"的完整流程。

## 定义
Query Engine 是连接"数据层（Index）"与"答案层（Response）"的指挥中心，位于 Index 之后、Response 之前。

## 机制/原理
- **两段式**：Retriever 从 Index 返回最相关 Node 列表（不调 LLM）；Response Synthesizer 把 Node+问题合成为连贯答案（调 LLM）。
- **retrieve() vs query()**：`retriever.retrieve()` 返回 List[NodeWithScore]，用于调试检索质量；`query_engine.query()` 返回完整 Response（含 source_nodes 来源）。
- **四种合成模式**（ResponseMode）：
  - REFINE：逐 Node 精炼，适合 <20 个 Node、答案有层次（默认推荐）
  - SIMPLE_SUMMARIZE：拼接后一次性生成，<5 个 Node、追求速度
  - COMPACT_ACCUMULATE：塞不下自动压缩，自适应
  - TREE_SUMMARIZE：逐 Node 摘要再递归两两合并，>20 个 Node 结构化总结
- **请求生命周期**：预处理（查询转换/HyDE）→ 检索 → 后处理（node_postprocessors：过滤/rerank/去重）→ 合成 → 构建 Response
- **组装**：`index.as_query_engine()` 等价于手动 RetrieverQueryEngine(retriever, synthesizer)；深度定制需手动组装。

## 例子
```python
query_engine = index.as_query_engine(similarity_top_k=5, response_mode="refine")
response = query_engine.query("S1 的保修期？")
print(response.response)          # 答案
for n in response.source_nodes:   # 来源
    print(f"[{n.score:.3f}] {n.text[:80]}")
```

## 边界与常见误区
- 误区：Query Engine = Retriever。错——Retriever 只找，Query Engine 找+答。
- 误区：as_query_engine 参数即全部。错——混合检索权重、refine prompt 等需手动组装。
- 误区：一个 Index 只能一个 Query Engine。错——可建多个不同配置共享同一数据。
- vs LangChain Chain：LlamaIndex 开箱即用、来源追踪内置、代码量约 1/4；代价是灵活性降低。

## 相关概念
- [[01-Wiki/concepts/RAG]]（检索+生成母体）、[[01-Wiki/concepts/混合检索]]（Retriever 可替换为混合检索器）
- [[01-Wiki/concepts/查询路由]]（后处理 rerank 同层）、[[01-Wiki/concepts/文本分块]]（chunk 粒度影响合成）
- 实体：[[01-Wiki/entities/LlamaIndex]]、[[01-Wiki/entities/LangChain]]
