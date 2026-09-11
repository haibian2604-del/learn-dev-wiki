---
type: concept
domain: tech
tags: [agent, llm]
created: 2026-08-01
updated: 2026-09-04
sources: ["[[01-Wiki/summaries/2026 年 AI Agent 技术全景]]", "[[01-Wiki/summaries/什么是 Agent]]", "[[01-Wiki/summaries/Workflow 和 Agent 的区别]]", "[[01-Wiki/summaries/一个 Agent 系统的核心组成]]", "[[01-Wiki/summaries/为什么很多 Agent Demo 一落地就不稳定]]", "[[01-Wiki/summaries/大模型 API 输入输出与 Tool Calling]]", "[[01-Wiki/summaries/单 Agent 和多 Agent 的边界]]", "[[01-Wiki/summaries/多模态与实时交互 Agent]]", "[[01-Wiki/summaries/架构师AI杜 Day35 Agent基础概念]]"]
status: mature
---

# AI Agent（智能体）

## 定义

能够感知环境、处理信息并主动采取行动以实现特定目标的软件系统。Google 定义：**AI Agent = 先进 AI 模型 + 工具访问权限 + 人类控制**。

与传统 AI 的本质区别：

| 维度 | 传统 AI | AI Agent |
|------|---------|----------|
| 互动方式 | 被动响应 | 主动规划与执行 |
| 决策能力 | 单轮推理 | 多步规划 + 工具调用 |
| 记忆能力 | 无状态 | 长期记忆 + 上下文管理 |
| 自主性 | 人类全程控制 | 人类监督下的自主执行 |

## 机制/原理：6 大核心模块

形成"感知 → 决策 → 行动 → 记忆"完整闭环：

1. **感知层**：多模态输入（文本/图像/语音/传感器）
2. **核心 LLM**：语义理解与目标编码，"大脑"
3. **推理与规划**：任务分解、路径规划、优先级排序（→ [[01-Wiki/concepts/ReAct]]）
4. **记忆体系**：短期记忆（上下文窗口）+ 长期记忆（向量数据库，→ [[01-Wiki/concepts/向量数据库]]）
5. **技能与工具**：函数调用、API 集成、代码执行（→ [[01-Wiki/concepts/MCP]]、[[01-Wiki/concepts/Agent Skills]]）
6. **执行与反馈**：行动执行、结果验证、自我修正、人类反馈

## 3 大核心协议

| 协议 | 作用 | 类比 |
|------|------|------|
| MCP | 统一 LLM 与外部工具的通信 | AI 领域的 USB-C |
| A2A | 多 Agent 之间的通信与协作 | Agent 界的 HTTP |
| Skills | 延迟加载的 sub-agent 体系 | 插件系统 2.0 |

## 例子

- 企业级多 Agent：AutoGen（微软，Agent 对话协作，→ [[01-Wiki/entities/AutoGen]]）
- 图基工作流：LangGraph（节点=Agent，边=数据/控制流，→ [[01-Wiki/entities/LangGraph]]）
- 团队模拟：MetaGPT（PM/架构师/工程师/QA 多角色协作）

## 边界与常见误区

- **不是聊天机器人**：聊天是被动响应，Agent 需主动规划、调用工具、循环执行
- **误区分 1 盲目追新框架**：选生态成熟、文档完善的（LangChain 仍首选）
- **误区 2 忽视记忆设计**：早期规划记忆的存储/检索/更新机制
- **误区 3 过度依赖模型**：Agent = Model + Harness，天花板由 Harness 决定（→ [[01-Wiki/concepts/Harness Engineering]]）
- **误区 4 不考虑安全**：Prompt Injection 需输入验证/沙箱执行/输出过滤三层防护 + 人类监督 + Guardrails

## 工程视角补充（zero2Agent 基础教程）

> 以下来自 onefly.top/zero2Agent 基础系列，侧重“先把系统拆成模块、再选框架”的工程化理解，与上方的行业全景互为补充。

