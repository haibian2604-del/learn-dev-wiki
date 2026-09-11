---
type: summary
domain: tech
tags: [loop-engineering, agent, ai-coding]
created: 2026-07-31
updated: 2026-07-31
sources: ["[[00-Raw/loop-engineering/Loop Engineering深度解析-知乎]]"]
status: growing
---

# Loop Engineering 深度解析与实战指南（知乎）

> 源自谷歌工程师 Addy Osmani《Loop Engineering》（"AI 编程的第三次革命"），徐小夕（Dooring/JitWord 创始人）的深度解读：四层架构、五阶段循环、六大核心要素、闭环/开环、CI 修复实战与成本安全考量。

## 核心增量（与已有概念页互补）

- **AI 编程三次革命**：Prompt Engineering（提示词生成代码）→ Context + Harness（上下文工程化）→ **Loop Engineering（自循环系统）**；思维转变：从"与 AI 对话"到"编程式 AI"——不再写完美提示词，而是设计完美反馈系统
- **四层架构**：Prompt 层（怎么问）→ Context 层（让 AI 看到什么，RAG/记忆）→ Harness 层（什么环境里工作，工具/沙箱/权限）→ **Loop 层（做完一步怎么办：自动检查/修正/继续/停止）**——Loop 站在最顶端，关心系统自运行能力
- **五阶段循环**（每个编码循环通用，直到可验证停止条件）：Discover（发现）→ Plan（计划）→ Execute（执行）→ Verify（验证）→ Iterate（迭代）
- **核心哲学**：**状态存在于外部，而非上下文窗口**——"模型会遗忘、漂移、压缩信息导致约束丢失"；每个迭代从全新上下文开始，基于外部持久化（git/markdown/数据库/issue）工作。Ralph Loop 一行代码：`while :; do cat PROMPT.md | claude-code; done`
- **六大核心要素**：Automations（定时/事件触发，`/loop` `/goal`）、Worktrees（git 工作树并行无冲突）、Skills（项目知识编码到磁盘）、Connectors（MCP 连接器接工具）、Sub-agents（实现/验证分离，"让学生给自己打分不可靠"）、State（STATE.md/任务队列/issue 跟踪）
- **闭环 vs 开环**：闭环五要素（目标 Goal/上下文 Context/受限动作 Action/客观反馈 Feedback/停止条件 Stop Condition）；建议先闭环再开环
- **成本管控**：max-iterations 必设、10-20 次小规模起步、ROI 计算、低成本模型分层、每日 API 警报（中规模代码库 50-100 次迭代约 ¥500-1000）
- **实战案例**：每日 6 点自动修复 CI 失败的完整工程（ci-triage/code-fixer 技能 + ci-fixer/code-reviewer 子代理 + GitHub Actions cron + STATE.md 状态跟踪）

## 与既有知识的联系

- 深化 [[01-Wiki/concepts/Loop Engineering]]：本页提供完整理论框架（五阶段/六要素/闭环），前者聚焦循环质量控制
- 四层架构中的 Harness 层 → [[01-Wiki/concepts/Harness Engineering]]
- Skills 要素 → [[01-Wiki/concepts/Agent Skills]]；Connectors → [[01-Wiki/concepts/MCP]]
- 状态外置哲学 → [[01-Wiki/concepts/上下文工程]]（不信任上下文窗口做持久化）

## 延伸问题

- Ralph Loop 与上下文工程的关系（每次全新上下文 vs 长上下文维护的取舍）
- 开环 Loop 的评估与预算体系
