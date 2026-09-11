---
type: summary
domain: tech
tags: [agent, llm]
created: 2026-08-27
updated: 2026-08-27
sources: ["[[00-Raw/agent-training/Agent SFT 关键细节：从轨迹数据到 Loss Mask]]"]
status: mature
---

# Agent SFT 关键细节：从轨迹数据到 Loss Mask（learn-agent-training 01）

> Agent SFT 与对话 SFT 的本质区别、轨迹数据构造、Loss Mask 策略与数据配比经验（整理自彭思达 Agent SFT 学习笔记）。

## Agent SFT vs 对话 SFT

| | 对话 SFT | Agent SFT |
|---|---|---|
| 训练目标 | 生成一个好回复 | 执行一整条正确的轨迹 |
| 数据粒度 | 单轮问答 | 多轮推理 + 工具调用 + 最终回复 |
| token 类型 | 用户输入 + 模型回复 | System/User/Think/Tool Call/Tool Return/Response |
| loss 计算 | 对回复算 loss | 精细控制哪些 token 算 loss |

## 怎么造轨迹数据

- **方式一 人工标注**：质量高成本极高，适合种子数据集
- **方式二 强模型生成 + 人工筛选**（主流）：GPT-4/Claude 跑任务生成轨迹 + 人工筛选修正，成本可控规模上得去

两个注意点：
1. **必须包含"失败"动作的轨迹**——只用成功轨迹训练的 Agent 遇到失败会死循环或胡说
2. **轨迹长度适中**——太短学不到复杂流程，太长效率低且引入噪声；天然多步的任务拆子任务训练

## Loss Mask：哪些 token 该算 loss

核心思想：**只对模型应该生成的部分计算 loss，屏蔽不需要学习的部分**（token level mask）。

| 轨迹部分 | 计算 Loss? | 原因 |
|---|---|---|
| System Prompt / User 消息 | 不算 | 模型不需要学习生成 |
| `<think>` 部分 | 看情况 | 质量高就留，质量差就 mask（避免学到低质量推理模式） |
| `<tool_call>` 部分 | **算** | 核心学习目标——正确时机调正确工具传正确参数 |
| Tool 返回结果 | 不算 | 环境返回的，不是模型生成的 |
| 最终回复 | **算** | 根据工具结果总结输出 |

## 数据配比（防通用能力崩塌）

只用 Agent 轨迹训练 → 模型把一切问题都当调工具任务。经验配比：Agent 轨迹 40-50%（核心但不能超 50%）+ Tool Calling 单轮 15-20% + 通用指令跟随 15-20%（Alpaca 类，保持对话）+ 长文本 5-10%（Agent 上下文天然长）+ 安全/拒绝 5-10%（**比对话模型高，因为 Agent 能真的执行操作**）。

## SFT 与 RL 的配合

- **SFT 目标**：让模型先能跑起来（调工具格式/参数对、推理流程走通）
- **RL 目标**：提升决策质量（基于 Reward 优化策略、多路径选最优、提升鲁棒性）
- **技巧 1：SFT 阶段不要把完成率刷太高**（70-80% 即可，刷到 95%+ RL 无探索空间）
- **技巧 2：SFT checkpoint 作为 RL 的 reference model**（KL 约束，防格式退化、保基本能力）

## 关联

- 概念：[[01-Wiki/concepts/Agent SFT]]、[[01-Wiki/concepts/Agent 强化学习]]、[[01-Wiki/concepts/Agent 训练数据]]
- 系列：[[01-Wiki/entities/zero2Agent]]（learn-agent-training）