### 最小工程定义

> **Agent = LLM + Context + Tools**

Agent 是“围绕目标持续推进任务的系统”，而非“更会聊天的模型”。判断一个系统是不是 Agent，不看它用没用框架、会不会调工具，而看三件事：是否围绕目标持续推进、是否根据中间状态改变行为、是否是闭环而非一次性生成。缺少明确状态/执行闭环/结束条件的“带工具调用的 LLM”不算完整 Agent。

### 7 个核心模块（系统拆解视角）

1. **Goal**：要解决什么、输出长什么样、何时算完成（目标不清是很多 Agent 问题的根因）。
2. **State**：当前任务状态（输入/已完成步骤/已获信息/中间结论/待办/结束条件），最易被忽略却最关键。
3. **Model**：理解/推理/生成/决定下一步；模型只是 Agent 中的一个组件。
4. **Context**：模型每步“能看到什么”。**Agent 能力天花板往往不是模型参数量，而是 Context 的组织质量**（→ [[01-Wiki/concepts/上下文工程]]）。
5. **Tools**：外部能力，分三类——感知类（搜索/查询/读，可放心重试）、执行类（写/发/建/执行代码，需幂等与审批）、协作类（与其他 Agent/人类交互，需协议与超时）。
6. **Memory**：会话内（当前任务延续）/ 跨会话（长期偏好、历史、画像）。
7. **Planner / Policy + Evaluator / Guardrails**：决定下一步并限制乱跑，缺之则“一本正经地出错”或耗爆成本。

典型流程：`Goal → State 初始化 → Planner 判断 → Model 生成动作 → Tools 执行 → State 更新 → Evaluator/Guardrails 检查 → 继续或结束`。

### Workflow vs Agent 的真正分界线

三类系统：普通 LLM App（一次输入一次输出）、Workflow（路径由开发者预先写死）、Agent（系统据状态动态决定下一步）。**分界线不在用没用模型/调没调工具，而在“下一步由开发者写死还是系统运行时决定”**。很多场景其实不需要 Agent（Workflow 更便宜稳定可控），真实工程常是“外层 Workflow + 内层 Agent”组合。详参 [[01-Wiki/summaries/Workflow 和 Agent 的区别]]、[[01-Wiki/concepts/Workflow Graph]]。

### Demo → 生产的六大断层

Demo 关注“能不能动”，生产关注“会不会坏”。断层：目标模糊、状态无设计、工具调用过度乐观（API 超时/格式变/权限失败）、把“会思考”误当“会执行”、无结束条件与预算控制、无可观测性。推进顺序应是：缩窄目标 → 明确状态 → 工具异常处理 → 结束条件与预算 → 日志/追踪/人工接管。详参 [[01-Wiki/summaries/为什么很多 Agent Demo 一落地就不稳定]]、[[01-Wiki/concepts/Loop Engineering]]。

## 进阶章节导航（zero2Agent 06-17）

- 记忆体系：[[01-Wiki/summaries/Context、State 与 Memory]]（Context/State/Memory/RAG 四概念区分、四种记忆模式、上下文压缩）、[[01-Wiki/summaries/高级 RAG 与记忆架构]]（Contextual Retrieval/GraphRAG/RAPTOR/双层记忆、隐私与遗忘）
- 规划与反思：[[01-Wiki/summaries/Planning、Reflection、RAG 分别解决什么问题]]（三概念职责区分，避免"缺信息误判为多思考"）
- 架构选型：[[01-Wiki/summaries/单 Agent 和多 Agent 的边界]]（单 Agent 优先、三协作模式、选择性共享上下文）、[[01-Wiki/summaries/异步 Agent 与事件驱动架构]]（取消-重提交/队列/并发三模式、事件驱动、Safety Sidecar、三层隔离）
- 工程化：[[01-Wiki/summaries/Agent Infra：从 Harness 到生产环境]]（六层 Infra）、[[01-Wiki/summaries/Loop Engineering：让 Agent 自主迭代直到正确]]（四 Loop 模式与退出设计）、[[01-Wiki/summaries/Agent 评估：怎么知道你的 Agent 好不好]]（四维度评估）
- 形态与实践：[[01-Wiki/summaries/Coding Agent：最成功的 Agent 落地形态]]（Verification Loop 最佳实践）、[[01-Wiki/summaries/Context Engineering：系统化设计模型输入]]（Skills 三层、Status Bar）、[[01-Wiki/summaries/多模态与实时交互 Agent]]（Voice 三范式、GUI Agent、快慢解耦）、[[01-Wiki/summaries/Agent 自进化：不改权重也能持续变强]]（经验学习/工具创造/策略自优化）

