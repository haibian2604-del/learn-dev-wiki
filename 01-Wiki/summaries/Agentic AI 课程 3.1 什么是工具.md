---
type: summary
domain: tech
tags: [agent, tool-use]
created: 2026-09-13
updated: 2026-09-13
sources: ["[[00-Raw/agent-basics/3.1 什么是工具]]"]
status: growing
---

# Agentic AI 课程 3.1 什么是工具

> 工具即函数、模型自主决策：模型不再被动用内部知识回答，而是主动判断是否需要、以及该调哪个工具——并且**不是所有问题都该调工具**。

## 核心观点

- **核心思想**：工具 = 函数，调用与否由模型自主决策。就像人借助锤子、扳手能完成徒手做不到的事，LLM 通过调用"函数工具"突破训练数据与能力限制
- 对比：不再是"被动地根据内部知识库生成答案"，而是能主动判断当前情境下是否/该调哪个工具

## 简单工具执行闭环（以"现在几点？"为例）

1. **输入提示**：用户问 "What time is it?"
2. **模型决策**：LLM 意识到自己无法提供实时时间，决定调用 `get_current_time()`
3. **工具执行**：系统执行函数，返回 15:20:45
4. **结果反馈**：时间值作为新的上下文（对话历史）回传 LLM
5. **最终输出**：LLM 结合新信息生成自然语言回复 "It's 3:20pm."

三个关键点：工具是函数（Python 代码，与系统时钟交互）；模型自主选择（何时何地调哪个）；动态上下文（工具结果融入对话历史供后续推理）。

## 何时调用、何时不调用（条件性调用）

- **调用**："现在几点？"——模型知道需要实时数据 → 调 `get_current_time()`
- **不调用**："绿茶含多少咖啡因？"——可直接用内部知识回答："Green tea typically contains 25-50 mg of caffeine per cup."
- 这体现模型的"智能"：能区分哪些信息是**静态的（可内化）**、哪些是**动态的（需外求）**

## 实际应用示例

| 提示 | 工具 | 输出 |
|------|------|------|
| 找加州山景城附近的意大利餐厅 | `web_search(query="restaurants near Mountain View, CA")` | "Spaghetti City 是位于山景城的意大利餐厅…" |
| 给我看看买了白色太阳镜的顾客 | `query_database(table="sales", product="sunglasses", color="white")` | "28 位顾客购买了白色太阳镜…" |
| 存 500 美元年利率 5%，10 年后多少？ | `interest_calc(principal=500, interest_rate=5, years=10)` | "$814.45" |

## 多工具协作（日历助理）

请求："请在周四我的日历中找一个空闲时段，并与 Alice 预约。"工具集：`check_calendar()` / `make_appointment()` / `delete_appointment()`。

执行：调 `check_calendar()` 得 "Thursday 3pm/4pm/6pm" → 模型选择 3pm → 调 `make_appointment(time="3pm", with="Alice")` → 返回 "Meeting created successfully!" → 整合回复用户。

## 核心价值

- **超越知识边界**：获取实时数据、访问数据库、执行计算
- **实现复杂逻辑**：支持多步推理与工具链协作
- **提升应用价值**：让模型从"只会聊天"进化为"能动手做事"

## 亮点与不足

- 亮点：明确点出"条件性调用"——区分静态知识（内化）与动态信息（外求），这是工具设计的核心判据；日历案例展示工具链的顺序决策
- 不足：未讲工具描述/参数 schema 怎么写（3.2-3.3 才补）；未讨论工具选择错误与调用失败的处置

## 与既有知识的联系

- 是 [[01-Wiki/concepts/Tool Calling]] 的基础篇（工具即函数 + 自主决策 + 结果回填上下文）
- 与 [[01-Wiki/summaries/Agentic AI 课程 2.6 使用外部反馈]] 的关系：工具既可"获取信息"也可"检查结果"
- 日历类多工具串联 ↔ [[01-Wiki/concepts/Workflow Graph]] 的编排视角

## 延伸问题

- 模型误判"该不该调工具"时的兜底策略？
- 工具数量增多后如何选（Tool RAG）？（见 index.md 待办）
