---
type: concept
domain: tech
tags: [mcp, python]
created: 2026-09-04
updated: 2026-09-04
sources: ["[[01-Wiki/summaries/架构师AI杜 Day20 MCP Server开发基础]]", "[[01-Wiki/summaries/架构师AI杜 Day21 MCP工具开发]]"]
status: growing
---

# MCP Server 开发

> 把 MCP 协议落地成可运行服务的工程实践：Server 内部组件划分、工具与资源的建模方式、参数验证与错误处理、鉴权与安全防护。**协议（是什么）在 [[01-Wiki/concepts/MCP]]，实现（怎么做）在本页。**

## 定义

MCP Server 开发指实现一个对外暴露 Tools / Resources / Prompts 的服务端程序。剥离协议外壳后，它本质上是一个**约定了方法名与报文格式的 RPC 服务**——所以常规后端工程的分层、鉴权、错误处理、可观测性要求，在这里一条不少。

## 机制/原理

### 1. Server 的六个内部组件

| 组件 | 职责 |
|------|------|
| 请求处理器 | 接收并解析 JSON-RPC 请求，按 method 分发 |
| 工具管理器 | 工具元数据的注册、查询、列表与执行 |
| 资源管理器 | 资源的定义、访问控制与元数据管理 |
| 认证授权器 | 校验调用方身份与操作权限 |
| 响应生成器 | 组装符合协议的响应报文 |
| 错误处理器 | 捕获异常并转为结构化错误响应 |

把"监控"与"安全"作为 Server 内建职责（而非外挂），是生产级实现的标志。

### 2. 工具注册：元数据与执行函数解耦

`ToolManager.register(tool, func)` 把**元数据**（名称、描述、参数 schema、返回值）与**可调用对象**分开存放，执行时按名查表调用。好处：

- 元数据可序列化，供 `tools/list` 直接返回
- 执行函数可独立测试、独立替换
- 便于在运行期统计与限流（见下）

工具命名惯例采用 `域.操作` 前缀（`file.read`、`http.get`、`data.csv.read`），天然支持按前缀分组管理。

### 3. 工具设计八原则

单一职责 / 明确接口 / 错误处理 / 安全优先 / 性能优化 / 可测试性 / 可扩展性 / 用户友好。

其中**可测试性**与**用户友好（错误信息清晰可读）**最易被忽略，却直接决定 Agent 能否自我纠偏——模型要靠错误信息判断"该换参数重试还是换工具"（→ [[01-Wiki/concepts/Loop Engineering]]）。

这与 [[01-Wiki/concepts/Tool Calling]] 的"好工具五个清晰"一致：职责清晰、输入清晰、输出清晰、权限清晰、错误可处理。

### 4. 参数验证：五道闸门

| 闸门 | 检查内容 |
|------|---------|
| 类型 | 参数类型是否正确 |
| 范围 | 数值是否在有效区间、字符串长度是否超限 |
| 格式 | 是否符合约定的格式（URL、邮箱、枚举值） |
| 依赖 | 参数之间的依赖与互斥关系 |
| 安全 | 是否含恶意内容（路径遍历、注入片段） |

声明式实现（Python 侧 Pydantic `Field` + `@validator`）能同时产出验证逻辑与供模型阅读的参数 schema，一举两得。

### 5. 错误处理：工具错误应是返回值，不是异常

`ToolManager.execute` 必须用 try-except 包裹一切——**工具层的任何失败都要变成结构化返回值，而不是抛出崩溃**，否则一次调用失败会打断整个 Agent 循环。

七类常见工具错误：参数 / 权限 / 资源 / 执行 / 超时 / 安全 / 系统。统一信封格式：

```python
{"success": True,  "timestamp": ts, "data": {...}}    # 成功
{"success": False, "timestamp": ts, "error": "..."}   # 失败，供模型读懂并重试
```

**一致性比丰富性重要**：模型依赖稳定结构做解析，返回格式漂移会直接导致 Agent 崩溃。

### 6. 安全：执行前三查 + 参数层拦截

```
参数层：拒绝 ../ 与 ..\（路径遍历）—— 最致命也最常见的漏洞
执行前：is_safe_path（白名单前缀）→ has_permission（OS 权限位）→ is_too_large（体积上限）
```

⚠️ 白名单前缀匹配的经典绕过：`"/tmp_evil/x".startswith("/tmp") == True`。应改用 `os.path.commonpath()` 或给 base 补分隔符后比较。

六类风险需整体设防：路径遍历、命令注入、网络攻击（SSRF）、数据泄露、资源耗尽、权限提升。

### 7. 执行统计：工具治理的最小数据集

在管理器层记录每工具的调用总数、成功数、失败数、累计耗时、最后调用时间。**失败率与耗时是判断"哪个工具该重写或下线"的唯一硬依据**（→ [[01-Wiki/concepts/Agent 评估]]）。

## 例子：最小可跑骨架

```python
# 1. 定义工具元数据 + 执行函数，注册进管理器
tool = Tool(name="file.read", description="读取文件内容",
            parameters=[ToolParameter(name="file_path", type="string",
                                      description="文件路径", required=True)],
            return_type="string")
tool_manager.register(tool, read_file)

# 2. 单端点分发，异常一律转为 JSON-RPC error（不崩溃）
@app.post("/mcp")
async def handle(req: Request, api_key: str = Depends(get_api_key)):
    return handler.handle(MCPRequest(**await req.json()))
```

完整实现（FastAPI + Pydantic，含资源 CRUD、全局异常处理、Docker 部署）见 [[01-Wiki/summaries/架构师AI杜 Day20 MCP Server开发基础]]；三类实战工具集（文件 / 网络 / 数据）与安全防护完整代码见 [[01-Wiki/summaries/架构师AI杜 Day21 MCP工具开发]]。

## 边界与常见误区

- ⚠️ **不要用自建方言替代官方协议**：方法名须用 `tools/list`、`tools/call`、`resources/list`、`resources/read`；写成 `mcp.list_tools` 之类会无法与标准 Client 互通。
- ⚠️ **不要只用普通 HTTP POST 冒充 Streamable HTTP**：官方 Streamable HTTP 需要会话管理与 SSE 流式支持，普通 POST RPC 少了断线重连与进度回传能力。
- **优先用官方 SDK 而非手搓**：[[01-Wiki/entities/FastMCP]] 用装饰器把注册、schema 生成、分发、错误封装全部收拢，几行代码等价上述全部样板。**学原理看手写实现，做项目用 SDK。**
- **不要把一切都做成 Tool**：读数据用 Resource，模板工作流用 Prompt，否则权限模型与语义都会混乱（→ [[01-Wiki/concepts/MCP]]）。
- **鉴权是双端责任**：Server 侧严格认证授权 + 最小权限；Client 侧保护密钥、验证 Server 身份、限频。
- **CORS 别图省事**：示例中 `allow_origins=["*"]` 配合 `allow_credentials=True` 在生产是明确风险配置。

## 相关概念

- [[01-Wiki/concepts/MCP]]（协议层：三角色、三类能力、调用流程、传输方式）
- [[01-Wiki/concepts/Tool Calling]]（模型侧的调用机制与工具设计五清晰）
- [[01-Wiki/concepts/上下文工程]]（工具描述与 schema 也占上下文，需按需加载）
- [[01-Wiki/concepts/Agent 评估]]（工具级失败率与耗时是可观测性基础数据）
- [[01-Wiki/concepts/限流]]（工具调用的并发与速率控制）
- 相关实体：[[01-Wiki/entities/FastMCP]]（Python 官方 SDK）、[[01-Wiki/entities/架构师AI杜]]（本页主要来源系列）
