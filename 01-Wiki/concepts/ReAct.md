---
type: concept
domain: tech
tags: [agent, react, llm]
created: 2026-07-31
updated: 2026-07-31
sources: ["[[01-Wiki/summaries/第四章 智能体经典范式构建]]"]
status: growing
---

# ReAct（Reasoning and Acting）

> 将"思考"与"行动"显式结合的智能体范式（Shunyu Yao，2022）：Thought-Action-Observation 循环，边想边做、动态调整。

## 定义

模仿人类解决问题的"思考-行动-观察"循环：

- **Thought（思考）**：内心独白——分析情况、拆解任务、规划下一步、反思上一步
- **Action（行动）**：决定的具体动作，通常调用外部工具（`Search[查询词]`）
- **Observation（观察）**：工具执行返回的结果

循环重复直到 Thought 认为已找到答案，输出 `Finish[最终答案]`。

形式化：策略 π 根据问题 q 与历史轨迹 (a₁,o₁)...(aₜ₋₁,oₜ₋₁) 生成思考 thₜ 与行动 aₜ；工具 T 执行后返回观察 oₜ，追加到历史。

## 机制/原理

**协同效应**：推理使行动更具目的性，行动为推理提供事实依据。与两类前身对比：
- 纯思考型（Chain-of-Thought）：复杂推理但无法交互外部世界，易幻觉
- 纯行动型：直接输出动作但缺乏规划与纠错

实现要素：提示词模板（角色+工具清单+格式规约+动态上下文）、输出解析（正则提取 Thought/Action）、工具执行器（注册/调度）、历史整合（Action+Observation 追加回上下文）、max_steps 安全阀。

## 与其他范式对比

| 范式 | 策略 | 类比 | 适用 |
|------|------|------|------|
| ReAct | 走一步看一步，动态调整 | 侦探 | 需外部知识/精确计算/API 交互 |
| Plan-and-Solve | 先规划后严格执行 | 建筑师 | 结构性强、可清晰分解的任务 |
| Reflection | 自我批判修正 | 复盘者 | 需要多轮优化输出 |

## 优点与局限

优点：高可解释性（Thought 链透明可调试）、动态纠错、工具协同。
局限：强依赖 LLM 能力；串行多次调用效率低；提示词脆弱（格式要求严）；步进决策可能陷入局部最优/原地打转。

## 调试技巧

打印完整提示词 → 分析 LLM 原始输出 → 验证工具输入输出格式 → 加 few-shot 示例 → 换更强模型/temperature=0。

## 相关概念

- [[01-Wiki/concepts/MCP]]（工具接入层）、[[01-Wiki/concepts/Agent Skills]]（知识层）
- [[01-Wiki/entities/LangChain]]（create_tool_calling_agent 框架化实现）
- [[01-Wiki/concepts/上下文工程]]（ReAct 循环中历史管理属于上下文工程范畴）
