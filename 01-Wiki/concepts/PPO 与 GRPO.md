---
type: concept
domain: tech
tags: [agent, llm]
created: 2026-08-27
updated: 2026-08-27
sources: ["[[01-Wiki/summaries/GRPO vs PPO：Agent 强化学习算法深度对比与选型]]"]
status: growing
---

# PPO 与 GRPO（Agent 强化学习算法）

## 核心分歧：怎么估计"平均水平"

优势（Advantage）`A(s,a) = Q(s,a) - V(s)` 衡量动作相对基线的好坏。**PPO 用 Critic 网络（Value 网络）估计基线，GRPO 用同一 prompt 的 N 条轨迹组内相对比较替代基线**。

## PPO：Critic 估计基线

训练额外 Value 网络预测"当前状态未来能拿多少 Reward"，GAE 计算优势，clipped objective（ε=0.1-0.2）限制更新幅度。

**Agent 场景问题**：Critic 显存开销近乎翻倍（7B 模型 ~84GB vs ~56GB）；Critic 难训（变长文本状态/稀疏 Reward/路径方差大 → 估计不准 → 不稳定）；clip 机制可能太保守。

## GRPO：组内相对排序

同一 prompt 生成 N 条轨迹 → 组内归一化 `advantage_i = (r_i - mean)/std` → clipped objective + KL 约束。

**关键决策**：N=8 是 sweet spot（N=4 噪声大/N=16 精细/N=32+ 边际递减）；归一化粒度 per-prompt（原版）/per-batch/混合；**全成功或全失败 edge case**（std=0 除零 → 加下界 1e-4 + 任务难度均衡 + 监控有效 prompt 比例）。

**优势**：省显存（无 Critic 优化器+激活值）、无 Critic 估计不准问题、天然适合结果导向稀疏 Reward（轨迹级比较，PPO 需 GAE 传播误差累积）。

**劣势**：rollout ×N（时间/工具成本翻倍）、对 Reward 区分度要求高（同组差异小信号弱）、不擅长 step-level 信用分配（整条轨迹统一优势，前面对后面错被连带惩罚）。

## 选型指南

| 约束 | 选 GRPO | 选 PPO |
|---|---|---|
| Reward | 可自动计算且区分度高（代码/SQL 二值） | 区分度低（0.7-0.9 间） |
| 显存 | 紧张（13B+/8K+ 长轨迹） | 充足 |
| 轨迹 | 结果导向粗粒度 | 长轨迹（15+ 步）需 step-level 精细优化 |
| 基建 | RL 基础设施不成熟 | 已有成熟 PPO 经验 |
| rollout 成本 | 可接受 ×N | 极高（付费 API）不可多跑 |

**混合方案（越来越常见）**：阶段 1 GRPO 快速拉升基线（自动 Reward、无 Critic 快速迭代）→ 阶段 2 PPO 精细优化（过程 Reward、GRPO checkpoint 初始化 Critic）。先粗调再精调。

## 实战铁律

1. GRPO 的 N 条轨迹要真正独立采样（temperature=0.7-1.0, top_p=0.95，太低轨迹雷同 advantage 全是噪声）
2. PPO 的 Critic 不能太旧（Policy 和 Critic 同步更新）
3. **KL 约束不能省**（无 KL 崩溃：格式退化/重复循环/能力崩塌）
4. 监控 Reward 分布而非只均值（直方图双峰=部分 hack + 高 Reward 人工抽检）

## 关联

- 上游：[[01-Wiki/concepts/Agent 强化学习]]、[[01-Wiki/concepts/Agent SFT]]
- 实战来源：[[01-Wiki/summaries/GRPO vs PPO：Agent 强化学习算法深度对比与选型]]
- 代表工作：PPO—InstructGPT/ChatGPT；GRPO—DeepSeek-R1/Kimi-K1.5
