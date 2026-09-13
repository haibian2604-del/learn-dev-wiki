---
type: concept
domain: tech
tags: [mcp, agent, protocol]
created: 2026-07-31
updated: 2026-09-13
sources: ["[[01-Wiki/summaries/第 20 章 MCP 模型上下文协议]]", "[[01-Wiki/summaries/架构师AI杜 Day19 MCP协议深度解析]]", "[[01-Wiki/summaries/Agentic AI 课程 3.7 MCP]]"]
status: mature
---

# MCP（Model Context Protocol，模型上下文协议）

> 开放标准协议，规范 AI 应用/Agent/IDE/聊天客户端如何与外部工具、资源和上下文提供方交互。AI 世界的 USB-C、大模型版的 OpenFeign/gRPC 协议层。

## 定义

MCP 是"AI 应用与外部能力之间的通用适配层"。它统一的是**应用发现、理解、调用和复用外部能力的方式**，而不是模型本身。

一句话：**让外部工具、资源、提示词模板按统一协议被不同 AI 应用发现和使用**——一次暴露，多处复用；统一 schema，降低适配成本；更容易形成工具生态。

## 机制/原理

### 三角色架构

| 角色 | 含义 |
|------|------|
| MCP Host | 用户交互的应用（IDE、桌面客户端、自研 AI 平台） |
| MCP Client | Host 内部负责与某台 Server 建立协议连接的组件（一 Host 可连多 Server） |
| MCP Server | 对外暴露 Tools/Resources/Prompts 的服务 |

### 服务端三类能力

| 类型 | 作用 | 控制方式 |
|------|------|----------|
| Tools | 可执行动作（查天气、查库、发请求） | 模型可触发（model-controlled） |
| Resources | 可读取内容（文件、配置、API 响应） | 应用/宿主决定（application-driven） |
| Prompts | 可复用提示词/工作流模板 | 用户显式选择（user-controlled） |

进阶能力：Sampling（服务器借客户端向宿主 LLM 请求生成）、Elicitation（向用户补充信息）、Logging、Progress/Notifications。

### 一次完整调用（5 个动作）

1. 握手与能力发现（initialize + capabilities 协商 + 发现 tools/resources/prompts）
2. 上下文注入（问题 + 工具说明进 Prompt）
3. 决策（模型决定调 Tool / 应用决定读 Resource）
4. 路由与执行（Server 在自身进程/远端执行）
5. 结果回传与继续生成

底层消息格式：**JSON-RPC 2.0**（request/response/notification）。

### 传输方式

| 传输 | 场景 |
|------|------|
| stdio | 本地子进程通信，轻量，客户端拉起服务端进程 |
| Streamable HTTP | 独立服务进程，HTTP 通信，可配 SSE 流式（取代旧 HTTP+SSE） |

> 旧资料里的 `sse` 属于旧 HTTP+SSE transport 叫法或兼容写法；新项目以 `stdio + Streamable HTTP` 为准。

## 与 Tool / RAG / Agent 的区别

| 概念 | 解决什么问题 | 速记 |
|------|-------------|------|
| Tool / Function Calling | 模型如何调用一个具体工具 | 能不能调用 |
| RAG | 模型如何拿到外部知识 | 能不能拿到知识 |
| MCP | 外部能力如何被标准化暴露与接入 | 怎么统一接入 |
| Agent | 谁来规划、决策、调用这些能力 | 谁来决定何时调用 |

MCP 在 Tool 之上再抽象一层"协议层"，不是替代 Tool。

## 边界与常见误区

- **MCP ≠ 让模型联网/调工具**：核心是跨应用标准化接入，不是模型能力
- **mcp.json 不是协议本身**：只是部分 Host/Client 常用的连接配置文件（声明连哪些服务、用什么传输）
- **统一接入 ≠ 自动安全**：Server 常有高权限（本机文件/内网/密钥），需控制来源可信、最小权限、网络隔离、审计；写操作要人确认
- **不要把所有能力都做成 Tool**：读数据用 Resource、模板工作流用 Prompt，否则权限和语义会乱
- stdio 服务不能脱离客户端单独跑（无宿主接管 stdin/stdout 会报 Invalid JSON，属预期）

## 相关概念

- [[01-Wiki/concepts/RAG]]（解决"拿知识"，与 MCP 互补）
- [[01-Wiki/concepts/MCP Server 开发]]（实现层：Server 六组件、工具设计八原则、参数验证与安全防护）
- [[01-Wiki/entities/LangChain]]（`MultiServerMCPClient` 适配）
- [[01-Wiki/entities/FastMCP]]（Python 服务端实现工具）
- 进阶：Agent 编排（第 21 章）、MCP Inspector（调试工具）

## 补充视角：2026 Agent 三大协议生态

> 来自 [[01-Wiki/summaries/2026 年 AI Agent 技术全景]]

MCP 是 Agent 生态三大协议之一（[[01-Wiki/concepts/AI Agent]]）：

