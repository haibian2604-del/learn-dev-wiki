---
type: summary
domain: tech
tags: [agent]
created: 2026-08-26
updated: 2026-08-26
sources: ["[[00-Raw/agent-basics/什么是 Agent]]"]
status: mature
---

# 什么是 Agent（zero2Agent 基础 01）

> 从工程角度理解 Agent 的最小定义——不是“更会聊天的模型”，而是“更会执行任务的系统”。

## 一句话定义

从工程视角，**Agent 是一个围绕目标持续推进任务的系统**。它通常具备：

- 接收目标，而非只处理单轮输入
- 保留状态，而非每次都像第一次对话
- 根据中间结果改变后续动作
- 在需要时调用外部工具
- 在不确定环境里迭代尝试，而非一步写死

重点不是“模型更强”，而是“系统闭环更完整”。

## 值得记住的公式

> **Agent = LLM + Context + Tools**

- **LLM**：理解、推理、生成
- **Context**：模型每一步能看到什么（指令、历史、状态、检索结果）
- **Tools**：外部行动能力（查询、执行、写入）

公式把注意力从“模型多强”转移到“系统怎么组织”。同等模型在不同 Context 策略与 Tools 配置下行为差距巨大——这也是 **Context Engineering（上下文工程）** 成为 2025-2026 行业高频词的原因（它不是 Prompt Engineering 的换皮，而是把“送进模型的完整信息组合”作为一等工程问题）。

## 最小闭环 vs 普通 LLM App

- 普通 LLM App：一次输入、一次输出，一次性响应。
- Agent：围绕目标持续推进、根据状态改变行为、形成闭环。

## 典型组成（朴素但像样）

`State`（当前任务状态）/ `Tools`（外部能力）/ `Memory`（会话内或跨会话）/ `Planner`（下一步做什么）/ `Policy & Guardrails`（限制乱做）/ `Evaluator`（结果是否足够好）。不是每个 Agent 都必须全有，但越接近真实业务越重要。

## 常见坑

只要“模型调用工具”就自称 Agent，但若没有明确状态、没有执行闭环、没有结束条件、无法根据结果调整下一步——那它更像“带工具调用的 LLM”，而非完整 Agent。

## 判断三件事

1. 是否围绕目标持续推进任务？
2. 是否根据中间状态改变行为？
3. 是否是闭环系统，而非一次性生成？

## 关联

- 概念：[[01-Wiki/concepts/AI Agent]]、[[01-Wiki/concepts/上下文工程]]、[[01-Wiki/concepts/Workflow Graph]]
- 系列：[[01-Wiki/entities/zero2Agent]]
