---
type: summary
domain: tech
tags: [agent]
created: 2026-09-04
updated: 2026-09-04
sources: ["[[00-Raw/agent-basics/架构师AI杜 Day35 Agent基础概念]]"]
status: growing
---

# 架构师AI杜 Day35 Agent基础概念

> 回归经典 AI 教科书视角定义 Agent：五特征、形式化四元组、三轴分类体系（能力/数量/目标）、四大核心组件与发展简史——与 LLM 时代的工程定义互为补充。

来源：[[01-Wiki/entities/架构师AI杜]] 系列教程 Day35（weekr.net/ai/day-35）

## 核心观点

- **定义**：AI Agent 是能够自主感知环境、进行推理决策、执行行动并实现目标的智能系统。
- **五个核心特征**：自主性（自主决策行动）、感知性（理解环境信息）、反应性（及时响应变化）、主动性（主动追求目标）、社会性（与其他 Agent 或人类交互）。前四条是经典定义，第五条"社会性"在多 Agent 时代被重新重视。
- **形式化四元组**：`Agent = <Perception, Reasoning, Action, Learning>`。相比 LLM 时代流行的 `Agent = LLM + Context + Tools`，这个定义**不预设实现技术**，强调的是功能闭环。
- **与传统 AI 系统的六维差异**：自主性（低→高）、感知能力（有限→强）、决策方式（规则/模型驱动→自主推理）、适应性（低→高）、目标导向（否→是）、交互能力（被动→主动）。核心分界是**是否目标导向 + 是否自主决策**。
- **按能力二分**：
    | | Reactive Agent（反应式） | Cognitive Agent（认知式） |
    |---|---|---|
    | 内部状态 | 不维护 | 维护 |
    | 推理 | 无复杂推理，条件-动作映射 | 复杂推理，支持规划与学习 |
    | 速度 | 快 | 慢 |
    | 场景 | 简单任务、实时响应、资源受限 | 复杂任务、长期规划、需学习 |
- **按数量二分**：Single Agent（独立、控制简单）vs Multi-Agent（协作、需协调机制、可并行）。多 Agent 的关键是 Coordinator 的**任务分解 → 分派 → 结果合并**三步（→ [[01-Wiki/concepts/单 Agent 与多 Agent]]）。
- **按目标二分**：Goal-Oriented（有明确目标，规划最优路径并达成即停）vs Utility-Based（用效用函数给候选动作打分，取期望效用最大者，天然处理不确定性）。**工程上，绝大多数 LLM Agent 是伪装的 Goal-Oriented，缺少真正的效用评估环节。**
- **四大核心组件**：感知模块（传感器读取 → 过滤去噪）、推理模块（构建上下文 → 生成候选 → 评估排序）、行动模块（选择执行器 → 执行 → 成功/失败处理）、学习模块（积累经验 → 更新模型 → 预测）。
- **发展三阶段**：早期（1950s-1980s，规则系统，Shakey 机器人、专家系统）→ 中期（1990s-2010s，强化学习兴起，Deep Blue、多 Agent 系统研究）→ 现代（2010s-至今，深度学习 + LLM 驱动）。

## 关键数据

| 指标 | 数值 | 出处 |
|------|------|------|
| 核心特征 | 5 个（自主/感知/反应/主动/社会） | §Agent的定义 |
| 形式化定义 | 4 元组 `<Perception, Reasoning, Action, Learning>` | §Agent的定义 |
| 分类维度 | 3 轴（能力 / 数量 / 目标） | §Agent的分类 |
| 核心组件 | 4 个（感知/推理/行动/学习） | §Agent的核心组件 |
| 应用场景 | 4 类（个人助理/智能客服/自动化任务/研究助手） | §应用场景 |
| 发展阶段 | 3 段（1950s-1980s / 1990s-2010s / 2010s-至今） | §发展历史 |

## 亮点与不足

