---
type: concept
domain: tech
tags: [agent, protocol, multi-agent]
created: 2026-09-11
updated: 2026-09-11
sources: ["[[01-Wiki/summaries/AI Agent 面试题库 - Agent 核心篇]]"]
status: seedling
---

# A2A 协议（Agent2Agent）

## 定义

- Google 于 2025 年提出的**跨厂商、跨框架的 Agent 互操作协议**，目标是让不同团队、不同公司、用不同技术栈构建的 Agent 能够**互相发现与协作**。
- 与 [[01-Wiki/concepts/MCP]] 的分工是本页最该记住的一句：

> **MCP 解决 `Agent ↔ 工具/资源`（纵向接入）；A2A 解决 `Agent ↔ Agent`（横向协作）。**

## 机制/原理

### 一、核心概念

| 概念 | 作用 |
|------|------|
| **Agent Card** | Agent 的"能力名片"，供其他 Agent 发现其技能与端点 |
| **Task** | 任务及其生命周期状态（提交 / 进行 / 完成 / 失败） |
| **Message / Part** | 消息载体，Part 支持多模态片段 |
| **Artifact** | 任务产出物 |

- 传输：基于 **HTTP / JSON-RPC**，配合 **SSE** 做流式
- 设计取向：**对等（peer-to-peer）** 通信，而非主从调用

### 二、与普通 Agent 框架的根本区别（Q10 的关键不同点）

| | 普通 Agent 框架（LangChain / LlamaIndex 等） | A2A |
|---|---|---|
| 解决的问题 | **一个 Agent 内部怎么干活**：LLM + 工具 + 记忆的编排 | **Agent 与 Agent 之间怎么说话**：跨边界的通信协议 |
| 类比 | 类内部的方法 | HTTP / RPC 契约 |
| 边界 | 单体应用内部架构 | 分布式系统间的接口标准 |

一句话：**普通框架是"单体应用内部架构"，A2A 是"分布式系统间的接口标准"。**

### 三、价值

- 若没有统一协议，N 个 Agent 互相调用需要 **N×N 个适配器**；A2A 把它降为 **N+N**
- 让多 Agent 从"公司内的玩具"走向"跨组织生态"

## 例子

**跨公司行程规划**：
- 用户的旅行 Agent（团队 A，LangGraph 实现）需要查航班
- 航司 Agent（团队 B，自研框架）发布 **Agent Card** 声明"可查询航班与余票"
- 旅行 Agent 发现后提交 **Task** → 航司 Agent 执行 → 返回 **Artifact**（航班列表）
- 双方**不需要知道对方的框架与内部实现**，只依赖 A2A 契约

## 边界与常见误区

- ⚠️ **A2A 不是 Agent 框架**：它不提供规划、记忆、工具调用能力，只提供通信契约——不要拿它和 LangGraph 对比选型
- ⚠️ **A2A 与 MCP 互补而非竞争**：一个 Agent 可以同时"用 MCP 接工具"和"用 A2A 找伙伴"
- **生态现状**：规范较新，落地案例与工具链仍在早期，本页 status 保持 `seedling`
- **安全前提**：跨组织调用会引入**信任边界**问题（对方 Agent 是否可信、如何鉴权与审计），协议本身不解决（→ [[01-Wiki/concepts/Agent 安全与对齐]]）

## 相关概念

- [[01-Wiki/concepts/MCP]]、[[01-Wiki/concepts/多模态与实时交互 Agent]]、[[01-Wiki/concepts/单 Agent 与多 Agent]]、[[01-Wiki/concepts/Agent Skills]]
- [[01-Wiki/summaries/2026 年 AI Agent 技术全景]]（三协议 MCP / A2A / Skills 全景）
- [[01-Wiki/summaries/AI Agent 面试题库 - Agent 核心篇]]
