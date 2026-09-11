---
type: summary
domain: tech
tags: [mcp, agent, langchain]
created: 2026-07-31
updated: 2026-07-31
sources: ["[[00-Raw/mcp/第 20 章 MCP 模型上下文协议]]"]
status: growing
---

# 第 20 章 MCP 模型上下文协议

> 《AI 智能体实战速成指南：从零到企业级落地》第 20 章：MCP 是什么、解决什么痛点、Host/Client/Server 架构、Tool/Resource/Prompt 三类能力、stdio/Streamable HTTP 传输，以及 FastMCP 与 LangChain 适配器实践。

## 核心观点

- **MCP = AI 世界的 USB-C**：统一的不是模型本身，而是 AI 应用发现、理解、调用和复用外部能力的方式（→ [[01-Wiki/concepts/MCP]]）
- **解决的痛点**：各 AI 应用重复接外部系统、各框架各有接法、工具难复用成生态能力 → 缺少跨应用/跨框架/跨宿主的统一连接标准
- **四层概念分工**：Tool 解决"能不能调用"、RAG 解决"能不能拿到知识"、MCP 解决"怎么统一接入"、Agent 解决"谁来决定何时调用"
- **服务端三类能力**：Tools（可执行动作，model-controlled）、Resources（可读内容，application-driven）、Prompts（可复用模板，user-controlled）——MCP 不只是工具协议
- **架构三角色**：Host 是应用（IDE/客户端）、Client 是 Host 内部的协议连接组件（一 Host 可连多 Server）、Server 暴露能力
- **传输方式**：当前规范重点为 `stdio`（本地子进程）+ `Streamable HTTP`（独立服务）；仓库保留 `sse` 写法仅为兼容/教学
- **MCP 与 Agent 的配合**：MCP 负责"标准化接入"，LangChain/Agent 负责"把接进来的能力真正用起来"
- **安全边界**：MCP Server 往往有高权限访问本机/内网/密钥，必须控制来源可信、最小权限、网络隔离、调用审计；写操作要有人确认

## 关键数据

| 指标 | 数值 | 出处 |
|------|------|------|
| 章节体量 | 8188 字 / 21 分钟 | 原文 |
| 底层消息格式 | JSON-RPC 2.0（request/response/notification） | §5.2 |
| 一次完整调用 | 5 个动作：握手发现→上下文注入→决策→路由执行→结果回传 | §5.2.1 |
| mcp.json 示例 | weather 走 sse(127.0.0.1:8000)，fetch 走 stdio(uvx) | §6.3 |
| FastMCP 传输 | `mcp.run(transport="stdio" / "streamable-http")` | §5.4.5 |

## 亮点与不足

- 亮点：用"USB-C 类比 + 贾维斯"建立直觉；Tool/RAG/MCP/Agent 四层分工表清晰；明确纠正两个常见误区（mcp.json 不是协议本身、sse 是旧传输叫法）
- 亮点：案例分级（极简教学版 → FastMCP 标准版 → 天气服务 + mcp.json + LangChain Agent），学习顺序建议实用
- 不足：案例保留 `sse` 旧写法，与当前规范（Streamable HTTP）有偏差，需读者自行对照；Sampling/Elicitation 等进阶能力仅提及未展开

## 与既有知识的联系

- 与 [[01-Wiki/concepts/RAG]] 形成对照：RAG 解决"拿知识"，MCP 解决"接能力"
- 依赖 [[01-Wiki/entities/LangChain]]：`MultiServerMCPClient` + `get_tools()` 把 MCP 工具交给 Agent
- 与第 17 章 Tool 调用、第 21 章 Agent 智能体衔接（Agent + MCP 见第 21 章 §5.4）

## 延伸问题

- Agent 式编排下 MCP 工具的决策时机（第 21 章 Agent 智能体，待摄入）
- Streamable HTTP 与 SSE 的具体迁移路径
- MCP 安全实践：企业级接入的鉴权/审计方案