| 协议 | 作用 | 类比 |
|------|------|------|
| MCP | 统一 LLM 与外部工具通信 | AI 领域 USB-C |
| A2A | 多 Agent 之间通信与协作 | Agent 界 HTTP |
| Skills | 延迟加载的 sub-agent 体系 | 插件系统 2.0 |

MCP 普及使第三方工具集成成本降低约 80%。

## 补充视角：JavaGuide 企业级 MCP

> 来自 [[01-Wiki/summaries/JavaGuide MCP]]

- **工具选择策略**：模型在多 MCP 工具间的选择准确度取决于工具描述质量（与 Skills 的 description 原则一致）
- **生产级关注点**：错误处理、超时控制、限流、日志审计——MCP Server 不只是暴露能力，还要抗造
- **四层分层扩展**：除标准三角色外，增加能力发现层与工具路由层的工程视角

## 补充视角：手写 Server 的实现视角

> 来自 [[01-Wiki/summaries/架构师AI杜 Day19 MCP协议深度解析]]、[[01-Wiki/summaries/架构师AI杜 Day20 MCP Server开发基础]]、[[01-Wiki/summaries/架构师AI杜 Day21 MCP工具开发]]

不使用 SDK、纯 FastAPI 手搓一个 MCP Server，需要自己实现的东西就是协议的全部骨架：

| 层 | 要自己做的事 |
|----|-------------|
| Server 组件 | 请求处理器、工具管理器、资源管理器、认证授权器、响应生成器、错误处理器 |
| 工具建模 | 元数据（名称/描述/参数/返回值）与执行函数解耦注册，按名查表调用 |
| 分发 | 按 method 路由到 `tools/list`、`tools/call`、`resources/list`、`resources/read` |
| 错误 | 工具层异常一律转为结构化返回值，不崩溃、不打断 Agent 循环 |
| 鉴权 | 工具级 / 资源级 / 操作级三层粒度；策略可用 RBAC / ABAC / 上下文 |

**Resource 的两种理解**（重要分歧）：官方语义是"应用决定读取的可寻址内容（URI）"，部分教程把 Resource 建模成带 CRUD 的元数据实体，两者不是一回事。

### ⚠️ 常见资料与官方规范的出入

阅读二手教程时，以下写法**不代表官方规范**，照抄会导致与标准 Client 无法互通：

| 常见写法 | 官方规范 |
|----------|---------|
| `mcp.list_tools`、`mcp.call_tool`、`mcp.get_resource` | `tools/list`、`tools/call`、`resources/read` |
| 传输层 HTTP/HTTPS/WebSocket | stdio（本地）与 Streamable HTTP（远端） |
| 版本 v1.0 / v1.1 / v2.0 | 日期版本号（2024-11-05、2025-03-26、2025-06-18） |
| 「AI Model ↔ Server」两层架构 | Host / Client / Server 三角色，Client 是 Host 内部组件 |
| HTTP 错误码 400/401/403 | JSON-RPC 错误码（-32700 解析错、-32600 无效请求、-32601 方法未找到、-32602 无效参数、-32603 内部错误） |
| 无握手 | `initialize` 握手 + capabilities 能力协商 |

> 判断依据：以官方规范与 SDK（[[01-Wiki/entities/FastMCP]]）为准；详见 [[01-Wiki/concepts/MCP Server 开发]]。

## 补充视角：m × n → m + n 的价值论证（Agentic AI 课程 3.7）

> 来自 [[01-Wiki/summaries/Agentic AI 课程 3.7 MCP]]：解释 MCP 必要性最直观的一个论证。

- **传统模式的复杂度**：开发者 A 的 App 1 需要 Slack + Google Drive + GitHub + PostgreSQL，开发者 B 的 App 2 同样需要——每个应用都要独立编写封装代码。若有 `m` 个应用、`n` 个工具，社区总工作量是 **m × n**
- **MCP 的解法**：只需开发 `n` 个 MCP 服务器（每个工具一个），让 `m` 个应用连接它们即可，总工作量降为 **m + n**
- **客户端示例**：Cursor、Claude Desktop、Windsurf；**服务器示例**：Slack、Google Drive、GitHub、PostgreSQL（部分是服务商官方开发，也有大量第三方贡献）
- **能力演进**：初始设计侧重"为 LLM 提供上下文"，工具主要用于 fetch data；现已扩展为可调用更通用功能与执行操作（MCP 文档统称"资源 resources"）
- **演示链路**：Claude Desktop 作为 Client → 向 GitHub MCP Server 请求（参数含 `README.md`、仓库 `aisuite`、所有者 `andrewng`）→ Server 下载内容返回 → LLM 生成摘要；二次查询可列出 Pull Request 并整理成清单

> ⚠️ **资料偏差**：该讲把 MCP 的提出者写成 "Entropy"，**实为 Anthropic**——本页定义与 [[01-Wiki/summaries/第 20 章 MCP 模型上下文协议]] 为准，引用时勿沿用错误归属。
