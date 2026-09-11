---
type: concept
domain: tech
tags: [agent, llm]
created: 2026-08-27
updated: 2026-08-27
sources: ["[[01-Wiki/summaries/Agent SFT 关键细节：从轨迹数据到 Loss Mask]]"]
status: growing
---

# Agent SFT（Agent 有监督微调）

## 定义

用 Agent 的执行轨迹作为"标准答案"微调模型——SFT（Supervised Fine-Tuning）教模型"怎么按要求做事"，Agent SFT 教它"怎么执行一整条轨迹"（调工具、读返回、思考、再调工具、最终回复）。与对话 SFT 的本质区别在数据形态、训练策略与 loss 计算方式。

## 与对话 SFT 的区别

| | 对话 SFT | Agent SFT |
|---|---|---|
| 训练目标 | 生成一个好回复 | 执行一整条正确轨迹 |
| 数据粒度 | 单轮问答 | 多轮推理 + 工具调用 + 最终回复 |
| loss | 对回复算 | 精细控制哪些 token 算 |

## Loss Mask（核心技巧）

只对模型应该生成的部分计算 loss，屏蔽不需要学习的部分（token level mask）：
- **`<tool_call>` 必须算**：核心学习目标——正确时机调正确工具传正确参数
- **最终回复算**：根据工具结果总结输出
- **`<think>` 看质量**：质量高保留（学思维链），参差不齐则 mask
- **System/User/Tool 返回不算**：前者模型不需学生成，后者是环境返回

## 数据构造

- 人工标注（质量高成本极高，种子数据集）或**强模型生成 + 人工筛选**（主流）
- **必须含失败轨迹**（只用成功轨迹训练的 Agent 遇失败会死循环）
- 轨迹长度适中（太长引入噪声，天然多步拆子任务）

## 与 RL 的配合

两阶段：SFT 让模型"能跑"（70-80% 完成率即可，**别刷太高**给 RL 留探索空间），RL 让模型"跑得好"。SFT checkpoint 作为 RL 的 reference model（KL 约束，防格式退化）。→ [[01-Wiki/concepts/Agent 强化学习]]

## 数据配比

只用轨迹数据 → 通用能力崩塌（能力偏移）。需混入 Tool Calling 单轮/通用指令/长文本/安全/代码推理数据，Agent 轨迹 ≤50%。→ [[01-Wiki/concepts/Agent 训练数据]]

## 关联

- 上游：[[01-Wiki/concepts/AI Agent]]、[[01-Wiki/concepts/Agent 强化学习]]、[[01-Wiki/concepts/Agent 训练数据]]
- 实战来源：[[01-Wiki/summaries/Agent SFT 关键细节：从轨迹数据到 Loss Mask]]
