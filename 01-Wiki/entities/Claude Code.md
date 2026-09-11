---
type: entity
domain: tech
tags: [harness, agent]
created: 2026-08-21
updated: 2026-08-27
sources: ["[[01-Wiki/summaries/Harness Engineering 完全指南]]", "[[01-Wiki/summaries/Coding Agent：最成功的 Agent 落地形态]]"]
status: mature
---

# Claude Code

> Anthropic 的终端 AI 编码 Agent，是 Harness Engineering 最完整的开源可分析参考实现（~512K LOC）。

## 是什么

- 运行于终端 CLI 的自主 Agent：2026 年市场份额约 41%，与 Cursor(~15%)、GitHub Copilot(38%) 并称三大 AI 编码 Agent。
- 定位：Harness Engineering 的"教科书级"落地——其源码（main.tsx 脚手架 + query.ts Agent Loop）被《Harness Engineering 完全指南》逐章解剖。

## 关键事实

- **Agent Loop**：`while(true)` + 7 个 Continue 站点的状态机；Async Generator 流式架构（边思考边渲染、可中断）
- **Tool System**：43+ 内置工具 + MCP 扩展；FileEditTool 用字符串替换（非覆盖）实现可逆编辑
- **Permission Model**：5 种权限模式 + 7 级规则层级 + YOLO 两阶段 AI 分类器
- **Hooks System**：26 个生命周期事件 × 4 种类型（Pre/Post/Subagent/Custom）
- **Sandbox**：三大限制维度 + 路径解析 + `dangerouslyDisableSandbox` 逃生阀
- **Context Engineering**：CLAUDE.md 持久上下文 + 四级压缩管道 + 记忆系统
- **MCP / Sub-Agent / Skills**：6 种传输协议；5 种 Agent + Swarm 编排；Skills 加载管道
- **10 大设计哲学**：编译时特性门控、缓存前缀稳定性、纵深防御六层、上下文即稀缺资源、层级化配置覆盖（7 级）、隔离子 Agent 上下文、可逆性优先等（→ [[01-Wiki/summaries/Harness Engineering 完全指南]]）

## 独特创新（vs 竞品）

编译时特性门控（bun:bundle DCE）、六层纵深防御、YOLO AI 权限分类器、可逆工具设计（Edit 替换字符串）、Prompt Cache 稳定性排序。

## 时间线

- 2026-08-21：随《Harness Engineering 完全指南》摄入 wiki，作为 Harness 参考实现实体（来源 ×1）
- 2026-08-27：补《Coding Agent：最成功的 Agent 落地形态》来源（Verification Loop 典型实践：生成代码→跑测试→失败回灌→重生成），链接 Cursor 实体（来源 ×2）

## 相关

- 所属学科：[[01-Wiki/concepts/Harness Engineering]]、[[01-Wiki/concepts/Coding Agent]]
- 关联概念：[[01-Wiki/concepts/上下文工程]]、[[01-Wiki/concepts/Loop Engineering]]、[[01-Wiki/concepts/MCP]]、[[01-Wiki/concepts/Agent Skills]]、[[01-Wiki/concepts/ReAct]]
- 同类 Agent：[[01-Wiki/entities/LangChain]]（同为 Harness 框架）、[[01-Wiki/entities/Cursor]]（竞品，代码库索引 + 8 并行 Agent/worktree）
