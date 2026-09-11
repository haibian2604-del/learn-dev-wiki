---
type: summary
domain: tech
tags: [mcp, python]
created: 2026-09-04
updated: 2026-09-04
sources: ["[[00-Raw/mcp/架构师AI杜 Day20 MCP Server开发基础]]"]
status: growing
---

# 架构师AI杜 Day20 MCP Server开发基础

> 不用官方 SDK，纯 FastAPI + Pydantic 从零手写一个 MCP Server：资源模型、工具模型、请求分发、错误处理和 API Key 鉴权，一次完整的"协议落地"演练。

来源：[[01-Wiki/entities/架构师AI杜]] 系列教程 Day20（weekr.net/ai/day-20）

## 核心观点

- **Server 的六件套职责**：请求处理器（接收解析）、工具管理器（注册与执行）、资源管理器（定义与访问）、认证授权器、响应生成器、错误处理器。这个划分与通用 Web 服务的分层一一对应——MCP Server 本质上就是一个**约定了方法名与报文格式的 RPC 服务**。
- **Resource 是"被管理的数据对象"而非"工具的输入"**：本文把 Resource 建模为独立实体（`ResourceType` 枚举：file / network / database / compute / service），带 `properties` 与 `metadata`，由 `ResourceManager` 做 CRUD。这与官方 MCP 中 Resource 是"可读取内容（URI 寻址）"的定位有差异，见后文。
- **Tool 与执行函数解耦注册**：`ToolManager.register(tool, func)` 把"元数据（名称/描述/参数/返回值）"与"可调用对象"分开存放，执行时按名查表调用 `func(**arguments)`。这是所有工具框架的核心骨架（→ [[01-Wiki/concepts/Tool Calling]]）。
- **执行层必须"吞掉"异常**：`ToolManager.execute` 用 try-except 包住一切，未知工具返回 `status="error"` 而非抛异常——**工具层的错误应该是返回值，不是崩溃**，否则整个 Agent 循环会被一次调用打断。
- **请求分发是一个 method 路由表**：`RequestHandler.handle` 按 `mcp.list_tools` / `mcp.call_tool` / `mcp.list_resources` / `mcp.get_resource` 四个方法分发，未命中返回 404。
- **鉴权用 FastAPI 依赖注入实现**：`get_api_key` 依赖读取 `X-API-Key` 头，缺失 401、不匹配 403，干净利落。
- **全局异常兜底**：`@app.exception_handler(Exception)` 统一转成 JSON-RPC 错误响应，5xx 时附 traceback。
- **单端点 `POST /mcp` + `/health` 探活**：全部协议流量走一个端点，便于限流、审计和网关接入。

## 关键数据

| 指标 | 数值 | 出处 |
|------|------|------|
| 四个 MCP 方法 | `mcp.list_tools`、`mcp.call_tool`、`mcp.list_resources`、`mcp.get_resource` | §5.2 |
| 错误码体系 | 400 参数错误 / 401 认证失败 / 403 授权失败 / 404 资源不存在 / 500 服务器错误 / 503 服务不可用 | §7 |
| Server 组件数 | 6 个 | §1 |
| 依赖 | fastapi、uvicorn、pydantic、python-jose[cryptography]、passlib[bcrypt]、python-multipart | §2.2 |
| 项目目录层级 | `app/{api,core,managers,models,schemas,tools}` + `main.py` | §2.2 |
| 服务端口 | 8000 | §8.1 |
| 基础镜像 | `python:3.9` | §9.2 |

框架选型对比（→ 原文 §9.1）：

| 特性 | FastAPI | Flask | Django |
|------|---------|-------|--------|
| 性能 | 高（异步） | 中 | 低 |
| 类型提示 | 支持 | 有限 | 有限 |
| 文档 | 自动生成 | 手动 | 手动 |
| 学习曲线 | 中等 | 低 | 高 |
| 适用场景 | 高性能 API | 小型应用 | 大型应用 |

