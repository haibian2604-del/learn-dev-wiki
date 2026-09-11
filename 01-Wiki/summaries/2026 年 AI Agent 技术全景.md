---
type: summary
domain: tech
tags: [agent]
created: 2026-08-01
updated: 2026-08-01
sources: ["[[00-Raw/agent-frameworks/2026 年 AI Agent 技术全景：12 大主流框架深度解析与架构演进趋势]]"]
status: growing
---

# 2026 年 AI Agent 技术全景：12 大主流框架深度解析与架构演进趋势

> 系统梳理 AI Agent 核心架构（6 大模块 + 3 大协议）、12 大主流框架横评与 2026 年 Agentic AI 十大趋势。

## 核心观点

- **定义**：AI Agent = 感知环境、处理信息、主动行动达成目标的软件系统；Google 定义 = 先进模型 + 工具访问权限 + 人类控制。与传统 AI 四维区别：被动→主动、单轮→多步规划+工具、无状态→长期记忆、全程控制→监督下自主（→ [[01-Wiki/concepts/AI Agent]]）
- **2026"Agent 元年"三因**：模型能力成熟（工具调用）、工程框架完善、企业从 POC 转生产
- **核心架构 6 大模块**：感知层 → 核心 LLM（语义理解/目标编码）→ 推理与规划 → 记忆体系（短期上下文 + 长期向量库）→ 技能与工具 → 执行与反馈（验证/自我修正/人类反馈）
- **3 大核心协议**：MCP（LLM↔工具，AI 的 USB-C）、A2A（Agent↔Agent，Agent 界的 HTTP）、Skills（延迟加载 sub-agent，插件 2.0）（→ [[01-Wiki/concepts/MCP]]、[[01-Wiki/concepts/Agent Skills]]）

## 关键数据

| 框架 | Stars | 定位 | 最佳场景 |
|------|-------|------|----------|
| LangChain | 106k | 生态最丰富 | 通用首选（→ [[01-Wiki/entities/LangChain]]） |
| AutoGen | 43.1k | 微软企业级多 Agent | 企业级多 Agent/复杂编排（→ [[01-Wiki/entities/AutoGen]]） |
| Semantic Kernel | 25k | 微软多语言 | .NET/Java 企业 |
| LlamaIndex | 40.9k | 企业数据检索 | RAG/知识库（→ [[01-Wiki/entities/LlamaIndex]]） |
| CrewAI | 30k | 团队协作双模式 | 快速搭建团队（→ [[01-Wiki/entities/CrewAI]]） |
| Langflow | 54.9k | 低代码可视化 | 非技术背景快速验证 |
| OpenAI Agents SDK | 8.6k | 三原语（Agents/Handoffs/Guardrails） | OpenAI 生态生产 |
| PydanticAI | 8.4k | 类型安全 | 高类型安全生产 |

趋势关键点：上下文超 40% 窗口性能显著下降；MCP 使第三方工具集成成本降 80%；Prompt Injection 成新考点（三层防护：输入验证/沙箱/输出过滤）。

## 亮点与不足

- 亮点：一张选型表覆盖 8 框架"上手难度/生产就绪/生态/最佳场景"；10 大趋势分技术/工程/安全/落地四维
- 不足：12 框架中 4 个（Hermes/Rowboat/Multica/Superpowers）只有简介无技术细节；Star 数随时间漂移；选型建议偏泛

## 与既有知识的联系

- 支持 [[01-Wiki/concepts/Harness Engineering]]：趋势明确提出"Agent = Model + Harness，决定天花板的是 Harness"
- 支持 [[01-Wiki/concepts/上下文工程]]：40% 阈值现象佐证上下文管理关键性
- 补充 [[01-Wiki/concepts/MCP]]：MCP 在 3 协议生态中的定位（与 A2A/Skills 并列）
- 与 [[01-Wiki/summaries/JavaGuide Harness Engineering]]、[[01-Wiki/summaries/第 20 章 MCP 模型上下文协议]] 互相印证

## 延伸问题

- A2A 协议与 MCP 的边界/协作方式（待深挖）
- 2026 新兴框架（Hermes Agent/Superpowers）与既有概念的方法论对比
