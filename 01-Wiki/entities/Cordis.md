---
type: entity
domain: tech
tags: [harness, agent]
created: 2026-08-15
updated: 2026-08-15
sources: ["[[01-Wiki/summaries/时空可组合性编程范式]]"]
status: seedling
---

# Cordis

## 是什么

时空可组合性（[[01-Wiki/concepts/时空可组合性]]）的元框架实现（TypeScript）：提供 effect 追踪与 coeffect 解析的核心库，以及声明式组件加载器（配置对账 + 热模块替换）。是 Koishi 聊天框架的底层（→ [[01-Wiki/entities/Koishi]]）。

## 关键事实

- **定位**：meta-framework——只规定效应/余效应如何组合，把其含义留给每个应用，语言无关
- **核心库**：context 原语承载全部修改（`ctx.set/get`、Proxy 实现依赖注入式访问）；每次 context 变更生成 `dispose` 闭包供回收
- **组件加载器**：声明式配置 + 配置对账 + 热模块替换（HMR）
- **事务性模块重载**：先备份缓存 → 导入新模块 → 失败则恢复缓存并回滚到旧组件，保证系统永不进入"半重载"状态
- **版本**：论文呈现 Cordis v4（精化 effect/coeffect 语义、重设计加载器）；Koishi 当前用 v3，核心组合模型两版共享
- **边界**：效应是否可逆由系统边界决定（位置在内=可独占修改并恢复、被追踪；在外=不追踪不恢复）

## 时间线（如适用）

- 2026-08：北大+DeepSeek-AI 论文《A Programming Paradigm for Spatiotemporal Composability》呈现 v4（→ [[01-Wiki/summaries/时空可组合性编程范式]]）

## 相关

- 相关概念：[[01-Wiki/concepts/时空可组合性]]、[[01-Wiki/concepts/Harness Engineering]]
- 相关实体：[[01-Wiki/entities/Koishi]]（建立在 Cordis 上的聊天框架）
