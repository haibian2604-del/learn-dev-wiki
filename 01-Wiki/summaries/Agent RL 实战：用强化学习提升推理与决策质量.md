---
type: summary
domain: tech
tags: [agent, llm]
created: 2026-08-27
updated: 2026-08-27
sources: ["[[00-Raw/agent-training/Agent RL 实战：用强化学习提升推理与决策质量]]"]
status: mature
---

# Agent RL 实战：用强化学习提升推理与决策质量（learn-agent-training 02）

> Agent 场景下 RL 的 Reward 设计、算法选型与推理性能优化实战经验——SFT 是模仿学习，RL 让模型超越标注数据上限。

## 为什么 SFT 之后还需要 RL（三个结构性问题）

1. **模仿学习上限 = 标注数据质量**：标注轨迹里有冗余/次优决策会原样学过来
2. **Exposure Bias（暴露偏差）**：SFT 训练时上文永远是 ground truth，推理时基于自己上一步输出继续生成——一旦某步偏了后续全变，模型没见过"报错后怎么办"
3. **SFT 只学"怎么做"不学"做得好不好"**：loss 是 token 级交叉熵，不关心任务完成与效率

| | SFT | RL |
|---|---|---|
| 学习信号 | token 级交叉熵 | 任务级 Reward |
| 上限 | 标注数据质量 | 理论无上限（受 Reward 约束） |
| 错误处理 | 只见过正确轨迹 | 试错中学习恢复 |
| 优化目标 | 模仿标准答案 | 最大化累积回报 |

## RL 框架映射

State = 对话历史+工具返回+system prompt；Action = 模型下一步输出（tool_call 或文本）；Env = 工具执行引擎+沙箱；Reward = 任务完成+过程质量；Policy = Agent 模型本身。与游戏 RL 关键区别：动作空间是自然语言/结构化 JSON（维度极高），状态空间是变长文本序列。

## Reward 设计：成败关键

- **结果 Reward（Outcome-based）**：完成+1/失败 0 或 -1。简单；但信号稀疏（10 步只有最后一步有反馈）
- **过程 Reward（Process-based）**：正确工具+0.1/格式对+0.05/冗余-0.1/死循环-0.5。信号密集训练效率高；但需定义"什么是好的中间步骤"
- **实践**：以结果 Reward 为主，少量过程 Reward 辅助

企业场景示例：代码 Agent（测试通过率 0.6 + 编译运行 0.2 - 修改文件数 0.1 - 步骤数 0.1）；RAG Agent（答案准确 0.4 + 召回 0.3 + 精确 0.2 - 检索次数 0.1，答案准确率用更强模型 judge）；数据分析 Agent（结果正确 0.5 + SQL 语法 0.2 + 无报错 0.2 - 查询效率 0.1）。

**稀疏 Reward 缓解**：Reward Shaping（人工中间小 Reward）/ Hindsight Reward（完成后回头打分）/ **PRM 过程奖励模型**（训练模型评估中间步骤质量，当前热门方向）/ 缩短轨迹（拆子任务单独给 Reward）。

## 算法选型

**PPO（最稳）**：限制策略更新幅度。KL 系数 0.01-0.05（防格式退化）、rollout batch 64-256 条、GAE lambda 0.95-0.99。

**GRPO（DeepSeek-R1，适合长轨迹）**：不训练 Critic，同一 prompt 的 N 条 rollout 组内相对比较。省显存省 Critic 训练；但 rollout 成本 ×N、N 太小噪声大。

**Rejection Sampling + SFT（轻量替代）**：生成 K 条轨迹→Reward 打分→只留 top 轨迹 SFT→迭代。收敛慢上限低，但实现成本低，适合无 RL 基础设施/验证 Reward/RL 前数据增强。

**RLHF vs RLAIF**：人工标注偏好对（高成本高质量，适合医疗金融）vs 强模型打分（低成本中等质量，适合通用快速迭代）。**Agent 场景很多 Reward 可自动验证（代码跑通/SQL 结果对），优先自动 Reward**。

## RL 工程挑战

- **Rollout 成本**：一条轨迹 30 秒-几分钟（模型推理 100-500 token/步 × 5-15 步 + 工具执行延迟），对比 Atari 毫秒级。缓解：并行 rollout（GPU 集群推理+容器化工具执行）、异步训练（rollout 与策略更新解耦）、轨迹缓存（确定性工具调用缓存返回值）
- **沙箱环境**：隔离性/可重置/可扩展/确定性/安全性。代码 Agent 用 Docker 容器+文件系统快照；API 类 Agent 不能真调第三方 API（成本/限流/副作用），需搭模拟环境
- **训练稳定性**：Reward Hacking（代码 Agent 改测试用例让测试通过、搜索 Agent 不检索编答案、RAG Agent 全量检索刷召回）。防范：多维度 Reward、对抗性测试集、人工抽检高 Reward 轨迹。KL 约束（β 自适应：设定 KL 目标值如 0.1，超了增大 β）

## RL 实际收益

减少冗余步骤（代码修复 8-12 步 → 5-7 步）、提升工具调用准确率（选错工具/参数填错）、改善复杂推理链（错误恢复/分支决策/信息利用效率）。

## 前沿方向

- **RLVP（奖结果罚过程）**：结果正确→奖励整条轨迹；结果错误→只惩罚可定位的错误步骤（从失败轨迹回收训练信号，需 verifier 定位错误步骤）
- **多轮信用分配**：结果 Reward + GAE（短轨迹）/ PRM（有标注）/ MCTS（预算充足）/ 关键步骤标注（可识别决策分叉点）。最实用组合：结果 Reward + 关键步骤 Process Reward
- **On-Policy Distillation**：学生自己生成轨迹（on-policy），教师对每一步提供 token 级反馈而非直接给示范答案——避免 Exposure Bias、信号密集、不需要设计 Reward 函数；成本约纯 SFT 3-5 倍但训练效率更高

## 关联

- 概念：[[01-Wiki/concepts/Agent 强化学习]]、[[01-Wiki/concepts/PPO 与 GRPO]]、[[01-Wiki/concepts/Agent SFT]]
- 系列：[[01-Wiki/entities/zero2Agent]]（learn-agent-training）
