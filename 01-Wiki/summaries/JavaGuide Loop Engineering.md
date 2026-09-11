---
type: summary
domain: tech
tags: [agent, loop-engineering, llm]
created: 2026-07-31
updated: 2026-07-31
sources: ["[[00-Raw/loop-engineering/JavaGuide-Loop Engineering]]"]
status: seedling
---

# JavaGuide · Loop Engineering

> Agent 循环工程：从推理-行动循环的设计原理到工程实现，讨论循环终止条件、防无限循环策略、max_steps 之外的优雅退出机制。

## 核心观点

- Agent 的核心是一个 while 循环：推理→行动→观察→推理……，循环质量决定 Agent 稳定性
- **循环终止策略**：Finish 标记（被动）vs 置信度阈值（主动检测"什么时候该停"）
- **防无限循环**：max_steps 是最后防线；更优雅的机制包括：重复检测（连续 N 步无实质进展→退出）、上下文膨胀检测（token 超预算→压缩或终止）
- **循环与 Harness 的关系**：循环是 Harness L3（执行编排层）的核心实现方式

## 相关概念

→ [[01-Wiki/concepts/Loop Engineering]]、[[01-Wiki/concepts/ReAct]]（ReAct 是最经典的循环范式）
