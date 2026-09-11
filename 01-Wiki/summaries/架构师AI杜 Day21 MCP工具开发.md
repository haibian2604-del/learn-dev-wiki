---
type: summary
domain: tech
tags: [mcp, python]
created: 2026-09-04
updated: 2026-09-04
sources: ["[[00-Raw/mcp/架构师AI杜 Day21 MCP工具开发]]"]
status: growing
---

# 架构师AI杜 Day21 MCP工具开发

> MCP 工具开发的工程手册：设计八原则、Pydantic 参数验证、错误分类、统一结果格式、执行统计、三类实战工具集，以及最关键的**路径白名单与注入防护**。

来源：[[01-Wiki/entities/架构师AI杜]] 系列教程 Day21（weekr.net/ai/day-21）

## 核心观点

- **工具设计八原则**：单一职责、明确接口、错误处理、安全优先、性能优化、可测试性、可扩展性、用户友好。其中"可测试性"与"用户友好（错误信息清晰）"最容易被忽略，却是决定 Agent 能否自我纠偏的关键（→ [[01-Wiki/concepts/Loop Engineering]]）。
- **工具按能力域分八类**：文件、网络、数据、计算、系统、AI、多媒体、其他。命名采用 `域.操作` 前缀（`file.read`、`http.get`、`data.csv.read`），天然支持按前缀分组管理。
- **参数验证是五道闸门**：类型、范围、格式、依赖、安全。用 Pydantic 的 `Field` + `@validator` 实现，声明式、可复用、自动生成 schema。
- **路径遍历必须在参数层拦截**：`file_path` 的 validator 直接拒绝包含 `../` 或 `..\` 的输入——这是文件类工具最常见的致命漏洞。
- **工具错误应该是返回值，不是异常**：`safe_file_read` 逐项检查（存在性 → 体积 → 是否普通文件 → 读权限 → 编码），任何一项不过都返回可读的错误字符串，让模型能读懂并改参数重试。
- **统一结果信封**：`{success, timestamp, data | error}`。一致性比丰富性重要——模型依赖稳定的结构做解析，格式漂移会直接导致 Agent 崩溃。
- **执行统计是工具治理的基础设施**：`EnhancedToolManager` 记录每工具的调用总数、成功数、失败数、累计耗时、最后调用时间。**失败率与耗时是判断"哪个工具该重写或下线"的唯一硬依据**（→ [[01-Wiki/concepts/Agent 评估]]）。
- **安全执行前做三查**：`is_safe_path`（白名单前缀）→ `has_permission`（OS 权限位）→ `is_too_large`（体积上限），任一不过直接拒绝。
- **工具执行八步**：参数验证 → 权限检查 → 资源检查 → 执行准备 → 核心执行 → 结果处理 → 错误处理 → 结果返回。四种执行模式：同步、异步、批量、流式。

## 关键数据

| 指标 | 数值 | 出处 |
|------|------|------|
| 设计原则 | 8 条 | §1.1 |
| 工具分类 | 8 类（文件/网络/数据/计算/系统/AI/多媒体/其他） | §1.2 |
| 参数验证方法 | 5 类（类型/范围/格式/依赖/安全） | §2.2 |
| 工具错误类型 | 7 类（参数/权限/资源/执行/超时/安全/系统） | §3.1 |
| 工具执行流程 | 8 步 | §4.1 |
| 执行模式 | 4 种（同步/异步/批量/流式） | §4.1 |
| 默认最大读取 | 1 MB，上限 10 MB | §2.2 |
| 路径白名单 | `/tmp`、`/var/tmp`、`~/.mcp` | §9.2 |
| 测试类型 | 5 种（单元/集成/端到端/性能/安全） | §8.1 |

技术栈推荐（→ 原文 §10.1）：Python 3.8+ / FastAPI / Pydantic / requests·aiohttp / asyncio / cryptography / pytest / structlog

## 亮点与不足

**亮点**
- **安全章节是全文最有价值的部分**：六类风险（路径遍历、命令注入、网络攻击、数据泄露、资源耗尽、权限提升）+ 八项措施 + 可直接抄的 `is_safe_path` 白名单实现。
- 给出**完整可执行**的三类工具集实现：文件（read/write/list）、网络（http.get/post，带 timeout 与 verify=True）、数据（json_parse / json_stringify / text_process）。
- `EnhancedToolManager` 的执行统计设计，把"可观测性"下沉到工具管理器层，工程价值高。
- 单元测试示例覆盖了成功路径、文件不存在、覆盖写、禁止覆盖四个分支，示范了工具测试该测什么。
- `debug_tool_execution` 装饰器示范了日志埋点的标准姿势（入参、耗时、结果、异常栈）。

**不足**
- 部分示例存在安全隐患：`text_process` 的 `**kwargs` 直接透传、`Tool(func)` 写法里出现 `lambda x: send_email(**eval(x))`——**`eval` 执行模型生成的字符串是典型的命令注入入口**，与本文自己 §9 的安全主张自相矛盾。
- `is_safe_path` 用 `startswith` 做前缀匹配，存在经典绕过：`/tmp_evil/xxx` 会以 `/tmp` 开头通过检查。正确做法是 `os.path.commonpath` 或给 base 补分隔符后比较。
- `os.path.normpath` 会把 `/tmp/a/../../etc/passwd` 规约成 `/etc/passwd` 再判断——本文先 normpath 再匹配，方向正确；但 Windows 下 `..\\` 的处理与盘符大小写仍需额外注意。
- 未涉及工具超时控制与并发上限，而这两项恰恰是"资源耗尽"风险的主要防线。
- 错误处理示例大量返回字符串而非结构化错误码，与 MCP 的结构化错误约定有出入。

## 与既有知识的联系

- **落地** [[01-Wiki/concepts/Tool Calling]]：本文的"工具设计八原则"是该概念页"工具设计五清晰"的工程化展开版——清晰描述、清晰参数、清晰返回、清晰错误、清晰边界。
- **支撑** [[01-Wiki/summaries/JavaGuide MCP]] 的观点："模型在多 MCP 工具间的选择准确度取决于工具描述质量"。本文的 `description` 与 `Field(description=...)` 写法正是这句话的实践。
- **补充** [[01-Wiki/concepts/MCP]] 的工具安全章节：本文的路径遍历防护与白名单机制，可作为"MCP Server 高权限风险"的具体缓解措施。
- **呼应** [[01-Wiki/concepts/Agent 评估]]：执行统计（调用数/失败率/耗时）正是 Agent 可观测性的最小数据集。
- **系列**：上承 [[01-Wiki/summaries/架构师AI杜 Day20 MCP Server开发基础]]，下接 LangChain 工具生态 [[01-Wiki/summaries/架构师AI杜 Day38 LangChain框架上]]。

## 延伸问题

- 工具的 `description` 应该写多长才能既让模型选得准、又不撑爆上下文？（→ [[01-Wiki/concepts/上下文工程]]）
- 面对几十上百个工具，除了前缀分组，是否应该引入工具检索（Tool RAG）按需注入？
- `is_safe_path` 的前缀匹配绕过如何彻底修复？沙箱（容器/seccomp）与白名单哪种更适合 MCP 场景？（→ [[01-Wiki/concepts/Agent 训练环境]] 的沙箱四硬规则）
- 工具执行超时的处理应该返回"部分结果 + 重试句柄"还是直接失败？不同选择对 Agent 循环的影响？

## 速查：安全工具三段式

```python
# 1. 参数层：拒绝路径遍历
@validator('file_path')
def validate_file_path(cls, v):
    if "../" in v or "..\\" in v:
        raise ValueError("文件路径不允许包含上级目录")
    return v

# 2. 执行前：白名单 + 权限 + 体积三查
if not is_safe_path(p):   return err("不安全的文件路径")   # ⚠️ 需改用 commonpath
if not has_permission(p, op): return err("权限不足")
if is_too_large(p):       return err("文件过大")

# 3. 返回层：统一信封，错误也是数据
return {"success": True, "timestamp": ts, "data": {...}}   # 成功
return {"success": False, "timestamp": ts, "error": "..."} # 失败，供模型重试
```
