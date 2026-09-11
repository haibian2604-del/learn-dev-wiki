---
type: concept
domain: tech
tags: [agent]
created: 2026-08-27
updated: 2026-09-11
sources: ["[[01-Wiki/summaries/异步 Agent 与事件驱动架构]]", "[[01-Wiki/summaries/开发岗专项面试题库]]"]
status: growing
---

# 异步 Agent 与事件驱动架构

## 定义与动机

当工具执行时间远超模型推理时间（CI 构建 3-15 分钟、人工审批数小时、ETL 数天）时，Agent 架构的演进方案。矛盾本质：**LLM 是无状态函数调用（同步设计），但异步工具要求系统有持久状态记住"我在等什么"和"等到了之后该做什么"**。

## 三种异步执行模式

1. **取消-重提交（Cancellation-based）**：发起长任务后 Agent 挂起，完成后重新构建 Context 恢复推理。要点：Context 序列化（完整保存 messages/system prompt/工具定义原样加载）、幂等设计、超时兜底（注入 tool_result:"timeout" 让模型决定）。适合单个长工具调用/审批流/CI 触发。
2. **队列模式（Queue-based）**：任务写队列，独立 Worker 消费执行、回调送回。优势：解耦（Agent 不需知道 Worker 数量/负载）、Worker 独立扩缩、Queue 天然背压。适合批量操作/并行子任务/高并发。
3. **并发模式（Parallel）**：多个独立工具调用同时发出全部完成（或部分超时）后统一处理。asyncio.gather/Promise.all。关键决策：全部等齐还是"够用就走"。

## 事件驱动 Agent

外部事件本身就是触发条件，不需用户主动请求。核心组件链：Event Source（webhook/定时器/CDC）→ Event Bus（Kafka/NATS/SQS）→ Event Router（过滤/路由/去重）→ Agent Dispatcher（选实例/注入上下文/启动）→ Execution Runtime（Temporal/K8s Job/Lambda）。

典型：PR 提交自动触发 Code Review Agent、监控告警触发诊断 Agent、Cron 触发数据分析 Agent。

**与 Workflow 编排的区别**：Workflow 预定义 DAG 确定性路径适合固定步骤；事件驱动响应式启动、LLM 动态决策适合开放性任务。不互斥——Workflow 管宏观流程，需推理节点委托 Agent。

## 连续时间推理（Continuous-time Reasoning）

同步 LLM"思考"与"等待"不能同时进行。技巧：**预生成后续步骤**（等待 Tool A 时预生成"CI 成功/失败分别下一步做什么"——注意预推理结果不一定能用，实际与预期不符时丢弃重推）；**等待状态注入**（Context 注入时间感知快照：正在执行任务/已完成任务/可做的独立工作）；Speculative Execution 实现模式。

## Safety Sidecar 模式

串行安全检查累积延迟不可忽视（350ms × 几十次工具调用）。**Agent 主线程与 Safety Sidecar 并行启动，执行前汇合**——Sidecar 判断快于工具准备阶段则不增延迟。判断维度：Intent Classification（意图与用户请求一致）、Parameter Risk（参数安全范围）、Context Anomaly（调用链偏离）、Rate Anomaly（频率异常）。实现：规则引擎 <5ms / 轻量 LLM 50-100ms。

## 工具执行的安全隔离（三层）

- **OS 级**（seccomp/AppArmor）：只读查询/计算型，无开销但共享内核逃逸风险高
- **容器级**（Docker/gVisor）：文件读写/网络请求，100ms-1s 启动
- **microVM 级**（Firecracker/Cloud Hypervisor）：任意代码/不可信插件，独立内核 1-5s 启动

决策树：执行用户代码→microVM；有网络/文件副作用→容器级；纯计算/只读→OS 级。实践：工具打信任标签（trust_level + isolation + resource_limits：cpu/memory/timeout/network）。

## 异步可观测性

同步 trace 是连续线，异步 trace 被时间打断（span 相隔几分钟到几小时但逻辑同一任务）。**核心方案：Correlation ID**（发起时生成唯一 ID 贯穿生命周期）。区分 wall_time（用户视角总等待）与 compute_time（实际消耗算力），对成本归因至关重要。

事件驱动特有挑战：DLQ 深度监控、事件乱序（时间戳+序列号）、重复投递（at-least-once→event_id 去重幂等）、事件风暴（限流+背压+采样降级）、因果链丢失（caused_by 字段构建因果图）。

## 关联

- 上游：[[01-Wiki/concepts/AI Agent]]、[[01-Wiki/concepts/Harness Engineering]]、[[01-Wiki/concepts/Tool Calling]]
- 实战来源：[[01-Wiki/summaries/异步 Agent 与事件驱动架构]]
- 相关：[[01-Wiki/concepts/Loop Engineering]]、[[01-Wiki/concepts/Workflow Graph]]
- 补充：[[01-Wiki/summaries/开发岗专项面试题库]]（一-Q3 流式 RAG 系统、二-Q9 流式处理 SSE vs WebSocket 与背压）
