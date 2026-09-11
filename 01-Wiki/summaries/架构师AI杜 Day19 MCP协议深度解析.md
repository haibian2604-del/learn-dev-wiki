---
type: summary
domain: tech
tags: [mcp, agent]
created: 2026-09-04
updated: 2026-09-04
sources: ["[[00-Raw/mcp/架构师AI杜 Day19 MCP协议深度解析]]"]
status: growing
---

# 架构师AI杜 Day19 MCP协议深度解析

> 从协议设计者视角拆解 MCP：起源、核心概念（Server/Tool/Resource）、四层架构、JSON-RPC 通信流程与安全机制，是一份"协议规范导读"。

来源：[[01-Wiki/entities/架构师AI杜]] 系列教程 Day19（weekr.net/ai/day-19）

## 核心观点

- **MCP 的起因是"安全 + 标准化"**：Anthropic 于 2024 年底发布，最初为 Claude 设计，现已开放给其他模型（→ [[01-Wiki/concepts/MCP]]）。它要解决的不是"模型能不能调工具"，而是"外部能力如何被**安全、统一**地暴露与接入"。
- **五大设计目标**：安全性（只访问授权的工具和资源）、标准化（统一接口规范）、可扩展性（支持自定义）、易用性（简化开发集成）、可靠性（交互稳定一致）。
- **三个核心概念构成协议的语义骨架**：
    | 概念 | 定位 | 组成 |
    |------|------|------|
    | Server | 核心组件，管理工具与资源、处理请求、执行调用、返回结果 | 工具发现、参数验证、工具执行、资源访问控制、错误处理 |
    | Tool | Server 提供的功能单元 | 名称、描述、参数、返回值、错误处理；分内置/自定义/第三方 |
    | Resource | Tool 操作的对象或数据，定义可访问范围 | 文件/网络/数据库/计算/服务五类；含标识符、类型、权限、状态、元数据 |
- **四层分层**：应用层（Tool 与 Resource 的业务逻辑）→ 服务层（Server 核心功能）→ 协议层（MCP 规范）→ 传输层（HTTP/HTTPS/WebSocket）。
- **Server 六模块**：工具管理、资源管理、请求处理、响应管理、安全模块（认证授权）、监控模块。把"监控"与"安全"并列为 Server 内建职责，是本文相对很多入门资料的加分点。
- **一次工具调用走 8 步**：工具发现 → 请求构建 → 请求发送 → 请求验证 → 工具执行 → 结果处理 → 响应发送 → 结果解析。注意**验证发生在 Server 侧**，不是模型侧。
- **安全是双端责任**：Server 侧（HTTPS、严格认证授权、限制工具执行权限、监控异常、定期更新配置）；Client 侧（保护密钥、验证 Server 身份、限频、敏感信息处理）。
- **授权粒度分三层**：工具级、资源级、操作级；策略分基于角色（RBAC）、基于属性（ABAC）、基于上下文三种。

## 关键数据

| 指标 | 数值 | 出处 |
|------|------|------|
| 协议发布时间 | 2024 年底（Anthropic） | 第19天 §1 |
| 消息格式 | JSON-RPC 2.0 | 第19天 §4.2 |
| 工具调用流程步数 | 8 步 | 第19天 §4.1 |
| 架构分层 | 4 层（应用/服务/协议/传输） | 第19天 §3.2 |
| Server 模块数 | 6 个 | 第19天 §3.3 |
| 错误码 | 400 参数错误 / 401 认证失败 / 403 授权失败 / 404 资源不存在 / 500 服务器错误 / 503 服务不可用 | 第19天 §6.3 |
| 推荐技术栈 | Python 3.8+ / FastAPI / JWT + API Key / SQLite·PostgreSQL / Docker + K8s | 第19天 §8.1 |

## 亮点与不足

**亮点**
- 把 **Resource 的五种类型**（文件/网络/数据库/计算/服务）讲清楚了，很多资料只讲 Tools 不讲 Resources。
- 明确区分**认证（你是谁）与授权（你能做什么）**，并给出三层授权粒度 + 三种策略模型，工程可直接落地。
- 提供了完整的 JSON-RPC 请求/响应样例（list_tools、call_tool、错误响应），便于对照实现。
- 技术选型给了替代方案（Node.js+Express / Go+Gin / Java+Spring Boot），不是单一栈布道。

**不足**
- ⚠️ **若干表述与 MCP 官方规范不一致**，见下节对照表，不能直接当作规范依据。
- 内容偏"教材式罗列"，缺少对"为什么这样设计"的取舍分析（例如为什么 Tool 必须带 schema、为什么 Resource 与 Tool 要分开）。
- 安全章节未涉及 MCP 特有的高危面：提示词注入间接操控工具、Server 高权限（本机文件/内网/密钥）的隔离要求。
- 未提及 stdio 传输（官方主推的本地通信方式），只讲 HTTP/WebSocket。

## 与既有知识的联系

- **补充** [[01-Wiki/concepts/MCP]]：本文提供的 Server 六模块、Resource 五分类、三层授权粒度，可作为该概念页"服务端实现视角"的补充材料。
- **支撑** [[01-Wiki/entities/FastMCP]]：FastMCP 正是把本文所述 Server 职责（工具注册、资源管理、请求分发、错误处理）封装成装饰器，本文可视为 FastMCP 之下的"手写原理层"。
- **呼应** [[01-Wiki/concepts/Tool Calling]]：本文的 8 步流程与"call ID 因果外键"是同一件事的协议侧表达。

### ⚠️ 与 MCP 官方规范的出入（重要，勿直接采信）

| 本文写法 | 官方规范写法 | 影响 |
|----------|-------------|------|
| 方法名 `mcp.list_tools`、`mcp.call_tool`、`mcp.list_resources`、`mcp.get_resource` | `tools/list`、`tools/call`、`resources/list`、`resources/read` | 照此实现无法与标准 Client 互通 |
| 传输层 HTTP/HTTPS/WebSocket | stdio（本地子进程）与 Streamable HTTP（远端） | WebSocket 非官方传输 |
| 版本 v1.0 / v1.1 / v1.2 / v2.0 | 日期版本号（2024-11-05、2025-03-26、2025-06-18） | 文中版本号查无实据 |
| 架构为「AI Model ↔ MCP Server」两层，把模型当 Client | Host / Client / Server 三角色（Client 是 Host 内部组件） | 会误解 Client 的职责边界 |
| 错误码沿用 HTTP 400/401/403/404 | JSON-RPC 2.0 错误码（-32700 解析错、-32600 无效请求、-32601 方法未找到、-32602 无效参数、-32603 内部错误） | 错误码体系不兼容 |
| 未提 Host 的能力协商 | initialize 握手 + capabilities 协商 | 缺协议入口环节 |

> 结论：本文适合作为**概念入门与设计意图**的读物；真正动手实现应以官方规范与 SDK（[[01-Wiki/entities/FastMCP]]）为准。

## 延伸问题

- MCP 的能力协商（capabilities）在握手阶段究竟交换哪些字段？Server 声明能力后 Client 如何降级适配？
- Resource 与 Tool 的边界在实践中如何把握：读一个数据库表应该做成 Resource 还是带参数的 Tool？
- MCP 的权限模型在协议层只定义了"建议"，真实最小权限落地要靠 Host 还是 Server？（→ [[01-Wiki/concepts/MCP]] 安全误区章节）
- 官方规范中 Sampling / Elicitation 两个反向能力本文完全未提，它们在什么场景下必需？
