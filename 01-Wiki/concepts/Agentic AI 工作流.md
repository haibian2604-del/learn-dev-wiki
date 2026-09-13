---
type: concept
domain: tech
tags: [agent, llm]
created: 2026-09-13
updated: 2026-09-13
sources: ["[[01-Wiki/summaries/Agentic AI 课程 1.1 欢迎与课程目标]]", "[[01-Wiki/summaries/Agentic AI 课程 1.2 什么是 Agentic AI]]", "[[01-Wiki/summaries/Agentic AI 课程 1.3 自主性等级]]", "[[01-Wiki/summaries/Agentic AI 课程 1.4 Agentic AI 的益处]]", "[[01-Wiki/summaries/Agentic AI 课程 1.5 Agentic AI 应用场景]]", "[[01-Wiki/summaries/Agentic AI 课程 5.10 课程总结]]"]
status: growing
---

# Agentic AI 工作流（Agentic AI Workflow）

## 定义

**基于 LLM、通过执行多个步骤完成复杂任务的应用流程**。核心差别在于**迭代性**与**分解性**：把一个复杂任务拆成多个 Step，指挥多个 LLM（可以是不同模型）各做一个 Step，最终交付结果。

- 术语「Agentic AI」由 [[01-Wiki/entities/吴恩达]] 创造，用于描述"以新方式构建基于基础模型的应用"的趋势，后被营销广泛滥用
- 对立面是**零样本（zero-shot）工作流**：单一 prompt 要求 LLM 一次性完成整个任务——类比"让人一口气从第一个字写到最后一个字，中间不许回退"

> 一句话：**Agentic AI 的精髓不是"能干活"，而是"会自己想怎么干、用什么工具、干完还能自己检查改错"**。

## 机制/原理：自主性是一段光谱

与其争论"什么才算真正的 Agent"，本课用 `Agentic` 作**形容词**，承认系统在主动性上的不同程度：

| 维度 | 低自主 | 高自主 |
|------|--------|--------|
| 步骤 | 预先设定 | 模型动态决定顺序 |
| 工具调用 | 硬编码在代码里 | 模型自主选择，甚至新建工具 |
| 模型职责 | 主要只体现在"生成文本" | 规划 + 调用 + 自检 + 改进 |
| 类比 | 听话但不会动脑的助手 | 聪明又有责任心的实习生 |

## 三大益处

1. **性能跃升**：工作流带来的提升远超单纯换模型版本。HumanEval 实测：非 Agentic 下 GPT-3.5 ≈48%、GPT-4 =67%；把 GPT-3.5 放进 Agentic 工作流（写码→反思→改进）可达甚至超过 GPT-4
2. **并行加速**：3 个 LLM 并行生成搜索词并检索、每个再并行抓取多网页，总步骤更多但总耗时远低于人类串行
3. **模块化**：可替换工具（web search → Serper/Bing）、切换功能（web search → news search）、按步骤换最优模型

## 基本构件

拆解后的每一步都归入两类构件（→ [[01-Wiki/concepts/任务分解]]）：

- **模型**：LLM（大脑：文本生成、工具使用决策、信息提取）+ 其他 AI 模型（PDF 转文本、TTS、图像分析）
- **工具**：API / 信息检索（→ [[01-Wiki/concepts/RAG]]）/ 代码执行（→ [[01-Wiki/concepts/代码执行]]）

## 例子：写深度文章的两档拆法

- 一轮零样本 → 内容表面化、缺乏深度与一致性
- 写大纲 → 网络搜索 → 写初稿 → 反思待改部分 → 修订（5 步）→ 模拟人类"写作-反思-修改"循环，质量显著提高（→ [[01-Wiki/concepts/反思模式]]）

## 边界与常见误区

- **不是"取代人"，而是把人从重复性、规则性强的任务中解放出来**，转向更高阶的决策与创造
- **任务适用性有难度光谱**：
  - 较易：清晰逐步的流程 / 有标准程序可循 / **纯文本资产**
  - 较难：步骤未知（需动态规划）/ 边执行边解决 / **多模态输入**（声音、视觉）
- 误区：把"缺外部信息"误判为"需要多思考"——该补检索时加规划无效（→ [[01-Wiki/concepts/任务分解]]）
- 误区：以为 Agentic 必然更贵更好——质量优先、延迟与成本靠后（→ [[01-Wiki/concepts/延迟与成本优化]]）

## 相关概念

- 落地四模式：[[01-Wiki/concepts/反思模式]]、[[01-Wiki/concepts/Tool Calling]]、[[01-Wiki/concepts/规划模式]]、[[01-Wiki/concepts/单 Agent 与多 Agent]]
- 工程闭环：[[01-Wiki/concepts/Agent 评估]]、[[01-Wiki/concepts/错误分析]]
- 上层概念：[[01-Wiki/concepts/AI Agent]]、[[01-Wiki/summaries/Workflow 和 Agent 的区别]]
