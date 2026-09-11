---
type: summary
domain: tech
tags: [agent, loop-engineering]
created: 2026-08-27
updated: 2026-08-27
sources: ["[[00-Raw/loop-engineering/Loop Engineering：让 Agent 自主迭代直到正确]]"]
status: mature
---

# Loop Engineering：让 Agent 自主迭代直到正确（zero2Agent 基础 10）

> Agent 执行循环中的自我纠错、退出判断与防护设计——关注"循环本身的工程设计"：什么时候再来一轮、什么时候停、怎么防跑飞、怎么让每轮更接近正确答案。

## 定义与层次

**Loop Engineering 是对 Agent 执行循环的退出条件、纠错策略和资源约束进行系统化工程设计的实践。**（2026 年 6 月起成为 Agent 面试高频词）

| 层次 | 关注点 | 典型产出 |
|------|--------|---------|
| Prompt Engineering | 单次 LLM 调用输入质量 | 模板、Few-shot、结构化指令 |
| Context Engineering | 送进模型的上下文组合 | 记忆检索、RAG 注入、压缩 |
| Harness Engineering | 模型外的上下文/工具/约束/验证体系 | 工具注册、状态管理、验证器 |
| Agent Loop | 驱动决策/工具执行/状态更新的执行内核 | 协议循环、工具派发、状态转移 |
| **Loop Engineering** | **循环的迭代策略与退出判断** | 纠错模式、收敛检测、防护机制 |

Harness 范围 > Loop。故障归因：消息缺失=Context/协议问题、工具越权=Harness 问题、反复重试=Loop 问题、进程恢复失败=Infra 问题。

## 为什么需要单独谈

Agent 的 bug 多不在单次调用而在循环层面：认为任务没完成反复重试已成功操作、错误上下文滚雪球、代码重写无限震荡、token 预算耗尽仍继续调用。共同特征：**单步逻辑没错，但循环策略失控**。

## 从 API 协议落到可验证 Agent Loop

结构化轨迹：组装 system/用户目标/历史/工具 → 模型返回文本或 tool_calls → 完整 assistant 决策先入轨迹 → 校验工具名/参数/协议关联再执行 → 结果按协议写回 → 下一轮直到验证通过或退出。

**四条协议不变量**：
1. 工具请求 ≠ 客户端工具已执行（须过权限检查）
2. assistant 决策必须先入轨迹（只留结果则下一轮不知结果对应哪次决策）
3. 工具结果必须与调用一一关联（并行不能靠位置/名称猜）
4. 流式参数组装完成后再校验执行

## 四种核心 Loop 模式

1. **ReAct Loop**（思考-行动循环）：每轮 Decision → Action → Observation → 决定是否继续。关键：`done` 判断不能只靠模型自评"完成了"，需外部验证；连续 N 轮 Action 相同且 Observation 不变 → 强制终止。
2. **Reflection Loop**（反思循环）：生成后显式评估产出质量决定接受或修改。适用代码生成/文案/方案设计。**同模型反思易"自我欺骗"**，工程平衡点：同模型但换审核者 system prompt + 结构化检查清单。
3. **Verification Loop**（验证循环）：产出靠外部验证器（单测/类型检查/正则/人工审批/沙箱）确认。**生产级最常用模式**——验证结果确定性，不存在自我欺骗。Claude Code 代码生成即典型：生成→跑测试→失败回灌→重生成。
4. **Self-Correction Loop**（自我修正循环）：不仅识别问题，还局部 patch 而非全量重写。省 token、修复精准；风险是补丁摞补丁质量逐轮下降，需设 patch 上限，超限回退全量重生成。

## 退出条件设计（多重组合）

Max Iterations（兜底）/ Convergence Check（连续 N 轮无变化）/ Confidence Threshold（模型自评）/ External Verification / Token Budget / Wall-clock Timeout / Repetition Detection（防死循环）。生产系统通常组合 3-4 种：

```
if iterations>=MAX_ITER: return "max_iter"
if tokens_used>=TOKEN_BUDGET: return "budget"
if wall_clock()>=TIMEOUT: return "timeout"
if last_n_same(3): return "stuck"
if verifier_passed: return "success"
```

## 工程落地关键实践

- **循环防护（Loop Guard）**：行为指纹去重（记录 (action_type, params_hash)，连续 2 次相同强制切换/终止）；渐进式降级（1-3 轮正常→4-5 轮简策略→6 轮输出当前最优）；上下文污染检测（错误信息超总 token 30% 触发上下文重置）。
- **Token Budget**：一次完整 Loop 可能 10 万+ token。剩余不足一轮有意义调用时返回 best_so_far；剩余 <20% 切"精简模式"。
- **Checkpoint**：每轮后持久化状态（iteration count、最新输出、上下文摘要），从最近 checkpoint 恢复。LangGraph StateSnapshot/MemorySaver 即为此设计。
- **可观测性**：每轮 action+result、token 消耗曲线、退出原因分布、平均迭代次数、重复行为比例。

## 典型面试问题

四者区别 / 防死循环与退出条件设计 / Verification vs Reflection 适用场景 / 连续 3 轮犯同一错误怎么处理 / token 预算快耗尽如何降级 / 上下文压缩导致流程丢失怎么解决。

## 关联

- 概念：[[01-Wiki/concepts/Loop Engineering]]、[[01-Wiki/concepts/Harness Engineering]]、[[01-Wiki/concepts/AI Agent]]、[[01-Wiki/concepts/ReAct]]
- 系列：[[01-Wiki/entities/zero2Agent]]
