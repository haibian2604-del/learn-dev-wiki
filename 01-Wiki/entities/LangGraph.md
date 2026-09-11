---
type: entity
domain: tech
tags: [agent, workflow]
created: 2026-08-01
updated: 2026-08-01
sources: ["[[01-Wiki/summaries/2026年AI Agent框架选型实战]]"]
status: seedling
---

# LangGraph

## 是什么

LangChain 生态的状态化图基 Agent 工作流框架（135K+ Stars），每个 Agent 是一个节点，节点间连接定义数据流与控制流。

## 关键事实

- **架构优势**：状态化图基设计（→ [[01-Wiki/concepts/Workflow Graph]]）；可观测性强、可调试性好；原生集成 LangSmith
- **工具**：100+ 预定义工具（API 调用/数据处理/文件操作），异步处理能力强
- **适用场景**：复杂多 Agent 协作系统、需要高可控性
- **选型定位**：企业级第二顺位（AutoGPT > LangGraph）；研究实验与 LangGraph 亦常用（MetaGPT > CrewAI > LangGraph）
- **注意**：部署复杂度较高，需运维经验

## 相关

- 相关概念：[[01-Wiki/concepts/Workflow Graph]]（图基编排理论）、[[01-Wiki/concepts/AI Agent]]
- 同类框架：[[01-Wiki/entities/LangChain]]（同生态）、[[01-Wiki/entities/AutoGPT]]、[[01-Wiki/entities/CrewAI]]
