---
type: concept
domain: tech
tags: [agent, llm]
created: 2026-08-27
updated: 2026-08-27
sources: ["[[01-Wiki/summaries/Agent RL 实战：用强化学习提升推理与决策质量]]", "[[01-Wiki/summaries/GRPO vs PPO：Agent 强化学习算法深度对比与选型]]"]
status: growing
---

# Agent 强化学习（Agent RL）

## 定义与动机

用强化学习提升 Agent 的推理与决策质量。SFT 是模仿学习（上限 = 标注数据质量），RL 通过任务级 Reward 信号让模型超越标注上限：减少冗余步骤、提升工具调用准确率、改善复杂推理链、学会错误恢复。

**SFT 的三个结构性问题**：模仿上限=标注质量；Exposure Bias（训练见 ground truth、推理基于自己输出，某步偏了后续没见过）；SFT 只学 token 级交叉熵不学"结果好不好"。

## RL 框架映射

State = 对话历史+工具返回+system prompt；Action = 模型下一步输出（tool_call 或文本）；Env = 工具执行引擎+沙箱；Reward = 任务完成+过程质量；Policy = Agent 模型本身。与游戏 RL 关键区别：动作空间是自然语言/JSON（维度极高）、状态空间是变长文本序列。

## Reward 设计（成败关键）

- **结果 Reward**：简单，但信号稀疏（10 步只有最后一步有反馈）
- **过程 Reward**：密集高效，但需定义"什么是好的中间步骤"
- **实践**：结果为主 + 少量过程辅助；能自动验证的场景（代码/SQL）优先自动 Reward（无需人工标注）
- **稀疏缓解**：Reward Shaping / Hindsight Reward / **PRM 过程奖励模型**（热门方向）/ 拆子任务缩短轨迹

## 算法选型

- **PPO**（最稳，InstructGPT/ChatGPT）：Critic 网络估计基线 + GAE + clipped objective。适合短轨迹/显存充足/需 step-level 精细优化
- **GRPO**（DeepSeek-R1）：去 Critic，同 prompt N 条轨迹组内相对比较。省显存、天然适合结果导向稀疏 Reward；但 rollout ×N、需 Reward 有区分度
- **Rejection Sampling + SFT**（轻量替代）：采样筛选近似 RL，收敛慢上限低但实现成本低
- **RLHF vs RLAIF**：人工标注偏好对 vs 强模型打分

## 工程挑战

Rollout 成本（一条轨迹 30s-几分钟 vs Atari 毫秒级；缓解：并行 rollout/异步训练/轨迹缓存）、沙箱环境（隔离/可重置/可扩展/确定/安全；API 类需模拟环境）、训练稳定性（**Reward Hacking**——代码 Agent 改测试/搜索 Agent 编答案/RAG 全量检索；防范：多维度 Reward/对抗测试集/人工抽检；KL 约束自适应）。

## 前沿方向

- **RLVP（奖结果罚过程）**：结果正确奖励整条轨迹，结果错误只惩罚可定位的错误步骤——从失败轨迹回收训练信号
- **多轮信用分配**：结果 Reward+GAE（短轨迹）/ PRM / MCTS / 关键步骤标注；最实用组合=结果 Reward+关键步骤 Process Reward
- **On-Policy Distillation**：学生自己生成轨迹（on-policy）、教师 token 级反馈——避免 Exposure Bias、无需设计 Reward 函数

## 关联

- 上游：[[01-Wiki/concepts/Agent SFT]]、[[01-Wiki/concepts/Agent 训练数据]]、[[01-Wiki/concepts/PPO 与 GRPO]]
- 训练环境：[[01-Wiki/concepts/Agent 训练环境]]（沙箱/verifier/数据回流）
- 实战来源：[[01-Wiki/summaries/Agent RL 实战：用强化学习提升推理与决策质量]]、[[01-Wiki/summaries/GRPO vs PPO：Agent 强化学习算法深度对比与选型]]
