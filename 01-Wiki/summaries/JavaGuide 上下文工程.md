---
type: summary
domain: tech
tags: [context-engineering, agent, llm]
created: 2026-07-31
updated: 2026-07-31
sources: ["[[00-Raw/context-engineering/JavaGuide-上下文工程]]"]
status: growing
---

# JavaGuide · 上下文工程

> JavaGuide 视角的上下文工程实战文章（~1 万字）：用电商售后案例阐述"窗口大不等于效果好"，并给出静态规则、动态信息挂载、Token 预算降级、按需加载四维组装策略 + Compaction/结构化笔记/Sub-agent 三手段。与已有 [[01-Wiki/concepts/上下文工程]] 互补。

## 核心增量（与已有概念页互补）

- **电商售后案例建立直觉**：上下文不足时 Agent 只会套流程反问用户；上下文充足时 Agent 直接定位订单/保修/库存，主动帮用户发起换货——"中等模型+好上下文"胜过"强模型+烂上下文"
- **上下文审计清单**：调用前自查——哪些信息必须有（must-have）、最好有（nice-to-have）、不该有（should-not-have）
- **静态规则 vs 动态信息分离**：角色/约束/输出格式等前置写死；用户信息/检索结果/工具返回等动态注入
- **Token 预算按优先级分配**：核心任务 > 工具描述 > 历史压缩摘要 > 示例。给工具描述设"摘要版+完整版"，默认挂摘要，实际调用时按需展
- **按需加载（JIT）的具体策略**：维护轻量索引而非一次性全文注入；关键词密度控制——上下文过长时自动降级压缩
- **Compaction 触发条件**：不是硬截断，而是检测到"模型开始忽略中间部分"或历史超过预算 X% 时主动压缩
- **条件注入模板**：`if 用户提及{关键词} then 注入{相关规则}` 模式，避免不必要的上下文膨胀

## 与既有知识的联系

- JavaGuide 的上下文组装四维策略（静态/动态/预算/JIT）对应 hello-agents 的 GSSC 流水线（→ [[01-Wiki/concepts/上下文工程]]）
- 上下文审计清单补上了 GSSC 缺失的"不该放进什么"维度
- 条件注入模式与 [[01-Wiki/concepts/Agent Skills]] 的渐进式披露同源
