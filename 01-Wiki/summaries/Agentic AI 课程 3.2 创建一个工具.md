---
type: summary
domain: tech
tags: [agent, tool-use]
created: 2026-09-13
updated: 2026-09-13
sources: ["[[00-Raw/agent-basics/3.2 创建一个工具]]"]
status: growing
---

# Agentic AI 课程 3.2 创建一个工具

> LLM 不直接执行代码，它只是**"请求"调用**；开发者扮演"翻译官+执行者"，把模型的文本生成能力接到现实的函数执行上。

## 核心观点

- LLM 本身不会直接执行代码或调用函数，它被训练的核心能力是**生成文本**
- 关键机制：**模型不直接调用，而是"请求"调用**——工具其实就是一些代码/函数
- 时代差异：
  - **早期方法（手动提示工程）**：LLM 未被训练来使用工具，开发者必须在系统提示词里"告诉"模型如何请求调用，例如要求它输出特定格式 `FUNCTION: get_current_time()`
  - **现代方法**：主流 LLM 已原生训练过工具使用，开发者只需提供工具描述与可用性，模型自行决定何时调用

## 实现流程（五步）

1. 开发者编写工具函数（如 `get_current_time()`）
2. 开发者编写系统提示词，告诉模型"想用某工具时该怎么格式化输出"
3. 模型输出特定格式文本——这不是最终答案，而是**一个"请求"**
4. 开发者编写解析代码，识别请求并真正调用对应函数
5. 把函数结果作为新上下文回传给模型，让它生成最终自然语言回复

> 类比：你不能直接命令一个只会说话的人去买咖啡，但可以告诉他"如果你想去买咖啡，就说'我要买一杯美式'"，你听到后自己去买。

## 完整交互四步（以 get_current_time 为例）

**步骤一 · 提供工具和系统提示**

```
You have access to a tool called get_current_time. To use it, return the following exactly:
FUNCTION: get_current_time()
```

**步骤二 · 用户提问与模型响应**：用户问 "What time is it?" → LLM 分析后输出 `FUNCTION: get_current_time()` 而非直接回答

**步骤三 · 开发者代码介入**：解析输出 → 检查是否含 "FUNCTION" 关键字 → 提取函数名与参数 → 实际调用 → 得 `"08:00:00"`

**步骤四 · 反馈结果并生成最终答案**：把结果连同对话历史作为新上下文输入 LLM → LLM 生成 "It's 8am."

## 处理带参数的工具

工具改为 `get_current_time(timezone)`，系统提示相应改为：

```
FUNCTION: get_current_time("timezone")
```

问 "What time is it in New Zealand?" → LLM 输出 `FUNCTION: get_current_time("Pacific/Auckland")` → 开发者解析出参数 `"Pacific/Auckland"` → 调用得 `"04:00:00"` → LLM 回复 "It's 4am in New Zealand."

## 四步循环总结

1. **提供工具**：开发者写好功能函数
2. **告知模型**：通过系统提示词说明有哪些工具、如何"请求"调用
3. **解析并执行**：开发者监听输出、识别请求、实际执行
4. **反馈结果**：把执行结果作为新上下文送回模型继续推理

## 亮点与不足

- 亮点：把"模型请求 / 开发者执行"这一分工讲透，厘清"LLM 调用了工具"这种不准确说法的技术真相；无参与带参数两条路径都有完整代码级示例
- 不足：手动提示工程方案已过时，对现代 **native tool calling / JSON Schema** 的过渡只带一句（3.3 才补）；未讲参数校验与错误返回

## 与既有知识的联系

- 是 [[01-Wiki/concepts/Tool Calling]] 的机制层（"请求-解析-执行-回填"四步循环），[[01-Wiki/summaries/大模型 API 输入输出与 Tool Calling]] 从 API 视角讲了同一件事
- 现代方法（原生工具调用）↔ [[01-Wiki/summaries/Agentic AI 课程 3.3 工具调用语法]] 的 aisuite 自动 schema
- "工具即函数"的安全面 → [[01-Wiki/concepts/Agent 安全与对齐]]

## 延伸问题

- 文本协议（FUNCTION:）与原生 tool_call 在流式/并行调用上的差异？
- 解析失败（模型输出格式跑偏）时的重试与修复策略？
