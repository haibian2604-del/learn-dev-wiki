---
type: summary
domain: tech
tags: [agent, mcp, llm]
created: 2026-07-31
updated: 2026-07-31
sources: ["[[00-Raw/mcp/JavaGuide-MCP]]"]
status: growing
---

# JavaGuide · MCP

> JavaGuide 视角的 MCP 实战文章：核心概念、四层分层架构、JSON-RPC 2.0 通信机制、生产级 MCP Server 开发实践。与已有 [[01-Wiki/concepts/MCP]] 互补。

## 核心增量（与已有概念页互补）

- **真实痛点叙述**：模型接入不是最麻烦的，真正烦的是"工具"——每个 AI 应用都要重复接 GitHub/Slack/数据库/文件系统
- **MCP 四层分层架构**：除了标准的三角色（Host/Client/Server），增加"能力发现层"与"工具路由层"的工程视角拆解
- **生产级 MCP Server 开发实践**：错误处理、超时控制、限流、日志审计等企业级关注点
- **工具选择策略**：模型如何在多个 MCP 工具间做选择（工具描述质量决定选择准确度）

## 与既有知识的联系

→ 补充 [[01-Wiki/concepts/MCP]] 的企业级落地实践视角
