---
type: summary
domain: tech
tags: [agent, harness, llm]
created: 2026-07-31
updated: 2026-07-31
sources: ["[[00-Raw/harness/JavaGuide-Harness Engineering]]"]
status: growing
---

# JavaGuide · Harness Engineering

> ~7800 字：Agent = Model + Harness。六层架构拆解 + 同模型换接口编码分数 6.7%→68.3% 的实证 + OpenAI/Anthropic/Stripe 一线团队实战。

## 核心观点

- **Agent = Model + Harness**：模型只提供推理和生成，Harness 把状态、工具、反馈、执行环境和安全边界串起来。模型像 CPU，Harness 像操作系统（CPU 再强 OS 崩也没用）
- **三个工程层级关系**：Prompt Engineering（怎么说清楚）⊂ Context Engineering（该看什么）⊂ Harness Engineering（系统怎么持续执行/纠偏/观测/恢复）
- **六层架构**（→ [[01-Wiki/concepts/Harness Engineering]]）：
  - L1 信息边界层（该知道什么/不该知道什么）
  - L2 工具系统层（怎么和外部交互）
  - L3 执行编排层（多步骤串联）
  - L4 记忆与状态层（长任务状态管理）
  - L5 评估与观测层（独立于生成的验证）
  - L6 约束校验与恢复层（出错时重试/回滚/降级）
- **从零搭建优先级**：文件系统（L2）→ 沙箱（L2）→ 约束规则（L6）→ 记忆（L4）→ 观测（L5）→ 编排（L3）。先做"不崩"再做"聪明"
- **一线团队复用模式**：OpenAI 往 Codex 里灌 AGENTS.md + 子代理架构；Anthropic 用结构化文件作为 Agent 记忆基座；Stripe 把 SDK 文档直接放进 Agent 知识库

## 相关概念

→ [[01-Wiki/concepts/Harness Engineering]]
