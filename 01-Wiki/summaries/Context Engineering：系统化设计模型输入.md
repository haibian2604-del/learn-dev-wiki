---
type: summary
domain: tech
tags: [agent, context-engineering]
created: 2026-08-27
updated: 2026-08-27
sources: ["[[00-Raw/context-engineering/Context Engineering：系统化设计模型输入]]"]
status: mature
---

# Context Engineering：系统化设计模型输入（zero2Agent 基础 13）

> 从 Prompt Engineering 到 Context Engineering——面对完整 Agent 系统时，怎样系统化设计模型每一轮看到的 Context。

## 为什么单独谈

2025-2026 行业从 Prompt Engineering 过渡到 Context Engineering，核心观察：**Agent 的能力天花板不是模型参数量，而是模型每一步决策时能看到什么**。同一模型，只给一句"分析风险" vs 给出目标/已完成步骤/待查工具/历史结论/当前约束，表现差距巨大。

| 层次 | 关注什么 | 典型产出 |
|------|---------|---------|
| Prompt Engineering | 单次调用的指令质量 | 模板、结构化指令、Few-shot |
| **Context Engineering** | **整个信息供给链的设计** | Skills 加载策略、状态栏、动态注入、压缩管道 |

Prompt Engineering 是 Context Engineering 的子集。

## Context 的五个组成部分

1. **System Prompt**（系统指令）：身份、规则、约束
2. **Tool Definitions**（工具定义）：能力列表、参数 Schema
3. **Conversation Trajectory**（执行轨迹）：历史消息、工具调用/结果
4. **Dynamic Metadata**（动态元数据）：状态栏、时间、环境信息
5. **Retrieved Content**（检索内容）：RAG 结果、Skills 文档

目标：五部分每轮恰好包含当前决策所需信息——不多（浪费 token 引入噪声）、不少（缺关键信息致错误决策）。

## Prompt Engineering 的五个维度

1. **语气与风格**：大写/加粗标记硬约束（NEVER/MUST）、明确输出格式偏好、声明角色边界。
2. **结构化组织**：XML 标签或 Markdown 分区（`<role>` `<constraints>` `<output_format>`）而非连续长文，模型更易定位遵守、调试易判断哪部分没生效。
3. **流程驱动而非规则堆砌**：给出执行流程 SOP（判断类型→检索/验权→生成）比散列规则更易稳定遵守。
4. **业务规则精炼**：从需求提取核心规则删废话（"退款条件：订单已完成 AND ≤7 天 → 自动退款"），规则越精炼遵守率越高。
5. **Few-shot 示例**：2-3 个精选（一个标准 + 一个边界 + 一个应拒绝）优于 10 个冗余；格式与真实交互一致。

## Agent Skills：按需加载能力（三层架构）

几十上百种能力不可能全塞 System Prompt：
- **第一层 Metadata**（始终在 Context）：每个 Skill 名称+一句话描述，几百 token，让模型知道"有哪些能力"
- **第二层 Core Workflow**（按需加载）：模型决定使用某 Skill 时加载完整执行指令，几千 token
- **第三层 Detailed Docs**（深度按需）：Core Workflow 引用的详细文档，需时经工具读取

对比：全部注入→token 爆炸/指令冲突；全部工具读取→模型不知有能力无法主动选择；**三层架构平衡 token 与能力发现**。Metadata 放稳定前缀（cache-friendly），动态内容放后部。Claude Code 的 Skills 即此架构。

## Agent Status Bar：结构化执行元数据

传统 Agent 只在消息历史保留执行轨迹；Status Bar 用结构化字段显性注入当前状态（`<task_plan>` 勾选进度、`<environment>` 当前时间/会话时长/剩余工具调用/token 预算、`<warnings>`）。

**为什么有效**：模型上下文学习行为更接近"检索"而非"推理"——擅长从已有内容提取遵守，不擅长从散乱历史自行统计推断状态。Status Bar 把分散状态**显性化**，减少模型推断负担。

**风险**：Status Bar 信息会被模型无条件信任——只能从可靠程序状态派生，不能从未验证模型输出生成；更新逻辑必须有明确触发条件与验证；不把未确认猜测写进去。

## 上下文三个设计原则

1. **稳定内容在前，动态内容在后**：System Prompt → Tool Schema → Skills Metadata → 固定约束（前）；历史轨迹 → Status Bar → 检索结果 → 当前用户输入（后）。好处：前缀缓存易命中 + 模型注意力位置偏差倾向开头结尾。
2. **不在 Context 中重复信息**：System Prompt 声明过的约束不必每轮重复；已提取到 State 的原始结果可压缩删除。重复浪费 token 且版本不一致时冲突。
3. **正确性优先于缓存**：约束/权限/环境变了必须更新 Context 即使缓存失效。缓存是优化不是约束。

## 核心思维模式

在有限 token 预算内让模型每步看到当前决策所需**最相关**信息，同时管理：信息供给（何时注入什么）/ 信息压缩（何时删掉什么）/ 信息质量（准确、相关、不矛盾）。

## 与其他工程层次的关系

Prompt（子集）/ Harness（决定送什么给模型）/ Loop（每轮需 CE 组装输入）/ Infra（存储恢复 Context 数据）。Context Engineering 贯穿所有层次——最终都要回到"这一轮模型看到什么"。

## 关联

- 概念：[[01-Wiki/concepts/上下文工程]]、[[01-Wiki/concepts/AI Agent]]、[[01-Wiki/concepts/Agent Skills]]、[[01-Wiki/concepts/Harness Engineering]]
- 摘要：[[01-Wiki/summaries/Context、State 与 Memory]]
- 系列：[[01-Wiki/entities/zero2Agent]]
