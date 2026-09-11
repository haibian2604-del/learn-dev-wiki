---
type: concept
domain: tech
tags: [agent, loop-engineering, llm, harness, vibe-coding]
created: 2026-07-31
updated: 2026-08-27
sources: ["[[01-Wiki/summaries/JavaGuide Loop Engineering]]", "[[01-Wiki/summaries/Loop Engineering深度解析]]", "[[01-Wiki/summaries/Loop Engineering完全指南]]", "[[01-Wiki/summaries/Loop Engineering：让 Agent 自主迭代直到正确]]"]
status: mature
---

# Loop Engineering（循环工程）

> Agent 推理-行动循环的工程化设计：循环终止策略、防无限循环机制、上下文膨胀检测与优雅退出。

## 定义

Agent 核心是一个 while 循环：推理→行动→观察→推理。Loop Engineering 专注于让这个循环**可控、可终止、可恢复**——不只是设 `max_steps`。

## 关键设计

| 机制        | 做什么                   | 触发条件                         |
| --------- | --------------------- | ---------------------------- |
| Finish 标记 | 模型自主声明完成任务            | LLM 输出 `Finish[答案]`          |
| 重复检测      | 连续 N 步无实质进展 → 终止      | 连续步的 Action/Observation 哈希相同 |
| 上下文膨胀检测   | token 超预算 → 压缩或终止     | 上下文长度 > max_tokens × 阈值      |
| 置信度阈值     | 模型输出附带置信度，低于阈值时请求用户介入 | 模型自身的 uncertainty 输出         |
| 渐进式降级     | 超限后先压缩历史再限制工具数再最终终止   | 多级阈值                         |

## 与 ReAct 的关系

[[01-Wiki/concepts/ReAct]] 是最经典的循环范式（Thought-Action-Observation）。Loop Engineering 在 ReAct 之上加了一层"循环自身的质量控制"——让循环知道什么时候该停、什么时候该换个方向。

属于 Harness L3（执行编排层）+ L6（约束恢复层）的交叉。

## 相关概念

- [[01-Wiki/concepts/ReAct]]（经典循环范式）
- [[01-Wiki/concepts/Harness Engineering]]（循环的宿主层）
- [[01-Wiki/concepts/上下文工程]]（循环中的上下文管理）

## 补充视角：五阶段循环与六大要素

> 来自 [[01-Wiki/summaries/Loop Engineering深度解析]]（Addy Osmani 理论 + 知乎实战解读）

- **五阶段通用循环**（每个编码循环，直到可验证停止条件）：Discover → Plan → Execute → Verify → Iterate
- **核心哲学：状态存在于外部而非上下文**——`while :; do cat PROMPT.md | claude-code; done`（Ralph Loop），每轮全新上下文 + 外部持久化（git/STATE.md/issue）
- **六大核心要素**：
  | 要素 | 作用 |
  |------|------|
  | Automations | 定时/事件触发循环（cron、/loop、/goal） |
  | Worktrees | git 工作树并行，Agent 间无文件冲突 |
  | Skills | 项目知识编码到磁盘（SKILL.md + scripts/references） |
  | Connectors | MCP 连接器接 Issue/通讯/数据库/CI |
  | Sub-agents | 实现/验证分离（写代码的不评自己代码） |
  | State | STATE.md/tasks.json/issue 记录运行阶段 |
- **闭环五要素**：明确目标 Goal + 充足上下文 + 受限动作 + 客观反馈（测试/lint）+ 清晰停止条件；建议先闭环后开环
- **成本管控**：max-iterations 必设、小规模起步、ROI 计算、低成本模型分层、API 警报

## 系统定义与概念辨析

> 来自 [[01-Wiki/summaries/Loop Engineering完全指南]]（muximxc 系统化教程）

- **三段演化**：Prompt Engineering（2022-24，优化单次指令）→ Agentic Engineering（2024-25，代理执行操作）→ **Loop Engineering（2026，设计自动运行的系统）**。杠杆点从"单条 Prompt 质量"转移到"系统设计质量"。
- **Open-Loop vs Closed-Loop**（控制论视角）：标准自回归 Transformer 是**开环**（生成即定、从不回头检查、错误累积）；Loop Engineering 把 AI 工作从开环变**闭环**（执行→观察→调整）。2025 末论文 *Closed-Loop Transformers: Autoregressive Modeling as Iterative Latent Equilibrium* 从学术层论证（奇偶校验任务 +8.07%，94% token 在 8 次迭代内达平衡态）。
- **与相邻概念辨析**：
  - vs **Vibe Coding**：Loop Engineering 是 Vibe Coding 的"纪律版"——加上结构（自动化/验证/记忆/分工）
  - vs **Harness Engineering**：`Agent = Model + Harness`；Loop 是 Harness 的具体实现，即"运行在定时器上的 Harness，生成小助手并自我喂养"
  - vs **Agentic Engineering**：Loop 是其**子集**，专注"循环"模式；类比"自动巡航系统"之于"汽车工程"
- **学术基础**：Test-Time Training（TTT）是模型层闭环（模型自迭代优化表示），Loop Engineering 是系统层闭环——二者互补
- **实战反模式**：循环过复杂（>10 子代理嵌套）、验证条件太弱（"看起来没问题"）、忽视 Token 成本
- **成本策略**：模型分层（探索轻量/实现主力/审查强，省 60-80%）、频率控制、条件触发、上下文压缩、预算上限
- **认知警告**：避免"认知投降"（cognitive surrender）——用 Loop 提升思考而非避免思考；验证仍是人的责任

## 补充视角：四种核心 Loop 模式与退出设计（zero2Agent 10）

> 来自 [[01-Wiki/summaries/Loop Engineering：让 Agent 自主迭代直到正确]]

- **四种核心模式**：
  | 模式 | 机制 | 关键设计 |
  |------|------|---------|
  | ReAct Loop | 决策→行动→观察→继续 | done 判断需外部验证不能只靠模型自评；连续 N 轮同 Action 同 Observation 强制终止 |
  | Reflection Loop | 生成后显式评估产出 | 同模型反思易"自我欺骗"；平衡点=同模型换审核者 prompt + 结构化检查清单 |
  | **Verification Loop** | 外部验证器确认（单测/类型/正则/审批/沙箱） | **生产级最常用**，验证确定性无自我欺骗；Claude Code 生成代码即典型 |
  | Self-Correction Loop | 局部 patch 而非全量重写 | 省 token 修复精准；设 patch 上限防"补丁摞补丁"质量下滑，超限回退全量重生成 |
- **退出条件多重组合**（生产系统 3-4 种叠加）：Max Iterations（兜底）/ Convergence Check / Confidence Threshold / External Verification / Token Budget / Wall-clock Timeout / Repetition Detection（防死循环）
- **工程落地四件事**：Loop Guard（行为指纹去重、渐进式降级、上下文污染检测——错误信息超 30% 触发重置）、Token Budget（剩余不足一轮有意义调用返回 best_so_far，<20% 切精简模式）、Checkpoint（每轮持久化，从最近断点恢复，LangGraph StateSnapshot/MemorySaver 即此设计）、可观测性（每轮 action+result、token 曲线、退出原因分布、重复行为比例）
- **协议不变量**：工具请求≠已执行（须过权限）；assistant 决策先入轨迹；结果与调用一一关联（并行不能靠位置猜）；流式参数组装完再校验执行
- **层次关系**：Prompt ⊂ Context ⊂ Harness ⊃ Agent Loop ⊃ Loop Engineering；故障归因——消息缺失=Context/协议、工具越权=Harness、反复重试=Loop、进程恢复失败=Infra
