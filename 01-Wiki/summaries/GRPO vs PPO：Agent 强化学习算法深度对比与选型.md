---
type: summary
domain: tech
tags: [agent, llm]
created: 2026-08-27
updated: 2026-08-27
sources: ["[[00-Raw/agent-training/GRPO vs PPO：Agent 强化学习算法深度对比与选型]]"]
status: mature
---

# GRPO vs PPO：Agent 强化学习算法深度对比与选型（learn-agent-training 03）

> 从原理到实现到企业选型，全面对比 PPO 与 GRPO 在 Agent 训练中的差异——回答工程问题：你的训练场景该选哪个，为什么？

## 前置：为什么需要优势估计

PPO 和 GRPO 核心目标相同：让好动作概率增大、差动作减小。但 Reward 绝对值无意义，有意义的是**相对基线的优势**：`A(s,a) = Q(s,a) - V(s)`。>0 增加概率、<0 降低、=0 不动。**两算法核心分歧：怎么估计"平均水平"（基线）**。

## PPO：用 Critic 网络估计基线

训练额外 Value 网络（Critic）预测"当前状态未来能拿多少 Reward"，GAE 计算优势，clipped objective 限制更新幅度（ε=0.1-0.2）。

**Agent 场景的具体问题**：
1. **Critic 显存开销近乎翻倍**：7B 模型 PPO ~84GB vs 无 Critic ~56GB（Policy+两套优化器+Critic）；Agent 轨迹长 KV Cache 已占显存
2. **Critic 难训**：状态空间变长文本、稀疏 Reward 中间 Value 全靠估计、执行路径方差大 → Critic 不准 → Advantage 偏 → 不稳定
3. **Clip 机制两面性**：稳定但可能太保守，模型需要大策略调整从错误工具习惯转向正确方式时被拖慢

## GRPO：用组内相对排序替代 Critic

不训练 Critic，同一 prompt 生成 N 条轨迹，组内归一化得相对优势：`advantage_i = (r_i - mean) / std`，clipped objective + KL 约束更新。

**关键设计决策**：
- **N 取多少**：N=4 噪声大/8（sweet spot，大多数场景默认）/16 精细排序/32+ 边际递减不推荐
- **归一化粒度**：Per-prompt（原版，消除难度差异但 N 小 std 不稳）/ Per-batch（统计量稳但信号稀释）/ 混合（per-prompt mean + batch std 兜底）
- **全成功或全失败 edge case**：std=0 归一化除零 → advantage 全 0 无贡献。解决：std 加下界 1e-4、任务采样难度均衡（30%-70% 成功率）、监控"有效 prompt 比例"（>50% 结果一致需调难度分布）

**优势**：省显存（7B 模型 ~56GB vs PPO ~84GB，省 Critic 优化器+激活值）、无 Critic 估计不准问题（优势来自实际 Reward 比较）、**天然适合结果导向稀疏 Reward**（轨迹级比较，PPO 需 GAE 传播终末 Reward 误差累积）。

**劣势**：rollout 成本 ×N（N=8 时时间/工具调用成本 ×8）、**对 Reward 区分度要求高**（同组轨迹差异小则信号弱）、**不擅长 step-level 信用分配**（整条轨迹统一优势，前 4 步对第 5 步错被错误惩罚；PPO 通过 GAE 可逐 step 分配）。

## 全面对比

| 维度 | PPO | GRPO |
|---|---|---|
| Critic | 需要，额外显存+训练 | 不需要 |
| 显存 | 高（双网络双优化器） | 中（Policy+Reference） |
| rollout/每 prompt | 1 条 | N 条（通常 8） |
| 优势估计 | Value 网络+GAE | 组内归一化 |
| 信用分配 | step-level | trajectory-level |
| Reward 稀疏容忍 | 较差 | 较好 |
| Reward 区分度要求 | 低 | 高 |
| 代表工作 | InstructGPT, ChatGPT | DeepSeek-R1, Kimi-K1.5 |

## 企业选型指南

**选 GRPO**：Reward 可自动计算且区分度高（代码/SQL 二值 Reward 天然有区分度）、GPU 显存紧张（13B+ 大模型/8K+ 长轨迹）、RL 基础设施不成熟（实现简单无 Critic 超参）、任务难度可控。

**选 PPO**：需 step-level 精细优化（15+ 步长轨迹、有过程 Reward）、rollout 成本极高（付费 API/长时间计算，多跑 8 条不可接受）、Reward 区分度低（0.7-0.9 间差异小）、已有成熟 PPO 基础设施。

**混合方案（越来越常见）**：阶段 1 GRPO 快速拉升基线（自动 Reward，无 Critic 快速迭代，把 Agent 从"能跑"提升到"大部分跑得通"）→ 阶段 2 PPO 精细优化（过程 Reward+细粒度评估，用 GRPO checkpoint 初始化 Critic，优化边界场景/减冗余/提鲁棒）。先粗调再精调。

## 实战踩坑

1. **GRPO 的 N 条轨迹要真正独立采样**：temperature=0.1/top_p 太小 → 轨迹几乎相同 → advantage 全是噪声。正确：temperature=0.7-1.0, top_p=0.95；太高轨迹质量差
2. **PPO 的 Critic 不能用太旧 checkpoint**：Policy 更新多步但 Critic 旧参数 → Value 严重偏离。Policy 和 Critic 同步更新
3. **KL 约束不能省**：无 KL 的崩溃模式——格式退化（不再输出合法 JSON tool call）、重复循环（多调工具碰运气）、能力崩塌（Agent 能力上去通用对话崩）
4. **监控 Reward 分布而非只均值**：均值+方差、分布直方图（双峰=部分 hack）、高 Reward 轨迹人工抽检、KL 散度、有效 prompt 比例（GRPO）、Critic loss（PPO）

## 关联

- 概念：[[01-Wiki/concepts/PPO 与 GRPO]]、[[01-Wiki/concepts/Agent 强化学习]]、[[01-Wiki/concepts/Agent 训练数据]]
- 系列：[[01-Wiki/entities/zero2Agent]]（learn-agent-training）
