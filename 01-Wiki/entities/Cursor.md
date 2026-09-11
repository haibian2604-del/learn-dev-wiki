---
type: entity
domain: tech
tags: [agent]
created: 2026-08-27
updated: 2026-08-27
sources: ["[[01-Wiki/summaries/Coding Agent：最成功的 Agent 落地形态]]", "[[01-Wiki/summaries/Harness Engineering 完全指南]]"]
status: growing
---

# Cursor

> 代码库索引驱动的 AI 编码 Agent（IDE 形态），Coding Agent 落地最成功梯队之一，与 [[01-Wiki/entities/Claude Code]]、GitHub Copilot Workspace、Windsurf 并列。

## 定位与特点

- 2026 年 AI 编码 Agent 市场三大梯队之一（Claude Code ~41%、GitHub Copilot ~38%、Cursor ~15%）。
- **代码库索引**是核心差异化：为整个仓库建立语义索引，实现 Read-Understand-Edit 模式——Agent 先定位相关文件再精确修改，而非全仓塞入 Context（→ [[01-Wiki/concepts/Coding Agent]] 的 Context 选择挑战）。
- **8 并行 Agent + worktree**（来自 [[01-Wiki/summaries/Harness Engineering 完全指南]] 竞品对比）：用 git worktree 并行跑多个 Agent 互不冲突。
- 与 Claude Code / Copilot 的通用模式：项目级配置 + ReAct 循环 + 权限确认 + MCP。

## 关键事实

- IDE 形态 vs Claude Code 终端 CLI 形态——产品形态差异是 Coding Agent 设计的重要变量
- 属于"代码是创造工具的工具"的成功商业验证：数亿开发者用户证明 Verification Loop + 结构化上下文模式可规模化

## 时间线

- 2026-08-27：随《Coding Agent：最成功的 Agent 落地形态》摄入 wiki（来源 ×2：Coding Agent 摘要 + Harness 完全指南摘要）

## 相关

- 所属学科：[[01-Wiki/concepts/Coding Agent]]、[[01-Wiki/concepts/Harness Engineering]]
- 同类：[[01-Wiki/entities/Claude Code]]（终端 CLI 形态，Harness 参考实现）
- 关联概念：[[01-Wiki/concepts/Loop Engineering]]（Verification Loop 实践）
