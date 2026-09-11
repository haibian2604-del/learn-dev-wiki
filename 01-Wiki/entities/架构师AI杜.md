---
type: entity
domain: tech
tags: [agent, mcp, langchain]
created: 2026-09-04
updated: 2026-09-04
sources: ["[[01-Wiki/summaries/架构师AI杜 Day19 MCP协议深度解析]]", "[[01-Wiki/summaries/架构师AI杜 Day20 MCP Server开发基础]]", "[[01-Wiki/summaries/架构师AI杜 Day21 MCP工具开发]]", "[[01-Wiki/summaries/架构师AI杜 Day35 Agent基础概念]]", "[[01-Wiki/summaries/架构师AI杜 Day38 LangChain框架上]]", "[[01-Wiki/summaries/架构师AI杜 Day39 LangChain框架下]]"]
status: growing
---

# 架构师AI杜

> weekr.net 上的中文 AI 技术教程作者 / 公众号，以「第 N 天」为序号连载 AI 工程教程，覆盖 MCP 协议与开发、Agent 基础、LangChain 框架等主题。

## 是什么

一套**面向动手实践**的中文 AI 工程连载教程。每篇结构固定：学习目标 → 核心内容（概念 + 分层讲解 + 可运行 Python 代码）→ 技术选型建议 → 常见问题 → 课后作业（简答/实践/思考）。

与 [[01-Wiki/entities/zero2Agent]] 系列的差异：**zero2Agent 偏"为什么这样设计"的工程原理与避坑，本系列偏"照着做就能跑出来"的代码实现**。两者互补——本系列提供可直接抄的骨架代码，zero2Agent 提供判断力。

## 关键事实

- 站点：`https://www.weekr.net/ai/day-N.html`（N 为天数序号）
- 每篇 frontmatter 带 `published` 与 `description`（含"第N天：标题"），是区分同名文章的唯一依据
- 教程语言：Python 为主（FastAPI + Pydantic 技术栈），LangChain 部分基于 0.1.x 旧版 API
- 文末统一附公众号二维码

## 已摄入章节

| 天数 | 主题 | 领域 | 摘要页 |
|------|------|------|--------|
| Day 19 | MCP协议深度解析 | 协议 | [[01-Wiki/summaries/架构师AI杜 Day19 MCP协议深度解析]] |
| Day 20 | MCP Server开发基础 | 协议 / 工程 | [[01-Wiki/summaries/架构师AI杜 Day20 MCP Server开发基础]] |
| Day 21 | MCP工具开发 | 协议 / 工程 | [[01-Wiki/summaries/架构师AI杜 Day21 MCP工具开发]] |
| Day 35 | Agent基础概念 | 理论 | [[01-Wiki/summaries/架构师AI杜 Day35 Agent基础概念]] |
| Day 38 | LangChain框架（上） | 框架 | [[01-Wiki/summaries/架构师AI杜 Day38 LangChain框架上]] |
| Day 39 | LangChain框架（下） | 框架 | [[01-Wiki/summaries/架构师AI杜 Day39 LangChain框架下]] |

主题分布：**MCP 三篇**（19/20/21，构成"协议 → Server → 工具"递进链）、**LangChain 两篇**（38/39，基础 → 进阶）、**Agent 理论一篇**（35）。

## ⚠️ 使用本系列资料的注意点

引用本系列内容时须注意两处系统性偏差，已在各摘要页标注：

1. **MCP 部分与官方规范不一致**：方法名写作 `mcp.list_tools` / `mcp.call_tool`（官方为 `tools/list` / `tools/call`）；传输层写 HTTP/HTTPS/WebSocket（官方为 stdio 与 Streamable HTTP）；版本号 v1.0~v2.0 查无实据（官方用日期版本）。**按本文实现无法与标准 MCP Client 互通**，做项目请用 [[01-Wiki/entities/FastMCP]] 等官方 SDK。
2. **LangChain 部分为 0.1.x 旧版 API**：`LLMChain`、`initialize_agent`、`load_tools` 均已非推荐路径，官方现主推 LCEL 与 LangGraph。
3. **多处代码含安全反例**：`eval(expression)` 执行模型生成字符串、`CORS allow_origins=["*"]` 等，切勿直接进生产。

## 相关

- 相关概念：[[01-Wiki/concepts/MCP]]、[[01-Wiki/concepts/MCP Server 开发]]、[[01-Wiki/concepts/Tool Calling]]、[[01-Wiki/concepts/AI Agent]]、[[01-Wiki/concepts/LangChain 组件与 Agent 模式]]、[[01-Wiki/concepts/ReAct]]
- 相关实体：[[01-Wiki/entities/LangChain]]、[[01-Wiki/entities/FastMCP]]、[[01-Wiki/entities/zero2Agent]]（互补的中文教程系列）
