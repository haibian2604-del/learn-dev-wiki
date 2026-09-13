---
type: summary
domain: tech
tags: [agent, tool-use, python]
created: 2026-09-13
updated: 2026-09-13
sources: ["[[00-Raw/agent-basics/3.3 工具语法]]"]
status: growing
---

# Agentic AI 课程 3.3 工具调用语法与 aisuite

> 用 aisuite 把"函数 → JSON Schema → 模型请求 → 自动执行 → 回填"整条链路封装成几行代码，`tools=[函数对象]` + `max_turns=5` 就能跑起来。

## 核心观点

- **工具调用的本质**：LLM 不直接调用工具，只"请求"开发者去调用；说"LLM 调用了工具"是简化说法，技术上不准确
- **AI Suite（aisuite）**：由吴恩达及其团队开发的开源库，提供统一语法调用多家 LLM 提供商，核心能力之一是**自动处理工具描述**（→ [[01-Wiki/entities/aisuite]]）

## 基本代码框架

```python
from datetime import datetime
def get_current_time():
    """Returns the current time as a string"""
    return datetime.now().strftime("%H:%M:%S")

import aisuite as ai
client = ai.Client()
response = client.chat.completions.create(
    model="openai:gpt-4o",     # 指定使用的模型
    messages=messages,          # 对话历史或提示信息
    tools=[get_current_time],   # 定义 LLM 可访问的工具列表（直接放函数对象）
    max_turns=5                 # 工具调用最大轮次，防无限循环
)
```

- `tools` 是最核心的部分：只需把希望模型能访问的**函数对象**放进列表
- `max_turns`：设上限防止在工具调用上陷入无限循环；通常 5 即可，除非任务异常复杂
- 语法与 OpenAI 原生 API 相似，但抽象更高，且可轻松切换多家 LLM 提供商

## 自动化的工具描述（自动生成 JSON Schema）

无参函数：

```json
{"type": "function", "function": {
  "name": "get_current_time",
  "description": "Returns the current time as a string",
  "parameters": {}}}
```

自动生成规则：**函数名**← Python 函数名；**description**← 函数 docstring；**parameters**← 无参函数为空对象。

带参函数 `get_current_time(timezone)`：

```json
{"type": "function", "function": {
  "name": "get_current_time",
  "description": "Returns current time for the given time zone",
  "parameters": {"timezone": {
    "type": "string",
    "description": "The IANA time zone string, e.g., 'America/New_York' or 'Pacific/Auckland'."}}}}
```

> 启示：**docstring 的质量直接决定模型能否正确调用**——它是给模型看的工具说明书。

## 七步工作流程

1. 开发者定义函数（带清晰 docstring）
2. aisuite 自动读取函数信息生成标准 JSON Schema
3. LLM 接收包含可用工具描述的 Schema，据上下文决定是否调用
4. LLM 生成含工具名与参数的请求
5. aisuite 客户端自动调用对应函数并传参
6. 结果送回 LLM，可继续思考甚至发起下一次调用；整个过程最多重复 `max_turns` 次
7. 所有轮次结束或 LLM 不再调工具时，生成最终文本响应

## 代码执行工具的特殊性

- **终极灵活性**：代码本身可完成任何计算、数据处理或外部交互
- **开发者赋能**：提供这个工具等于告诉 LLM "你可以让我执行任何你认为必要的代码"，极大扩展能力与场景（→ [[01-Wiki/concepts/代码执行]]）

## 亮点与不足

- 亮点：给出可直接运行的最小代码 + 自动 schema 生成规则（docstring→description），把"工具可以用极其便宜的方式定义"这一点讲清楚了
- 不足：`max_turns` 只说"通常 5"，未讲如何按任务复杂度定；未覆盖并行工具调用、错误返回与参数校验

## 与既有知识的联系

- 是 [[01-Wiki/concepts/Tool Calling]] 的工程实现层；与 [[01-Wiki/summaries/Agentic AI 课程 3.2 创建一个工具]] 的手动方案形成"旧 vs 新"对照
- `tools=[函数]` 的极简写法是"工具即普通函数"的极致体现，对比 [[01-Wiki/concepts/Agent Skills]]（Skill 是更高层的封装）
- 与 [[01-Wiki/concepts/MCP Server 开发]] 的工具元数据设计互补（MCP 是跨进程的标准化版本）

## 延伸问题

- 多提供商下 JSON Schema 兼容性差异（OpenAI strict schema vs 各家）？
- docstring 写不好导致误调用，如何用评估（evals）发现并修？
