---
type: entity
domain: tech
tags: [agent]
created: 2026-08-26
updated: 2026-08-27
sources: ["https://onefly.top/zero2Agent/"]
status: mature
---

# zero2Agent

> 一个面向工程视角的 AI Agent 开源学习教程系列（站点 onefly.top/zero2Agent），从“最小定义”到 LangGraph 实战，强调先把系统拆成模块、再选框架。

## 定位与特点

- **工程导向**：先讲 Agent 的系统边界、核心模块、API 协议与稳定落地，再引入框架（LangGraph / Agents SDK 等）。
- **反 Demo 思维**：反复强调“Demo 关注能不能动，生产关注会不会坏”——目标写窄、状态设计、工具异常处理、预算与可观测性。
- **跨厂商心智模型**：用 provider-neutral 的 item（开发者指令/用户输入/助手文本/工具请求/工具结果）理解消息，而非死记某家 SDK 类名；迁移厂商不只换字段名，还要查指令位置、工具请求与结果配对、并行/流式编码。

## 子系列

- **learn-agent-basic（基础篇 01-17）**：定义→Workflow 边界→核心组成→稳定性→Tool Calling→记忆→规划反思→单多 Agent→Infra→Loop→评估→Coding Agent→Context Engineering→多模态→自进化→高级 RAG→异步架构
- **learn-agent-training（训练篇 01-07）**：Agent 模型训练全链路——SFT 细节→RL 实战→GRPO/PPO→数据配比→评测→上线部署→训练环境工程

## 本批摄入的 17 篇章节（learn-agent-basic 01-17）

| 章节 | 标题 | 摘要页 |
|------|------|--------|
| 01 | 什么是 Agent | [[01-Wiki/summaries/什么是 Agent]] |
| 02 | Workflow 和 Agent 的区别 | [[01-Wiki/summaries/Workflow 和 Agent 的区别]] |
| 03 | 一个 Agent 系统的核心组成 | [[01-Wiki/summaries/一个 Agent 系统的核心组成]] |
| 04 | 为什么很多 Agent Demo 一落地就不稳定 | [[01-Wiki/summaries/为什么很多 Agent Demo 一落地就不稳定]] |
| 05 | 大模型 API 输入输出与 Tool Calling | [[01-Wiki/summaries/大模型 API 输入输出与 Tool Calling]] |
| 06 | Context、State 与 Memory | [[01-Wiki/summaries/Context、State 与 Memory]] |
| 07 | Planning、Reflection、RAG 分别解决什么问题 | [[01-Wiki/summaries/Planning、Reflection、RAG 分别解决什么问题]] |
| 08 | 单 Agent 和多 Agent 的边界 | [[01-Wiki/summaries/单 Agent 和多 Agent 的边界]] |
| 09 | Agent Infra：从 Harness 到生产环境 | [[01-Wiki/summaries/Agent Infra：从 Harness 到生产环境]] |
| 10 | Loop Engineering：让 Agent 自主迭代直到正确 | [[01-Wiki/summaries/Loop Engineering：让 Agent 自主迭代直到正确]] |
| 11 | Agent 评估：怎么知道你的 Agent 好不好 | [[01-Wiki/summaries/Agent 评估：怎么知道你的 Agent 好不好]] |
| 12 | Coding Agent：最成功的 Agent 落地形态 | [[01-Wiki/summaries/Coding Agent：最成功的 Agent 落地形态]] |
| 13 | Context Engineering：系统化设计模型输入 | [[01-Wiki/summaries/Context Engineering：系统化设计模型输入]] |
| 14 | 多模态与实时交互 Agent | [[01-Wiki/summaries/多模态与实时交互 Agent]] |
| 15 | Agent 自进化：不改权重也能持续变强 | [[01-Wiki/summaries/Agent 自进化：不改权重也能持续变强]] |
| 16 | 高级 RAG 与记忆架构 | [[01-Wiki/summaries/高级 RAG 与记忆架构]] |
| 17 | 异步 Agent 与事件驱动架构 | [[01-Wiki/summaries/异步 Agent 与事件驱动架构]] |

## 本批摄入的 7 篇章节（learn-agent-training 01-07）

| 章节 | 标题 | 摘要页 |
|------|------|--------|
| 01 | Agent SFT 关键细节：从轨迹数据到 Loss Mask | [[01-Wiki/summaries/Agent SFT 关键细节：从轨迹数据到 Loss Mask]] |
| 02 | Agent RL 实战：用强化学习提升推理与决策质量 | [[01-Wiki/summaries/Agent RL 实战：用强化学习提升推理与决策质量]] |
| 03 | GRPO vs PPO：Agent 强化学习算法深度对比与选型 | [[01-Wiki/summaries/GRPO vs PPO：Agent 强化学习算法深度对比与选型]] |
| 04 | 训练数据配比实战：Agent 不只吃轨迹数据 | [[01-Wiki/summaries/训练数据配比实战：Agent 不只吃轨迹数据]] |
| 05 | Agent 评测：怎么衡量你训练出来的 Agent 到底行不行 | [[01-Wiki/summaries/Agent 评测：怎么衡量你训练出来的 Agent 到底行不行]] |
| 06 | 从 SFT 到部署：Agent 模型上线全流程 | [[01-Wiki/summaries/从 SFT 到部署：Agent 模型上线全流程]] |
| 07 | Agent 训练环境工程：从仿真沙箱到数据回流闭环 | [[01-Wiki/summaries/Agent 训练环境工程：从仿真沙箱到数据回流闭环]] |

## 与其他实体的关系

- 框架延伸：[[01-Wiki/entities/LangChain]]、[[01-Wiki/entities/LangGraph]]（系列后续 learn-langgraph 章节）
- 概念基础：[[01-Wiki/concepts/AI Agent]]、[[01-Wiki/concepts/Tool Calling]]、[[01-Wiki/concepts/上下文工程]]、[[01-Wiki/concepts/Harness Engineering]]、[[01-Wiki/concepts/Loop Engineering]]、[[01-Wiki/concepts/Coding Agent]]、[[01-Wiki/concepts/Agent 自进化]]、[[01-Wiki/concepts/异步 Agent 与事件驱动架构]]、[[01-Wiki/concepts/多模态与实时交互 Agent]]、[[01-Wiki/concepts/单 Agent 与多 Agent]]、[[01-Wiki/concepts/Agent 评估]]、[[01-Wiki/concepts/Agent SFT]]、[[01-Wiki/concepts/Agent 强化学习]]、[[01-Wiki/concepts/PPO 与 GRPO]]、[[01-Wiki/concepts/Agent 训练数据]]、[[01-Wiki/concepts/Agent 模型部署]]、[[01-Wiki/concepts/Agent 训练环境]]

## 关联

- 系列主页：https://onefly.top/zero2Agent/
- 同类型教程源：[[01-Wiki/entities/PyLLM]]（LlamaIndex 系列）
