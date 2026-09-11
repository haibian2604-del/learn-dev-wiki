---
type: summary
domain: tech
tags: [loop-engineering, agent, ai-coding, harness, vibe-coding]
created: 2026-07-31
updated: 2026-07-31
sources: ["[[00-Raw/loop-engineering/Loop Engineering完全指南-muximxc]]"]
status: mature
---

# Loop Engineering 完全指南 — 从概念到实践

> 源：https://muximxc.github.io/loop-engineering-guide/ （系统化的 Loop Engineering 教程，5 章）

## 核心观点

- **定义**：Loop Engineering = 设计一个系统代替你来自动提示 AI 代理；把"手动逐条提示"升级为"持续自动运行的循环"。一个 Loop 是**递归目标**——定义目的，让 AI 迭代执行直到真正完成。
- **三段演化**：Prompt Engineering（2022-24，优化单次指令）→ Agentic Engineering（2024-25，代理能执行操作）→ **Loop Engineering（2026，设计自动运行的系统）**。杠杆点从"单条 Prompt 质量"转移到"系统设计质量"。
- **Open-Loop vs Closed-Loop**：标准自回归 Transformer 是开环（生成即定，从不回头检查，错误累积）；Loop Engineering 把 AI 工作从开环变闭环（执行→观察→调整）。2025 末论文 *Closed-Loop Transformers* 从学术层论证（奇偶校验任务 +8.07%）。
- **与相邻概念辨析**（关键增量）：
  - vs **Vibe Coding**：Loop Engineering 是 Vibe Coding 的"纪律版"——加结构（自动化/验证/记忆/分工）
  - vs **Harness Engineering**：Loop 是 Harness 的具体实现；`Agent = Model + Harness`，Loop 是"运行在定时器上的 Harness"
  - vs **Agentic Engineering**：Loop 是其子集，专注"循环"这一特定模式

## 六大核心组件（+ 记忆存储）

1. **Automations**（心跳）：`/loop`（定时）、`/goal`（可验证停止条件，独立检查模型避免自评）、Hooks、GitHub Actions
2. **Worktrees**：Git 多工作目录隔离，多代理并行不冲突
3. **Skills**：项目知识编码，`SKILL.md` + 渐进式披露（只加载名称/描述，需要时加载全文）
4. **Plugins/Connectors**：MCP 标准接入真实世界（JIRA/DB/Slack/Sentry）
5. **Sub-agents**：制造者/检查者分离；Explorer/Implementer/Tester/Reviewer 按角色分模型
6. **Memory**：跨会话持久化（`AGENTS.md`/`TODO.md`，或同步 Linear/JIRA/DB）

## 5 个实战案例

每日晨间 Triage、CI 修复（/goal 验证循环）、依赖更新（风险分级）、文档同步（Hook+MCP）、代码质量监控（指标驱动）。

## 反模式与成本

- **3 反模式**：循环过复杂（>10 子代理嵌套）、验证条件太弱（"看起来没问题"）、忽视 Token 成本
- **成本策略**：模型分层（探索轻量/实现主力/审查强，省 60-80%）、频率控制、条件触发、上下文压缩、预算上限

## 既有联系

- 这是 [[01-Wiki/concepts/Loop Engineering]] 最系统的来源；与 [[01-Wiki/concepts/Harness Engineering]]（子集关系）、[[01-Wiki/concepts/MCP]]（Connectors 标准）、[[01-Wiki/concepts/Agent Skills]]（Skills 渐进披露同源）、[[01-Wiki/concepts/ReAct]]（经典循环范式）互证
- 补充视角见 [[01-Wiki/summaries/Loop Engineering深度解析]]（Addy Osmani 原始思想）

## 延伸问题

- Closed-Loop Transformers 与 Test-Time Training（TTT）如何在模型层实现闭环？
- 认知投降（cognitive surrender）如何在实际团队中防范？