## 亮点与不足

**亮点**
- 给出**可直接运行**的完整代码：从 `main.py` 到 `dependencies.py`、`routes.py`，含 curl 测试命令，动手性极强。
- 目录结构（`models` / `schemas` / `managers` / `api` 分层）是标准的企业级 Python 工程骨架，比散装脚本更有参考价值。
- 把 MCP 请求建模为 Pydantic `MCPRequest`，用类型系统约束协议报文，这个思路值得借鉴。
- 明确区分 401（无凭证）与 403（凭证无效），符合 HTTP 语义。

**不足**
- ⚠️ **自建协议方言**：方法名 `mcp.list_tools` 等与官方 `tools/list`、`tools/call` 不一致，写出来的 Server **无法被标准 MCP Client（Cursor / Claude Desktop）直接连接**。
- ⚠️ **传输方式非官方**：单端点 `POST /mcp` 是普通 HTTP RPC，不是 MCP 的 Streamable HTTP（后者要求 SSE 流式与会话管理），也不支持 stdio。
- ⚠️ **Resource 建模偏离规范**：官方 Resource 是 application-driven 的 URI 可寻址内容；本文把 Resource 当成了带 CRUD 的元数据实体，语义错位。
- 安全问题：示例 `CORS allow_origins=["*"]` 且 `allow_credentials=True`，生产环境是明确风险配置。
- 资源 ID 用 `f"{type}_{len(resources)+1}"` 自增生成，并发与删除后会冲突。
- `datetime.utcnow()` 在 Python 3.12+ 已弃用。

## 与既有知识的联系

- **对比** [[01-Wiki/entities/FastMCP]]：FastMCP 用 `@mcp.tool()` 装饰器把本文所有样板（注册、schema 生成、分发、错误封装）压缩成几行，且方法名与传输层符合官方规范。**结论很直接：学原理看本文，做项目用 FastMCP。**
- **补充** [[01-Wiki/concepts/MCP]]：本文是"如果不使用 SDK，MCP Server 内部要自己实现什么"的完整清单，可补入概念页的"手写实现视角"。
- **呼应** [[01-Wiki/summaries/JavaGuide MCP]]：两者都强调"MCP Server 不只是暴露能力，还要抗造"（错误处理、超时、限流、审计），本文给出了错误处理的落地代码。
- **前置** [[01-Wiki/summaries/架构师AI杜 Day19 MCP协议深度解析]]：Day19 讲规范，Day20 讲实现。

## 延伸问题

- 若要让本文的 FastAPI Server 被标准 MCP Client 识别，最小改造路径是什么？（方法名改为 `tools/list` + 实现 `initialize` 握手 + 加 SSE 支持，还是直接换 FastMCP？）
- Streamable HTTP 相比本文的普通 POST，多了会话 ID 与 SSE 流，它们在断线重连与长任务进度回传上具体解决什么问题？
- 工具执行的超时与并发限制该放在 `ToolManager.execute` 还是网关层？（→ [[01-Wiki/concepts/限流]]）
- 当工具数量增长到几十个时，全量 `tools/list` 是否会撑爆上下文？如何按需加载？（→ [[01-Wiki/concepts/上下文工程]]）

## 速查：最小可跑骨架

```python
# 1. 定义工具元数据 + 执行函数，交给 ToolManager 注册
tool = Tool(name="file.read", description="读取文件内容",
            parameters=[ToolParameter(name="file_path", type="string",
                                      description="文件路径", required=True)],
            return_type="string")
tool_manager.register(tool, read_file)

# 2. 单端点分发四类方法，异常一律转为 JSON-RPC error
@app.post("/mcp")
async def handle_mcp_request(request: Request, api_key: str = Depends(get_api_key)):
    req = MCPRequest(**json.loads(await request.body()))
    return handler.handle(req)      # 未命中方法 → 404 Method not found
```
