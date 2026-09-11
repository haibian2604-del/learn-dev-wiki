---
type: entity
domain: tech
tags: [mcp, fastmcp, python]
created: 2026-07-31
updated: 2026-09-04
sources: ["[[01-Wiki/summaries/第 20 章 MCP 模型上下文协议]]", "[[01-Wiki/summaries/架构师AI杜 Day20 MCP Server开发基础]]"]
status: growing
---

# FastMCP

> MCP 官方 Python 生态中快速编写 MCP Server 的高层封装。MCP 是规则（协议标准），FastMCP 是实现规则的工具（类似 HTTP 之于 FastAPI/Flask）。

## 是什么

FastMCP 把底层样板工作收起来，让开发者以"写 Python 函数"的方式暴露 MCP 能力。构造函数只接受服务名；网络绑定信息（host/port）在 `run()` 时传，**不是构造函数参数**。

## 关键事实

常用 API：

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Demo")          # 创建服务实例（只传服务名）

@mcp.tool()                    # 暴露 Tool：可执行动作，模型可触发
def add(a: int, b: int) -> int:
    return a + b

@mcp.resource("greeting://default")   # 暴露 Resource：可读内容，宿主决定
def get_greeting() -> str:
    return "Hello from static resource!"

@mcp.prompt()                  # 暴露 Prompt：可复用提示词模板，用户显式选择
def greet_user(name: str, style: str = "friendly") -> str:
    return f"为{name}生成问候语"

mcp.run(transport="stdio")             # 本地子进程通信
mcp.run(transport="streamable-http")   # 独立 HTTP 服务（当前规范重点）
```

常见坑：

- **直接运行 stdio 服务会报 Invalid JSON**：stdio 服务必须由 MCP 客户端（Cursor/Claude 等）启动并接管 stdin/stdout，终端单独运行属预期现象
- **Windows 依赖**：部分功能需 `pip install pywin32`；Python 3.13 兼容问题可用仓库极简版 `McpServer.py` 绕过
- 仓库案例保留 `transport="sse"` 写法仅为兼容教学；新项目优先 `stdio / streamable-http`

## 手写 vs SDK：学原理用哪个？

> 对照 [[01-Wiki/summaries/架构师AI杜 Day20 MCP Server开发基础]]（FastAPI 从零手写，约 300 行样板）

| 手写要自己做的事 | FastMCP 的处理 |
|-----------------|---------------|
| 工具/资源元数据模型与注册器 | `@mcp.tool()` / `@mcp.resource()` 装饰器自动生成 schema |
| 按 method 分发四个方法 | 框架内建，方法名符合官方规范 |
| 参数校验与错误封装 | Pydantic 类型注解即校验，异常自动转协议错误 |
| 传输（stdio / Streamable HTTP） | `mcp.run(transport=...)` 一行切换 |
| `initialize` 握手与能力协商 | 框架内建，无需手写 |

**结论：学原理看手写实现（理解协议骨架），做项目用 FastMCP。** 手写方案若自建方法名（如 `mcp.list_tools` 而非 `tools/list`），会无法与标准 MCP Client 互通——详见 [[01-Wiki/concepts/MCP Server 开发]] 的规范出入对照表。

## 相关

- 相关概念：[[01-Wiki/concepts/MCP]]、[[01-Wiki/concepts/MCP Server 开发]]（实现层详解）、[[01-Wiki/concepts/Tool Calling]]
- 相关实体：[[01-Wiki/entities/LangChain]]（客户端侧 `MultiServerMCPClient` 配套）、[[01-Wiki/entities/架构师AI杜]]（手写实现的来源系列）
- 相关来源：[[01-Wiki/summaries/第 20 章 MCP 模型上下文协议]]、[[01-Wiki/summaries/架构师AI杜 Day20 MCP Server开发基础]]、[[01-Wiki/summaries/架构师AI杜 Day21 MCP工具开发]]
