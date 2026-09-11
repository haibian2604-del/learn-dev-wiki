---
type: summary
domain: tech
tags: [agent, harness]
created: 2026-08-27
updated: 2026-08-27
sources: ["[[00-Raw/agent-engineering/Agent Infra：从 Harness 到生产环境]]"]
status: mature
---

# Agent Infra：从 Harness 到生产环境（zero2Agent 基础 09）

> Agent 跑起来之后，还需要哪些基础设施才能上线——企业级 Agent 与个人 Demo 的本质区别不在模型能力，而在 Infra 的厚度。

## 三层边界

| 层次 | 负责什么 | 不负责什么 |
|------|---------|-----------|
| Agent Loop | 推进状态转换：调模型、分派工具、写回结果、判断继续/停止 | 不独自承担持久化、权限、安全与治理 |
| Harness | 模型外管理上下文、工具、约束、验证与纠正，用 Loop 串起来 | 不提供集群调度、存储和租户隔离 |
| Agent Infra | 承载 Harness，保证任务可恢复、可观测、可扩展、可审计 | 不替模型做任务决策，不替 Harness 定义工具语义 |

"下一步是否调用工具"由模型给出候选决策；Harness 验证并执行；Loop 推进流程；Infra 保证流程不因进程故障/流量峰值/依赖异常失控。

## 模型 API 是一次调用的生命周期（六步）

1. **准备**：冻结上下文、工具定义与约束版本，分配内部逻辑调用 ID 与 attempt 序号
2. **发送**：设置连接/首包/读取/总时限，取消信号与总 deadline 传到底层客户端
3. **接收**：供应商流事件转内部事件，按内容块/工具调用分别累积
4. **收口**：确认流正常结束，记录 stop reason 与最终 usage；半截内容不能冒充完整响应
5. **验证**：校验结构化输出与工具参数，重做权限/业务/安全检查
6. **落账**：记录延迟、用量、成本归因与终态，Loop 决定结束/纠正/重试/转人工

流式响应最好归一化为内部事件（调用开始/内容增量/工具参数增量/用量更新/调用完成/调用失败），不依赖某家供应商事件名。

## 先分类再决定是否重试

| 终态/故障 | 默认处理 |
|-----------|---------|
| timeout/连接中断 | deadline 与重试预算内有限重试，丢弃未验证半截结果 |
| cancelled | 控制信号，传播取消，除非明确恢复否则不自动重试 |
| 429/限流 | 先读错误码/错误体/重试提示；瞬时限流退避重试，配额/余额耗尽快速失败告警 |
| 5xx | 有上限退避重试，连续失败熔断或降级 |
| refusal | 语义结果，不盲目重试；改写任务或转人工 |
| truncation | 标为不完整，续写/压缩上下文/重新规划，不当最终答案 |
| invalid tool args | 绝不执行，精确校验错误反馈给 Loop，允许有限纠正 |

重试必须有边界：最大尝试次数 + 总 deadline + token/成本预算 + 熔断阈值共同生效。**内部逻辑调用 ID 保持不变、每次 attempt 单独记录；供应商 request ID 用于排障关联，≠ 幂等键**。非幂等操作（发消息/扣款/建资源）只有在端到端业务操作 ID + 消费者去重 + 可查询执行台账时才可自动重试；工具已成功而后续模型调用失败时，从 checkpoint 复用已持久化结果，不重跑整个 Loop。

## 六层基础设施

