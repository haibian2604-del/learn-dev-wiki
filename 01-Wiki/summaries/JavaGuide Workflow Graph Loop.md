---
type: summary
domain: tech
tags: [agent, workflow, llm]
created: 2026-07-31
updated: 2026-07-31
sources: ["[[00-Raw/loop-engineering/JavaGuide-Workflow Graph Loop]]"]
status: seedling
---

# JavaGuide · Workflow Graph Loop

> Agent 工作流图与循环编排：用有向图建模 Agent 执行路径，图节点=任务步骤，边=流转条件，循环实现多步重试与分支决策。

## 核心观点

- **工作流图**：DAG（有向无环图）建模 Agent 执行路径——节点=任务步骤（理解/推理/生成/验证），边=条件流转
- **循环嵌入图**：图结构中允许循环边（重试、回退、分支），与 ReAct 的自由循环不同——图的循环是预定义的结构化路径
- **图 vs 自由循环**：图适合"路径可枚举的确定性任务"（如售后流程）；自由循环适合"路径不可预知需要探索的任务"
- **编排与 Harness 的分工**：Workflow Graph 属 Harness L3（执行编排层），负责"什么时候做什么"；Harness 其他层负责"环境、工具、验证"

## 相关概念

→ [[01-Wiki/concepts/Workflow Graph]]、[[01-Wiki/entities/hello-agents]]（ReAct 自由循环对比）
