---
type: entity
domain: tech
tags: [agent, python]
created: 2026-09-13
updated: 2026-09-13
sources: ["[[01-Wiki/summaries/Agentic AI 课程 3.3 工具调用语法]]", "[[01-Wiki/summaries/Agentic AI 课程 3.7 MCP]]"]
status: seedling
---

# aisuite（AI Suite）

## 是什么

由 [[01-Wiki/entities/吴恩达]] 及其团队开发的开源 Python 库，提供**统一、简便的语法调用多个不同 LLM 提供商**，核心能力之一是自动处理工具描述（→ [[01-Wiki/concepts/Tool Calling]]）。

## 关键事实

- **统一调用**：`client = ai.Client()` + `client.chat.completions.create(model="openai:gpt-4o", messages=..., tools=[函数], max_turns=5)`，语法与 OpenAI 原生 API 相似但抽象更高，可轻松切换提供商（来源 [[01-Wiki/summaries/Agentic AI 课程 3.3 工具调用语法]]）
- **自动 schema 生成**：把 Python 函数放入 `tools` 列表后，自动生成 JSON Schema——
  - `name` ← 函数名
  - `description` ← 函数 **docstring**
  - `parameters` ← 从签名解析，类型与说明来自 docstring（如 `timezone: string`，示例 `Pacific/Auckland`）
  - 结论：**docstring 质量直接决定模型能否正确调用工具**
- **轮次控制**：`max_turns` 设定工具调用上限防止无限循环，课程建议常设 5，除非任务异常复杂
- 在 MCP 演示中被用作 GitHub 仓库示例（`andrewng/aisuite` 的 README 总结）

## 相关

- 相关实体：[[01-Wiki/entities/吴恩达]]、[[01-Wiki/entities/FastMCP]]
- 相关概念：[[01-Wiki/concepts/Tool Calling]]、[[01-Wiki/concepts/MCP]]、[[01-Wiki/concepts/代码执行]]
