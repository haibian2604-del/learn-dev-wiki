---
type: summary
domain: tech
tags: [harness, agent]
created: 2026-08-21
updated: 2026-08-21
sources: ["[[00-Raw/harness/Harness Engineering 完全指南]]"]
status: mature
---

# Harness Engineering 完全指南

> 基于 Claude Code 源码（512K LOC）的 Harness Engineering 全景指南：定义、三大支柱、定量 ROI、10 大设计哲学、竞品对比、从零搭建 Mini Harness。

## 核心观点

- **定义**：Harness Engineering = 设计"环境 / 约束 / 反馈循环 / 基础设施"使 AI Agent 在规模化下可靠运行的工程学科。公式 `Agent = Model + Harness`——模型是未被驯化的马，Harness 是围栏/缰绳/跑道。术语 2026 初由 OpenAI 工程团队正式提出（"用超百万行代码，没有一行是人类写的"）。
- **三大支柱**（工程时间分配）：① Context Engineering（45%，地基）② Architectural Constraints（35%，承重墙）③ Entropy Management（20%，物业维护）。
- **ROI 远超模型优化**：LangChain 仅改 Harness（不换模型），Terminal Bench 2.0 从 52.8% → 66.5%（Top 30 → Top 5）；一个精心设计的 CLAUDE.md 仅需 30 分钟，可将特定项目表现提升 20–40%。模型是"给定的"，Harness 才是可控的。
- **实施层级**：L1 个人（1–2h：CLAUDE.md + pre-commit + 测试）/ L2 小团队（1–2d：AGENTS.md + CI 约束）/ L3 组织（1–2w：自定义中间件 + 可观测性 + 调度 Agent）。

## 关键机制（Claude Code 参考实现，16 章源码级）

| 子系统 | 要点 |
|--------|------|
| Agent Loop | `while(true)` + 7 个 Continue 站点状态机；Async Generator 流式；压缩管道；错误恢复级联 |
| Tool System | 43+ 内置 + MCP 扩展；工具注册表/池；FileEditTool 字符串替换算法；延迟加载 |
| Permission Model | 5 种权限模式 + 7 级规则层级 + YOLO AI 分类器；纵深防御 |
| Hooks System | 26 个事件 × 4 种类型；输入/输出协议；异步 Hook |
| Sandbox & Security | 三大限制维度；路径解析；`dangerouslyDisableSandbox` |
| Context Engineering | CLAUDE.md 持久上下文；四级压缩管道；记忆系统；动态上下文 |
| MCP / Sub-Agent / Skills | 6 种传输协议；5 种 Agent + Swarm；Skills 加载管道 |

## 十大设计哲学（Claude Code）

1. Async Generator 流式架构（边思考边渲染、可中断）
2. 通过 Continue 站点实现状态机（恢复即重试）
3. 编译时特性门控（bun:bundle dead-code-elimination）
4. 缓存前缀稳定性（内置工具作稳定前缀 → prompt cache 不失效）
5. 纵深防御（6 层：CLAUDE.md→Permission→Hooks→YOLO→Sandbox→Hardcoded Denial）
6. 数据驱动可扩展性（settings/agents/skills/hooks 解耦核心代码）
7. 上下文即稀缺资源（延迟加载、记忆预取、四级压缩）
8. 层级化配置覆盖（CLI>Flag>Policy>Managed>Local>Project>User，7 级）
9. 隔离的子 Agent 上下文（子 Agent 空白起步、只返摘要、父级不被污染）
10. 可逆性优先（Edit 字符串替换非 Write 覆盖；undo + 快照）

## 竞品对比（2026 市场份额）

| 维度 | Claude Code | Cursor | GitHub Copilot |
|------|-------------|--------|----------------|
| 运行环境 | 终端 CLI | VS Code fork | VS Code 扩展 |
| 市场份额 | 41% | ~15% | 38% |
| 独有创新 | 编译时门控/六层防御/YOLO/可逆工具/缓存排序 | 代码库索引/8 并行 Agent+worktree | — |

**通用模式**（三者共享）：项目级配置（CLAUDE.md/.cursorrules/copilot-instructions.md）、ReAct 工具循环、权限确认、MCP 支持。

## 论文洞察（OpenDev, arXiv:2603.05344）

- Scaffolding（首次提示前组装）vs Harness（组装后一切）分离
- Dual-Mode 用子 Agent 而非状态机（Plan Mode 作为工具受限子 Agent）
- Defense-in-Depth 五层 vs Claude Code 六层（多出硬编码拒绝）
- Context Pressure 驱动所有下游架构决策

## 与既有知识的联系

- 深化 [[01-Wiki/concepts/Harness Engineering]]（三大支柱 + 10 哲学 + ROI，status 升 mature）
- 参考实现实体：[[01-Wiki/entities/Claude Code]]
- 关联：[[01-Wiki/concepts/上下文工程]]（支柱一）、[[01-Wiki/concepts/Loop Engineering]]（Agent Loop）、[[01-Wiki/concepts/ReAct]]（工具循环）、[[01-Wiki/concepts/MCP]]（扩展边界）、[[01-Wiki/concepts/Agent Skills]]（Skills 系统）

## 延伸问题

- 如何把"三大支柱"映射到团队现有 Agent 系统的审计清单？
- YOLO 两阶段分类器的误报/漏报边界在哪？
