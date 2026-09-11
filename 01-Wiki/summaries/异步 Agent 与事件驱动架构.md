---
type: summary
domain: tech
tags: [agent]
created: 2026-08-27
updated: 2026-08-27
sources: ["[[00-Raw/agent-engineering/异步 Agent 与事件驱动架构]]"]
status: mature
---

# 异步 Agent 与事件驱动架构（zero2Agent 基础 17）

> 从同步请求-响应到异步执行、事件触发和安全隔离的工程演进——当工具执行时间远超模型推理时间时，Agent 架构需要怎样演进。

## 同步模型 vs 异步现实的矛盾

LLM 训练范式与 Tool Calling 协议都是同步设计，隐含假设"工具执行是瞬时的"。现实：代码搜索 1-5s 可接受、CI 构建 3-15 分钟（GPU 空转+连接超时）、人工审批 10 分钟-数小时（不可接受）、大数据处理/模型训练数小时-数天（不可能同步等待）。

矛盾本质：**LLM 是无状态函数调用，但异步工具要求系统有持久状态记住"我在等什么"和"等到了之后该做什么"**。

## 三种异步执行模式

1. **取消-重提交模式（Cancellation-based）**：发起长任务后 Agent 挂起，任务完成重新构建 Context 恢复推理。要点：Context 序列化（完整保存 messages/system prompt/工具定义，恢复时原样加载）、幂等设计（工具侧幂等校验防重复触发）、超时兜底（超时注入 tool_result:"timeout" 让模型决定）。适合：单个长工具调用、审批流、CI 触发。
2. **队列模式（Queue-based）**：Agent 不直接调工具，写任务入队列，独立 Worker 消费执行、回调送回结果。优势：解耦（Agent 不需知道 Worker 数量/位置/负载）、Worker 独立扩缩、Queue 天然背压。适合：批量操作、多步工作流并行子任务、高并发需限流背压。
3. **并发模式（Parallel）**：多个独立工具调用同时发出全部完成（或部分超时）后统一处理。用 asyncio.gather/Promise.all。关键决策：超时策略——全部等齐还是"够用就走"（3 源返回 2 个就开始推理）。

| 维度 | 取消-重提交 | 队列 | 并发 |
|------|-----------|------|------|
| 适用 | 单个长任务 | 批量/多步 | 多源信息收集 |
| 复杂度 | 中（Context 持久化） | 高（队列+Worker+回调） | 低（语言原生） |
| 资源效率 | 高（挂起不占资源） | 高（Worker 独立扩缩） | 中（并发占连接） |
| 故障恢复 | 需 checkpoint | 队列天然重试 | 单个失败可降级 |

## 事件驱动 Agent

前面三种模式仍由用户请求触发；事件驱动更进一步：**外部事件本身就是触发条件**，不需用户主动请求。

核心组件：Event Source（webhook/定时器/数据库 CDC）→ Event Bus（Kafka/NATS/Redis Streams/SQS）→ Event Router（过滤/路由/去重）→ Agent Dispatcher（选实例/注入上下文/启动）→ Execution Runtime（Temporal/K8s Job/Lambda）。

典型场景：PR 提交→自动触发 Code Review Agent（webhook→路由匹配 repo+X.py→注入 PR diff→审查写回 PR comment）；监控告警→诊断 Agent；Cron 定时→数据分析 Agent。

**与 Workflow 编排的区别**：Workflow 预定义 DAG/确定性执行路径/适合固定步骤 ETL；事件驱动 Agent 响应式启动/LLM 动态决策/适合需推理的开放性任务。不互斥——Workflow 管宏观流程，需推理节点委托 Agent。

## 连续时间推理（Continuous-time Reasoning）

同步训练的 LLM "思考"与"等待"不能同时进行。核心技巧：
- **预生成后续步骤**：等待 Tool A 时让模型基于已有信息预生成"如果 CI 成功/失败下一步做什么、现有 lint warning 能否先处理"。注意预推理结果不一定能用（实际结果与预期有差异时丢弃重新推理）。
- **等待状态注入**：Context 中注入时间感知快照（正在执行的异步任务/已完成任务/你可以：基于已完成结果继续规划、预判可能结果准备应对、执行不依赖等待任务的工作）。
- **Speculative Execution** 实现模式。

## Safety Sidecar 模式

串行安全检查累积延迟不可忽视（每次 350ms × 几十次工具调用 = 数秒）。**Sidecar 并行架构**：Agent 主线程与 Safety Sidecar 并行启动，在执行前汇合；Sidecar 判断快于工具执行准备阶段则不增加延迟。

判断维度：Intent Classification（意图与用户原始请求一致）、Parameter Risk（参数安全范围）、Context Anomaly（调用链偏离正常模式）、Rate Anomaly（频率异常）。Sidecar 实现：规则引擎 <5ms / 轻量 LLM 50-100ms（如 Haiku 级）。

## 工具执行的安全隔离（三层）

| 维度 | OS 级 | 容器级 | microVM 级 |
|------|-------|--------|-----------|
| 启动时间 | 无 | 100ms-1s | 1-5s |
| 隔离强度 | 弱（共享内核） | 中（namespace） | 强（独立内核） |
| 逃逸风险 | 高 | 中 | 低 |
| 适合 | 只读查询/计算型 | 文件读写/网络请求 | 任意代码/不可信插件 |
| 实现 | seccomp/AppArmor | Docker/gVisor | Firecracker/Cloud Hypervisor |

决策树：执行用户代码→microVM；有网络/文件副作用→容器级；纯计算/只读→OS 级。实践：工具打"信任标签"（trust_level + isolation + resource_limits，如 run_python 用 microVM + cpu/memory/timeout/network 限制）。

## 异步系统的可观测性挑战

同步 trace 是连续线，异步 trace 被时间打断（span 相隔几分钟到几小时但逻辑同一任务）。**核心方案：Correlation ID**——每个异步任务发起时生成唯一 correlation_id 贯穿生命周期。区分 wall_time（用户视角总等待）与 compute_time（实际消耗计算资源），对成本归因至关重要。

事件驱动特有挑战：DLQ 深度监控+人工审查、事件乱序（时间戳+序列号排序）、重复投递（at-least-once→event_id 去重幂等）、事件风暴（限流+背压+采样降级）、因果链丢失（caused_by 字段构建因果图）。

必监控指标：排队深度、排队时长 P95、执行成功率（按工具分组）、端到端延迟分布、事件吞吐量、事件处理延迟 P95、DLQ 深度、Agent 触发频率与成功率。

## 关联

- 概念：[[01-Wiki/concepts/AI Agent]]、[[01-Wiki/concepts/异步 Agent 与事件驱动架构]]、[[01-Wiki/concepts/Harness Engineering]]、[[01-Wiki/concepts/Tool Calling]]
- 摘要：[[01-Wiki/summaries/Agent Infra：从 Harness 到生产环境]]
- 系列：[[01-Wiki/entities/zero2Agent]]
