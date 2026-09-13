---
type: summary
domain: tech
tags: [agent, llm]
created: 2026-09-13
updated: 2026-09-13
sources: ["[[00-Raw/agent-basics/1.1 欢迎]]"]
status: seedling
---

# Agentic AI 课程 1.1 欢迎与课程目标

> 吴恩达「Agentic AI」课程开篇：术语由他本人创造、已被营销滥用，但真有用的 Agent 应用在快速增长；能不能做**有纪律的评估与错误分析**是区分高手与低手的分水岭。

## 核心观点

- **术语由来**：「智能体 AI（Agentic AI）」一词由吴恩达创造，用来描述"以新方式构建基于基础模型的应用"这一趋势；该词随后被营销人员广泛贴标签，导致炒作飙升（→ [[01-Wiki/entities/吴恩达]]、[[01-Wiki/concepts/Agentic AI 工作流]]）
- **去泡沫判断**：撇开炒作，真正有价值的 Agentic AI 应用数量在快速增长，只是速度不如炒作快
- **课程目标**：展示构建 Agentic AI 的**最佳实践**，"掌握如何用智能体构建应用"是当下 AI 领域最有价值的技能之一
- **关键区别（本节课的题眼）**：真正懂构建 Agentic AI 的人与效率较低的人之间，最大差异在于**能否推动有纪律的开发流程，尤其聚焦评估与错误分析（evals and error analysis）**——这条主线贯穿整套课程（→ [[01-Wiki/concepts/Agent 评估]]、[[01-Wiki/concepts/错误分析]]）

## 课程给出的四个应用实例

| 场景 | 产品 / 团队 | 说明 |
|------|------------|------|
| 客户支持智能体 | Agentforce（Salesforce） | 用户上传家电照片 → 识别型号/序列号 → 主动提供注册与固件更新 |
| 深度研究智能体 | Claude Research（Anthropic） | 自动规划研究步骤、搜集信息，产出详尽报告 |
| 法律文件处理 | Callidus Platform | 分析版权侵权案件的法律条文与判例 |
| 医疗诊断系统 | MAI-Dx（Microsoft AI） | 多智能体分工（假设生成/测试选择/诊断确认）组成"虚拟医生小组"，用**辩论链**机制提高诊断准确性 |

## 亮点与不足

- 亮点：开篇即点明课程主线是**工程纪律**而非技巧堆砌；四个实例覆盖客服/研究/法律/医疗，形态从单 Agent 到多 Agent 都有
- 不足：属导论性质，无技术细节；对"炒作 vs 实际"只有定性判断，未给量化支撑

## 与既有知识的联系

- 与 [[01-Wiki/summaries/什么是 Agent]] 互补：本课用"程度（degrees of autonomy）"替代"是不是真正的 Agent"的定义之争（→ [[01-Wiki/concepts/Agentic AI 工作流]]）
- MAI-Dx 的多智能体 + 辩论机制，是 [[01-Wiki/concepts/单 Agent 与多 Agent]] 中「多智能体协作」的医疗落地例

## 延伸问题

- Agentforce / Claude Research / MAI-Dx 的公开评测数据与失败模式？（lint 时可作为 entity 页候选）
- 课程所称"有纪律的开发流程"与 [[01-Wiki/concepts/Agent 评估]] 中四维度评测如何一一对应？
