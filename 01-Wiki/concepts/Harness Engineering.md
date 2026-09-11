---
type: concept
domain: tech
tags: [agent, harness, llm]
created: 2026-07-31
updated: 2026-08-27
sources: ["[[01-Wiki/summaries/JavaGuide Harness Engineering]]", "[[01-Wiki/summaries/2026 年 AI Agent 技术全景]]", "[[01-Wiki/summaries/时空可组合性编程范式]]", "[[01-Wiki/summaries/Harness Engineering 完全指南]]", "[[01-Wiki/summaries/Agent Infra：从 Harness 到生产环境]]"]
status: mature
---

# Harness Engineering

> 模型之外决定 Agent 表现的整套系统：Agent = Model + Harness。同模型只换接口，编码分数 6.7%→68.3%。

## 定义

Agent = Model（推理+生成）+ Harness（系统提示词、工具调用、文件系统、沙箱、编排逻辑、钩子、反馈回路、约束机制）。模型像 CPU，Harness 像 OS——CPU 再强系统崩也没用。

三个工程层次：Prompt Engineering（怎么说清楚）⊂ Context Engineering（该看什么）⊂ Harness Engineering（怎么持续执行/纠偏/观测/恢复）。

## 机制/原理：六层架构

| 层 | 名称 | 解决什么 | 关键设计 |
|---|---|---|---|
| L1 | 信息边界层 | Agent 该知道/不该知道什么 | 角色与目标定义，无关信息裁剪 |
| L2 | 工具系统层 | 怎么和外部世界交互 | 工具选择、调用时机、结果提炼 |
| L3 | 执行编排层 | 多步骤怎么串联 | 理解→判断→分析→生成→检查 轨道推进 |
| L4 | 记忆与状态层 | 长任务中间结果管理 | 状态/产物/记忆独立管理 |
| L5 | 评估与观测层 | 怎么知道做对了 | 独立于生成的验证机制 |
| L6 | 约束校验与恢复层 | 出错怎么办 | 预设规则拦截、重试/回滚/降级 |

## 从零搭建优先级

文件系统+沙箱（L2）→ 约束规则（L6）→ 记忆（L4）→ 观测（L5）→ 编排（L3）。先"不崩"再"聪明"。

## 边界与常见误区

- 不是"模型不行就换模型"——先看 Harness 是否把模型需要的东西准备好了
- Harness ≠ 框架：是设计哲学，LangChain/Codex/Claude 各有用 Harness 的方式

## 相关概念

- [[01-Wiki/concepts/上下文工程]]（⊂ Harness）
- [[01-Wiki/concepts/Loop Engineering]]（L3 核心实现）
- [[01-Wiki/concepts/ReAct]]（经典执行范式）

## 补充视角：2026 趋势印证

> 来自 [[01-Wiki/summaries/2026 年 AI Agent 技术全景]]：Harness Engineering 崛起列为 2026 Agentic AI 十大趋势之一——OpenAI、Anthropic、Stripe 等一线团队公开工程实践；"决定 Agent 天花板的是 Harness 而非模型本身"与本文定义一致（[[01-Wiki/concepts/AI Agent]]）。

## 补充视角：动态化延伸（论文）

> 来自 [[01-Wiki/summaries/时空可组合性编程范式]]：北大+DeepSeek-AI 论文将 Harness 推向**自进化**——未来 Harness 会在持续服务中生成并部署对自身组件的修改，每次修改都是动态组合实例。论文的 [[01-Wiki/concepts/时空可组合性]]（可逆效应+响应式余效应）提供了组件级安全卸载与依赖协调的形式化基础；[[01-Wiki/entities/Cordis]] 是其元框架实现，Koishi（4000+ 插件）验证可行。

## 补充视角：Claude Code 完全指南（源码级，2026-08-21）

> 来自 [[01-Wiki/summaries/Harness Engineering 完全指南]]（基于 Claude Code ~512K LOC 逐章解剖）：把上述六层架构落到一套可运行 Harness 的完整范式。

### 三大支柱（与六层互补的另一种划分）

