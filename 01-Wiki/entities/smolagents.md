---
type: entity
domain: tech
tags: [agent, framework]
created: 2026-09-13
updated: 2026-09-13
sources: ["[[01-Wiki/summaries/Agentic AI 课程 5.1 工作流规划]]", "[[01-Wiki/summaries/Agentic AI 课程 5.3 结合代码执行的规划]]", "[[01-Wiki/summaries/Agentic AI 课程 5.7 多智能体通信模式]]"]
status: seedling
---

# smolagents

## 是什么

HuggingFace 社区出品的轻量 Agent 框架；以**极简抽象**与 **CodeAgent（代码即行动）** 两个设计著称（→ [[01-Wiki/concepts/规划模式]]）。

## 关键事实

- **低抽象、易入门**：代码简洁、抽象程度少、工具开发难度低（只需一个 `@tool` 装饰器）、自由程度高、具备流程跟踪功能；便于理解并重写其中逻辑来实现定制化系统（来源 [[01-Wiki/summaries/Agentic AI 课程 5.1 工作流规划]]）
- **CodeAgent 概念**：主张让 LLM **直接编写代码**表达计划的多个步骤与工具调用，而非输出 JSON 再解析——论文普遍显示同样的工具与参数下，写代码的评估分数明显高于写 JSON（来源 [[01-Wiki/summaries/Agentic AI 课程 5.3 结合代码执行的规划]]）
- **协作结构偏好**：相比 langchain 的线性结构、metagpt/camelai 的去中心结构，smolagents **更青睐双层/多层（Hierarchical / Deep Hierarchy）结构**（来源 [[01-Wiki/summaries/Agentic AI 课程 5.7 多智能体通信模式]]）

## 相关

- 相关实体：[[01-Wiki/entities/LangChain]]、[[01-Wiki/entities/LangGraph]]、[[01-Wiki/entities/CrewAI]]、[[01-Wiki/entities/AutoGen]]、[[01-Wiki/entities/aisuite]]
- 相关概念：[[01-Wiki/concepts/规划模式]]、[[01-Wiki/concepts/代码执行]]、[[01-Wiki/concepts/单 Agent 与多 Agent]]