1. **运行时调度**：分级超时（幂等/非幂等）、wall-clock timeout + token budget + 成本熔断三重保险、per-tenant 并发槽位、异步长任务任务队列 + Webhook。**企业级关键：Durable Execution**（Temporal/Inngest）——每 step 自动持久化，进程崩溃从断点恢复。
2. **工具托管（MCP + Tool Gateway）**：Agent → Gateway（鉴权/限流/路由/审计）→ MCP Server。企业级：中心化 Tool Registry、RBAC+scope+动态授权、结果脱敏字段裁剪、高危操作 Human-in-the-Loop 审批。**MCP 真正价值**：安全团队可在 Gateway 层统一策略，工具实现/Agent 实现/安全策略三者解耦。
   - **风险分级三层**：工具级别（delete_record 固有高风险）→ 参数级别（send_email to=external 高风险）→ 上下文级别（会话累积行为升级）。评分：`risk_score = tool_base + param + context + time`，≥80 多人审批 / ≥50 单人 / ≥20 执行+通知 / 其余静默。
   - **审批挂起**：checkpoint + 事件驱动恢复而非长轮询；审批超时可配置 SLA 自动升级/拒绝；恢复时重新验证前置条件；审批上下文由 LLM 生成结构化摘要（操作/风险等级/请求时间/上下文摘要/影响范围）；防审批疲劳（秒批降级、批量+抽检 10%、审批质量监控、职责分离、时间窗口）。
   - **审计**：每次审批完整记录（request_id/agent_id/tenant/action/risk_score/approver/decision/execution_result），事故回溯链：谁创建 Agent → 为什么决策 → 谁审批 → 审批看到什么。
3. **状态与记忆持久化**：对话历史（PostgreSQL+加密+GDPR 删除权）、Checkpoint（对象存储/KV，版本回溯）、长期记忆（向量库+关系库，租户隔离）、工具结果缓存（分布式缓存+TTL）、审计日志（append-only）。多租户严格隔离（逻辑 where tenant_id=？/ 物理独立实例）。
4. **可观测性（Trace/Metrics/Logs）**：三大信号；企业级成本归因分摊（按租户/Agent 计量 chargeback）、SLA 监控（P50/P95/P99，违约自动降级）、异常行为检测（连续失败熔断、token 超阈值终止、同参数重复调用检测循环）。工具：LangSmith/Langfuse/Arize Phoenix/OpenTelemetry。
5. **部署与扩缩**：Agent 服务请求秒到分钟级、内存随迭代增长、扩缩信号=并发任务数+排队深度+token 速率（非 QPS/CPU）。模式：常驻+Temporal / K8s+HPA（基于队列深度自定义 scaler）/ Serverless+状态外置。多租户资源隔离：并发上限、token 预算、频率限制、单任务时长。
6. **治理与合规**：版本管理（prompt hash + tool set hash + model version 不可变版本号）、灰度发布（5% 流量）、秒级回滚、A/B 测试；数据/操作/模型三层合规清单；Guardrails 输入（prompt injection/越权）/输出（有害内容/PII 泄露）/工具（SQL 注入/路径穿越）。

## 个人 vs 企业全景对比

运行时（单进程 vs Durable Execution）/ 工具（硬编码 vs MCP+Gateway+RBAC+审批）/ 状态（内存数组 vs 多层持久化+加密+租户隔离）/ 可观测（print vs 分布式 trace+成本归因+SLA）/ 部署（本地 vs K8s/Temporal+灰度）/ 治理（无 vs 版本+合规+Guardrails）/ 故障（重跑 vs checkpoint+熔断+降级）/ 成本（信用卡 vs per-tenant 预算+chargeback）。

## 什么阶段该关心什么

PoC/Demo 只做 Harness；内部工具加状态持久化+基础日志+超时；面向用户产品加可观测性+重试+权限+输出护栏；企业平台加多租户+成本归因+灰度+审计；强合规行业全治理层。

两种极端错误：**裸奔上线**（无 Infra 直接部署，死循环一晚烧几千美元）/ **过度设计**（PoC 阶段花三个月搭 Infra）。正确节奏：最简 Harness 验证逻辑 → 按规模与合规逐层加固。

## 关联

- 概念：[[01-Wiki/concepts/Harness Engineering]]、[[01-Wiki/concepts/Loop Engineering]]、[[01-Wiki/concepts/AI Agent]]、[[01-Wiki/concepts/MCP]]
- 系列：[[01-Wiki/entities/zero2Agent]]
