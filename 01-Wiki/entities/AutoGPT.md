---
type: entity
domain: tech
tags: [agent]
created: 2026-08-01
updated: 2026-08-01
sources: ["[[01-Wiki/summaries/2026年AI Agent框架选型实战]]"]
status: seedling
---

# AutoGPT

## 是什么

GitHub 星标最高的 AI Agent 框架（184K+），由概念验证项目演变为成熟的全自主代理平台。

## 关键事实

- **架构**：微服务架构，Docker 自托管，提供完整企业级特性（用户管理、权限控制、审计日志）
- **核心能力**：可视化构建器（拖拽式创建 Agent 工作流）；全自主代理
- **适用场景**：大型企业应用，需要高稳定性和可扩展性
- **选型定位**：企业级场景首选（AutoGPT > LangGraph > OpenClaw，→ [[01-Wiki/summaries/2026年AI Agent框架选型实战]]）
- **注意**：学习曲线陡峭，需分布式系统知识；部署复杂度高，个人开发者慎选

## 相关

- 相关概念：[[01-Wiki/concepts/AI Agent]]
- 同类框架：[[01-Wiki/entities/AutoGen]]、[[01-Wiki/entities/LangGraph]]、[[01-Wiki/entities/CrewAI]]、[[01-Wiki/entities/LangChain]]