**亮点**
- **三轴分类体系是本文最大价值**：能力（反应式/认知式）× 数量（单/多）× 目标（目标导向/效用导向），可以给任何一个 Agent 系统精确定位，比" autonomous 程度"这种单维划分有用得多。
- 每个抽象类型都配了可直接读的 Python 骨架（`ReactiveAgent` 的规则字典、`CognitiveAgent` 的 memory/goals/planner、`UtilityBasedAgent` 的效用打分），概念不悬空。
- `Agent = <Perception, Reasoning, Action, Learning>` 四元组提供了一个**技术中立**的对照框架，可以用来检验某个"Agent"产品是否真的闭环。
- 感知模块的 `sensor.read → process → filter` 与推理模块的 `build_context → generate_options → evaluate_options`，抽象层次清晰可迁移。

**不足**
- 代码示例是**示意性伪代码**，`Planner`、`Coordinator`、`KnowledgeBase` 等未定义，不能直接运行。
- 分类体系沿用经典 AI 教材，未覆盖 LLM 时代的新形态：ReAct 循环（→ [[01-Wiki/concepts/ReAct]]）、工具调用驱动、工作流编排（→ [[01-Wiki/concepts/Workflow Graph]]）。
- 完全未提 LLM——在 2026 年的语境下，缺少"经典 Agent 理论如何映射到 LLM 实现"的桥梁。
- 效用导向 Agent 未讨论效用函数从何而来（这正是 RL 与 [[01-Wiki/concepts/Agent 强化学习]] 要解决的问题）。
- 学习模块的 `train_model(experience)` 是占位描述，没谈在线学习、记忆架构与灾难性遗忘。

## 与既有知识的联系

- **互补** [[01-Wiki/concepts/AI Agent]]：该页的工程定义是 `Agent = LLM + Context + Tools`（来自 [[01-Wiki/entities/zero2Agent]] 系列），本文的 `<Perception, Reasoning, Action, Learning>` 是不预设实现的功能定义。两者关系：**LLM Agent 是经典 Agent 的一种具体实现**，感知≈上下文与工具结果、推理≈模型决策、行动≈工具调用、学习≈记忆与自进化（→ [[01-Wiki/concepts/Agent 自进化]]）。
- **支撑** [[01-Wiki/concepts/单 Agent 与多 Agent]]：本文的 Coordinator 三步（分解/分派/合并）为该页提供了最简结构模型。
- **参照** [[01-Wiki/summaries/Workflow 和 Agent 的区别]]：本文"传统 AI 系统 vs Agent"的六维对比，与该文"Workflow / LLM App / Agent"的三类边界可以交叉验证——**分界线都在"下一步由谁决定"**。
- **对照** [[01-Wiki/summaries/一个 Agent 系统的核心组成]]：zero2Agent 给出 7 模块工程拆解（Goal/State/Model/Context/Tools/Memory/Planner+Guardrails），本文给出 4 组件理论抽象，二者是**同一系统的两种切法**。
- **呼应** [[01-Wiki/concepts/ReAct]]：ReAct 可视为"反应式外壳 + 认知式内核"的混合体——每步快速响应，整体靠推理链推进。

## 延伸问题

- 经典四元组与 LLM 五要素（LLM/Context/Tools/Memory/Planner）能否建立严格映射？"Learning"在 LLM Agent 中对应记忆更新还是权重更新？（→ [[01-Wiki/concepts/Agent 自进化]]）
- 效用导向 Agent 在 LLM 场景下如何落地——让模型给候选动作打分（LLM-as-Judge）是否算真正的效用函数？（→ [[01-Wiki/concepts/Agent 评估]]）
- 反应式 vs 认知式的划分，在"延迟敏感 + 需推理"的场景（实时语音助手）下如何取舍？（→ [[01-Wiki/concepts/多模态与实时交互 Agent]]）
- 多 Agent 的 Coordinator 是单点瓶颈与单点故障，去中心化协商（合约网、拍卖机制）在什么规模下更优？

## 速查：三轴定位法

给一个 Agent 系统定位，问三个问题：

1. **能力轴**：它维护内部状态吗？会规划吗？→ 否 = Reactive，是 = Cognitive
2. **数量轴**：任务由单个实体完成吗？→ 是 = Single，否 = Multi（需 Coordinator）
3. **目标轴**：有明确终止条件，还是会持续权衡收益？→ 前者 = Goal-Oriented，后者 = Utility-Based

> 典型 LLM Coding Agent（→ [[01-Wiki/concepts/Coding Agent]]）的定位：**Cognitive + Single（或轻量 Multi）+ Goal-Oriented**。