## 经典理论视角（架构师AI杜 Day35）

> 来自 [[01-Wiki/summaries/架构师AI杜 Day35 Agent基础概念]]。与上方的工程定义互补：**LLM Agent 是经典 Agent 的一种具体实现**。

### 技术中立的定义

> **Agent = <Perception, Reasoning, Action, Learning>**

五个核心特征：自主性、感知性、反应性、主动性、社会性。这个定义**不预设实现技术**（不要求用 LLM），强调的是功能闭环，适合作为检验"某产品是不是真 Agent"的中立标尺。

### 三轴分类体系

给任何一个 Agent 系统定位，问三个问题：

| 轴 | 选项 | 判据 |
|----|------|------|
| 能力 | Reactive（反应式）/ Cognitive（认知式） | 是否维护内部状态、是否会规划 |
| 数量 | Single / Multi | 任务是否由单个实体完成；Multi 需 Coordinator 做分解-分派-合并 |
| 目标 | Goal-Oriented / Utility-Based | 是否有明确终止条件，还是持续权衡期望效用 |

> 典型 LLM Coding Agent（→ [[01-Wiki/concepts/Coding Agent]]）的定位是 **Cognitive + Single（或轻量 Multi）+ Goal-Oriented**。
>
> 值得注意：**工程上绝大多数 LLM Agent 是伪装的 Goal-Oriented**——它们缺少真正的效用评估环节，只是"达成即停"。

### 与传统 AI 系统的分界

| 维度 | 传统 AI | AI Agent |
|------|---------|----------|
| 决策方式 | 规则 / 模型驱动 | 自主推理 |
| 目标导向 | 否 | 是 |
| 交互能力 | 被动 | 主动 |
| 适应性 | 低 | 高 |

这个分界与 [[01-Wiki/summaries/Workflow 和 Agent 的区别]] 的结论一致：**关键不在用没用模型，而在"下一步由谁决定"**。

### 与工程定义的映射

| 经典四元组 | LLM 实现 |
|-----------|---------|
| Perception | 上下文与工具返回结果 |
| Reasoning | 模型推理与规划（→ [[01-Wiki/concepts/ReAct]]） |
| Action | 工具调用（→ [[01-Wiki/concepts/Tool Calling]]、[[01-Wiki/concepts/MCP]]） |
| Learning | 记忆更新与自进化（→ [[01-Wiki/concepts/Agent 自进化]]） |

## 相关概念

- [[01-Wiki/concepts/ReAct]]、[[01-Wiki/concepts/Harness Engineering]]、[[01-Wiki/concepts/Workflow Graph]]、[[01-Wiki/concepts/MCP]]、[[01-Wiki/concepts/Agent Skills]]、[[01-Wiki/concepts/上下文工程]]、[[01-Wiki/concepts/Loop Engineering]]
- 相关实体：[[01-Wiki/entities/LangChain]]、[[01-Wiki/entities/AutoGen]]、[[01-Wiki/entities/AutoGPT]]、[[01-Wiki/entities/LangGraph]]、[[01-Wiki/entities/LlamaIndex]]、[[01-Wiki/entities/CrewAI]]、[[01-Wiki/entities/hello-agents]]
