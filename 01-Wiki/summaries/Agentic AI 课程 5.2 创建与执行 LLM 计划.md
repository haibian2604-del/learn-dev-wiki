---
type: summary
domain: tech
tags: [agent, planning]
created: 2026-09-13
updated: 2026-09-13
sources: ["[[00-Raw/agent-basics/5.2 创建与执行LLM计划]]"]
status: seedling
---

# Agentic AI 课程 5.2 创建与执行 LLM 计划

> 让 LLM 用 **JSON/XML 结构化格式**输出计划，而不是自然语言——下游代码才能可靠地 parse 与逐步执行。

## 核心观点

- 问题：上一讲让 LLM 直接讲出自己的任务规划，但**自然语言不够清晰明确，难以被下游代码稳定解析与执行**
- 解法：要求 LLM 以**结构化格式（如 JSON 或 XML）**输出计划
- 收益：结构化格式能清楚界定计划的**步骤、所需工具及其参数**，允许下游代码更可靠地解析（parse）每一步，从而系统性地一步步执行

## 实现方式

开发者这样写指示词："你可以访问以下工具，并需要以 JSON 格式创建一个分步计划"，同时详细描述所需的 JSON 结构。

LLM 返回一个 JSON 列表，列表中每个对象代表一个步骤，含清晰的键值：

- `description`（步骤描述）
- `tool`（要调用的工具名称）
- `arguments`（传给工具的参数）

这样只要接收 LLM 的字符串输出 → 转为 JSON → 提取参数 → 执行对应函数即可，**解析器编写非常方便**。

## 亮点与不足

- 亮点：一句话点明"结构化输出是可执行计划的前提"，并给出最小 schema（description/tool/arguments）与解析路径
- 不足：篇幅极短（全章仅一段+一图），未给完整的 JSON 示例、字段类型约束、校验失败时的处理；对 JSON vs XML 的选择无说明

## 与既有知识的联系

- 是 [[01-Wiki/concepts/规划模式]] 的实现细节；下一讲 [[01-Wiki/summaries/Agentic AI 课程 5.3 结合代码执行的规划]] 提出"直接用代码代替 JSON"，与本页形成递进
- 与 [[01-Wiki/summaries/大模型 API 输入输出与 Tool Calling]] 的结构化输出/参数校验思路一致
- "解析后逐步执行"↔ [[01-Wiki/concepts/Workflow Graph]] 的计划即图的视角

## 延伸问题

- 结构化输出的 schema 约束（JSON Schema / constrained decoding）如何强制？
- 计划解析失败（模型输出跑偏）时的降级策略？
