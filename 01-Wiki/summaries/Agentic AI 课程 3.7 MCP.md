---
type: summary
domain: tech
tags: [mcp, agent]
created: 2026-09-13
updated: 2026-09-13
sources: ["[[00-Raw/mcp/3.7 MCP]]"]
status: growing
---

# Agentic AI 课程 3.7 MCP

> MCP 用一个共享服务器标准，把工具集成的社区总工作量从 **m × n 降到 m + n**：客户端（Cursor/Claude Desktop）连服务器（Slack/GitHub/PostgreSQL），不必每个应用各写一遍封装。

## 核心观点

- **定义**：MCP（Model Context Protocol，模型上下文协议）是为 LLM 提供**标准化方式访问外部工具与数据源**的标准
  - ⚠️ 原文写作"由 Entropy 提出"——**实为 Anthropic 提出**，本课笔记此处有误，正确归属见 [[01-Wiki/concepts/MCP]]
- **目的**：解决开发者为每个应用重复编写工具集成代码（Slack、GitHub、Google Drive 等）的痛点
- **现状**：已被许多公司与开发者广泛采用，形成活跃生态

## 问题与解决方案（m × n → m + n）

**传统模式**：开发者 A 的 App 1 需要 Slack + Google Drive + GitHub + PostgreSQL；开发者 B 的 App 2 同样需要——每个应用都必须独立编写封装代码。若有 `m` 个应用、`n` 个工具，社区总工作量是 **m × n**。

**MCP 方案**：引入**共享 MCP 服务器**——只需开发 `n` 个服务器（每个工具一个），让 `m` 个应用连接它们即可，总工作量降为 **m + n**。

## 两大核心组件

| 组件 | 角色 | 示例 | 功能 |
|------|------|------|------|
| **客户端 Clients** | 希望访问外部工具/数据的应用 | Cursor、Claude Desktop、Windsurf | 向服务器发请求，获取数据或执行操作 |
| **服务器 Servers** | 提供工具与数据源的软件服务 | Slack、Google Drive、GitHub、PostgreSQL | 作为"包装器"，把请求转换为对原始工具 API 的调用并返回结果 |

服务器来源：部分由服务提供商开发，也有大量第三方开发者贡献。

## 能力范围

- **初始设计**：侧重为 LLM 提供更多上下文，工具主要用于 **fetch data**
- **当前发展**：已扩展为不仅访问数据，还能调用更通用的功能与执行操作；MCP 文档统称这些为"资源（resources）"

## 实际演示：Claude Desktop + GitHub MCP

1. 用户在 Claude Desktop 输入"总结该 GitHub 仓库 README 内容"并附 URL
2. Claude Desktop 作为 MCP 客户端识别需求 → 向已连接的 GitHub MCP 服务器发请求，参数含文件路径 `README.md`、仓库 `aisuite`、所有者 `andrewng`
3. GitHub MCP 服务器下载文件内容 → 将长文本返回
4. Claude Desktop 把内容反馈给 LLM → 生成简洁格式良好的摘要
5. 二次查询"有哪些最新的 Pull Request?"→ 客户端发 "List pull requests" → 服务器返回 JSON 列表 → LLM 整理成含标题/状态/作者/描述的清单

## 亮点与不足

- 亮点：m×n → m+n 的复杂度论证最直观，是解释 MCP 价值的最佳入口；Claude Desktop + GitHub 例子把"客户端-服务器-LLM"三方分工演示清楚
- **不足（资料偏差）**：①MCP 提出者误写为 "Entropy"（应为 **Anthropic**）；②只讲资源获取与查询，未涉及 Tool/Resource/Prompt 三类原语与 stdio/HTTP 传输等协议细节

## 与既有知识的联系

- 补充 [[01-Wiki/concepts/MCP]]（协议总论）与 [[01-Wiki/concepts/MCP Server 开发]]（落地六组件）
- 与 [[01-Wiki/summaries/第 20 章 MCP 模型上下文协议]]、[[01-Wiki/summaries/JavaGuide MCP]]、[[01-Wiki/summaries/架构师AI杜 Day19 MCP协议深度解析]] 构成多来源交叉验证；**提出者归属以 Anthropic 为准**
- 客户端示例 ↔ [[01-Wiki/entities/Cursor]]、[[01-Wiki/entities/Claude Code]]

## 延伸问题

- m + n 的代价转移：MCP 服务器质量参差时的发现/信任机制？
- MCP 的 Tool/Resource/Prompt 三原语与本课"resources"提法的对应关系
