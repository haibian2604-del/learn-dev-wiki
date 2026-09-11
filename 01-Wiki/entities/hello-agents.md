---
type: entity
domain: tech
tags: [agent, framework, python]
created: 2026-07-31
updated: 2026-07-31
sources: ["[[01-Wiki/summaries/第四章 智能体经典范式构建]]"]
status: seedling
---

# hello-agents（框架）

> datawhalechina/hello-agents《从零开始构建智能体》教程配套的 Python 框架：从零讲解智能体原理，并提供 ContextBuilder/NoteTool/TerminalTool 等生产级组件。

## 是什么

教学型 Agent 框架（pip install hello-agents[all]），与教程章节对应。区别于 LangChain 的"高度抽象"，它暴露设计机制：输出解析、工具调用重试、死循环防护等工程挑战亲手解决。

## 关键事实

核心组件：

| 组件 | 职责 | 关键设计 |
|------|------|----------|
| HelloAgentsLLM | OpenAI 兼容 LLM 客户端封装 | 流式响应、环境变量配置 |
| ToolExecutor | 工具注册与调度 | name+description+func 三要素 |
| ContextBuilder | 上下文构建 | GSSC 流水线（→ [[01-Wiki/concepts/上下文工程]]） |
| NoteTool | 结构化笔记（Markdown+YAML） | 7 操作 + 索引文件，长时程记忆 |
| TerminalTool | 安全命令行执行 | 四层安全：只读白名单+沙箱+超时+输出限制 |
| MemoryTool / RAGTool | 记忆与知识检索 | 与 ContextBuilder 配合 |

经典范式实现：ReAct（→ [[01-Wiki/concepts/ReAct]]）、Plan-and-Solve、Reflection 从零实现。

工具描述（description）是模型选择工具的关键依据——与 MCP/Skills 的触发机制一致。

## 相关

- 相关概念：[[01-Wiki/concepts/ReAct]]、[[01-Wiki/concepts/上下文工程]]、[[01-Wiki/concepts/Agent Skills]]
- 相关来源：[[01-Wiki/summaries/第四章 智能体经典范式构建]]、[[01-Wiki/summaries/第九章 上下文工程]]
