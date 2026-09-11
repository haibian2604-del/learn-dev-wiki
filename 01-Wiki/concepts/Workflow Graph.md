---
type: concept
domain: tech
tags: [agent, workflow, llm]
created: 2026-07-31
updated: 2026-08-01
sources: ["[[01-Wiki/summaries/JavaGuide Workflow Graph Loop]]", "[[01-Wiki/summaries/2026年AI Agent框架选型实战]]"]
status: growing
---

# Workflow Graph

> 用有向图（DAG + 循环边）建模 Agent 执行路径：节点=任务步骤，边=流转条件，循环实现重试与分支。

## 定义

区别于 ReAct 的"自由循环"（路径由 LLM 实时决定），Workflow Graph 是**预定义的结构化执行路径**：

- **节点**：任务步骤（理解用户意图 / 检索信息 / 推理分析 / 生成回答 / 验证纠正）
- **边**：流转条件（成功→下一步 / 失败→重试 / 信息不足→补充检索）
- **循环边**：允许回到上游节点重试或回退

## 与自由循环对比

| 维度 | Workflow Graph | 自由循环（ReAct） |
|------|---------------|-------------------|
| 路径 | 预定义 DAG | LLM 实时决策 |
| 确定性 | 高（边条件固定） | 低（取决于 LLM 表现） |
| 适合 | 可枚举路径的确定任务（售后/审批） | 探索性强路径不可预知的任务 |
| 终止 | 图终点自然终止 | 需 Loop Engineering 保证 |

## 在 Harness 中的位置

属 Harness L3（执行编排层）：图定义"什么时候做什么"；Harness 其余层提供"环境、工具、验证"。Workflow Graph + Loop Engineering = 结构化循环 + 自由循环的混合编排。

## 典型实现

- [[01-Wiki/entities/LangGraph]]（135K Stars）：状态化图基 Agent 工作流——每个 Agent 是一个节点，节点间连接定义数据流与控制流；100+ 预定义工具，可观测/可调试（→ 来源 [[01-Wiki/summaries/2026年AI Agent框架选型实战]]）
- 概念层面：节点=任务步骤、边=流转条件（成功→下一步 / 失败→重试 / 信息不足→补充检索）

## 相关概念

- [[01-Wiki/concepts/Loop Engineering]]（循环质量控制）
- [[01-Wiki/concepts/Harness Engineering]]（宿主层）
- [[01-Wiki/concepts/ReAct]]（自由循环对比）