| 支柱 | 工程时间占比 | 核心 | 关键动作 |
|------|------|------|----------|
| Context Engineering | 45% | 信息可访问/结构/时机 | CLAUDE.md/AGENTS.md、动态上下文、四级压缩、记忆 |
| Architectural Constraints | 35% | 机械执行的边界 | 权限模型(5模式/7级/AI分类器)、工具 Schema 校验、沙盒隔离、硬编码拒绝 |
| Entropy Management | 20% | 防代码退化 | 死代码检测、文档一致性、约束违规扫描、依赖审计 |

### 定量 ROI（为什么先投 Harness）

- Harness 优化 ROI ≫ 模型优化：LangChain 仅改 Harness，Terminal Bench 2.0 从 52.8% → 66.5%（Top 30 → Top 5）
- 一个 CLAUDE.md 30 分钟 → 特定项目表现 +20–40%；模型微调需数周且任务特定
- 关键洞察：模型是"给定的"，Harness 才是可控杠杆

### 十大设计哲学（Claude Code）

异步生成器流式 · Continue 站点状态机 · 编译时特性门控 · 缓存前缀稳定 · 六层纵深防御 · 数据驱动可扩展 · 上下文即稀缺资源 · 七级配置覆盖 · 隔离子 Agent 上下文 · 可逆性优先（Edit 字符串替换非 Write 覆盖）

### 参考实现与竞品

- 参考实现：[[01-Wiki/entities/Claude Code]]（终端 CLI，2026 份额 ~41%）
- 竞品：Cursor（代码库索引 + 8 并行 Agent+worktree）、GitHub Copilot（反应式 + Agent Mode）；三者通用模式=项目级配置 + ReAct 循环 + 权限确认 + MCP
- 论文支撑：OpenDev arXiv:2603.05344（Scaffolding/Harness 分离、Dual-Mode 用子 Agent 而非状态机、Context Pressure 驱动架构）

## 补充视角：Agent Loop / Harness / Infra 三层边界（zero2Agent 09）

> 来自 [[01-Wiki/summaries/Agent Infra：从 Harness 到生产环境]]

- **Agent Loop**（执行内核）：调模型→分派工具→写回结果→判断继续/停止，不独自承担持久化/权限/安全/治理
- **Harness**（模型外运行体系）：上下文组装、工具暴露与调度、权限约束、结果验证、失败纠正，用 Loop 串起
- **Agent Infra**（生产底座）：承载 Harness，保证任务可恢复/可观测/可扩展/可审计，不替模型决策、不替 Harness 定义工具语义
- **企业级 vs Demo 的本质区别在 Infra 厚度**：合规审计、多租户隔离、成本分摊、故障自愈、灰度发布——Demo 阶段完全不存在，占企业 Infra 70%+ 工作量
- **六层基础设施**：① 运行时调度（Durable Execution——Temporal/Inngest，每 step 自动持久化崩溃恢复）② 工具托管（MCP + Tool Gateway 统一鉴权/限流/路由/审计，风险分级三层+Human-in-the-Loop 审批+审计回溯）③ 状态与记忆持久化（对话/Checkpoint/长期记忆/工具结果缓存/审计日志多层）④ 可观测性（Trace/Metrics/Logs + 成本归因 chargeback + SLA 监控 + 异常行为熔断）⑤ 部署与扩缩（Agent 扩缩信号=并发任务数+排队深度+token 速率，多租户资源隔离）⑥ 治理与合规（版本化+灰度+回滚+A/B、三层合规清单、Guardrails 输入/输出/工具）
- **模型 API 调用生命周期六步**：准备（冻结版本+逻辑调用 ID）→ 发送（分级超时）→ 接收（流归一化内部事件）→ 收口（确认完整+stop reason）→ 验证（结构化输出+权限）→ 落账（延迟/用量/成本归因）。timeout/429/5xx/refusal/truncation/invalid args 分类处理，不能统一"再试一次"；**供应商 request ID ≠ 幂等键**
- **建设节奏**：PoC 只做 Harness → 内部工具加持久化+日志+超时 → 面向用户加可观测性+重试+权限+护栏 → 企业平台加多租户+成本归因+灰度+审计 → 强合规行业全治理层。避免"裸奔上线"与"过度设计"两种极端
