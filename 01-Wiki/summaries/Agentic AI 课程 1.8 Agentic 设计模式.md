---
type: summary
domain: tech
tags: [agent, workflow]
created: 2026-09-13
updated: 2026-09-13
sources: ["[[00-Raw/agent-basics/1.8 Agentic设计模式]]"]
status: mature
---

# Agentic AI 课程 1.8 Agentic 设计模式

> 全课总纲：把复杂任务拆成基础 building blocks，再用四大设计模式组合——**反思、工具使用、规划、多智能体协作**。

## 核心观点

Agentic 工作流的核心思想：把复杂任务分解为一系列基础"构建模块"，再通过特定设计模式把模块组合、串联，构建能处理复杂问题的系统。

## 四大设计模式

### 一、反思 Reflection

- 让模型对自己的输出**检查、评估、改进**
- 流程：初始生成 → 自我/外部评估（同一模型或"审查者"模型）→ 迭代优化 → 循环往复
- 关键点：是非常有效的性能提升技术，但不保证 100% 完美；评估标准可客观（代码能否运行）也可主观（代码风格）；**引入独立"审查者"模型即多智能体协作的雏形**
- → [[01-Wiki/concepts/反思模式]]

### 二、工具使用 Tool Use

- 赋予语言模型调用外部工具/函数的能力，扩展功能边界
- 流程：识别需求 → 生成调用指令与参数 → 工具执行并返回 → 模型整合结果
- 工具类型：信息收集（web search / Wikipedia / DB）、分析计算（code execution / Wolfram Alpha / Bearly）、生产力（Email / Calendar / Messaging）、图像处理（生成 / captioning / OCR）
- → [[01-Wiki/concepts/Tool Calling]]

### 三、规划 Planning

- 让模型**自主决定**完成复杂任务所需的步骤序列，而非开发者硬编码
- 流程：任务理解 → 路径规划（如先用 openpose 提取姿势 → 再用 vit 生成图片 → vit-gpt2 描述 → fastspeech 转语音）→ 按序执行
- 关键点：比硬编码流程更灵活，但控制更难、更具实验性
- → [[01-Wiki/concepts/规划模式]]

### 四、多智能体协作 Multi-agent collaboration

- 雇佣多个不同专长的角色协同完成复杂项目，流程：角色分配 → 分工合作 → 沟通协调
- 关键点：能产生比单智能体更好的结果，但更难控制与调试，因为无法预知各智能体行为
- → [[01-Wiki/concepts/单 Agent 与多 Agent]]

## 关键数据（多智能体 vs 单智能体）

| 任务 | 单智能体 | 多智能体 |
|------|----------|----------|
| 人物传记撰写 | 66.0% | **73.8%** |
| 多模态理解（MMLU） | 63.9% | **71.1%** |
| 国际象棋走子 | 29.3% | **45.2%** |

## 亮点与不足

- 亮点：四种模式是全课的目录页，也是目前 Agent 设计最常被引用的分类；给出多智能体 vs 单智能体的量化差异
- 不足：多智能体数据未注明来源与任务设置；规划模式只讲了"更灵活"，风险一笔带过

## 与既有知识的联系

- 与 [[01-Wiki/summaries/Planning、Reflection、RAG 分别解决什么问题]] 是同一组概念的两种切法（本课把 RAG 归入"工具使用"下的信息检索）
- 四模式 ↔ [[01-Wiki/concepts/ReAct]] 的 Reasoning+Acting 融合；↔ [[01-Wiki/concepts/LangChain 组件与 Agent 模式]] 的四种 Agent 模式
- 反思 → [[01-Wiki/summaries/第四章 智能体经典范式构建]] 中的 Reflection 范式

## 延伸问题

- 四种模式之外的"记忆"与"状态管理"为何未被列为设计模式？（可对比 [[01-Wiki/concepts/Agent 记忆系统]]）
- 多智能体收益的复现实验与任务依赖条件？
