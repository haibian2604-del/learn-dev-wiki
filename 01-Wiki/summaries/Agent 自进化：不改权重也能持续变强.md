---
type: summary
domain: tech
tags: [agent]
created: 2026-08-27
updated: 2026-08-27
sources: ["[[00-Raw/agent-engineering/Agent 自进化：不改权重也能持续变强]]"]
status: mature
---

# Agent 自进化：不改权重也能持续变强（zero2Agent 基础 15）

> 从经验积累到工具创造——Agent 部署上线后怎么越用越好。不改模型权重，通过运行时机制实现自我改进。

## 为什么需要自进化

- **模型权重静态，但世界在变**：需求模式漂移、外部 API 更新、业务规则调整。行为完全由静态 prompt+工具定义决定则有效期有限。
- **人工迭代太慢**：发现问题→人工分析→改 prompt/工具→测试→部署，瓶颈在"人工分析"与"修改"，复杂系统几十 prompt 模板上百工具。
- **理想状态：Agent 改善 Agent**——通过使用自己来改善自己。不是 AGI 自我意识，而是工程上可实现的反馈闭环。

## 三种自进化机制

### 机制一：经验学习（Experience Learning）——最实用

每次任务执行轨迹结构化保存，下次类似任务检索相关经验作为 Context 注入。**比 RL 高效**：RL 梯度更新需数千-数万样本；经验学习用 In-Context Learning，1-5 个相关案例即时生效，样本效率高 250-400 倍。

工程实现：任务结束 → 提炼经验（task_type/input_summary/trajectory/lessons/context_tags/success_count）→ 存入经验库 → 新任务相关性检索（`w1*task_type_match + w2*embedding_similarity + w3*tag_overlap + w4*recency + w5*success_rate`，典型权重 0.2/0.4/0.15/0.1/0.15）→ 只注入 lessons 与关键路径（不注入完整轨迹，省 Context）。

过期清理：时间衰减（超 N 天未成功复用降权）、失败追踪（failure_count）、自动淘汰（failure/(success+failure) > 0.3 归档）、环境变更感知（工具/API 变化标记"待验证"）。

### 机制二：从 Tool User 到 Tool Creator

发现现有工具无法完成子步骤 → 生成新工具代码（函数+参数 Schema+文档）→ 自动化测试验证 → 通过后加入工具库。能力边界动态扩展（{A,B,C} → 加 D 格式转换 → 加 E 适配器 → 加 F 组合工具）。

**安全约束必须**：沙箱执行、权限继承（新工具权限 ≤ 创建者）、人工审批（涉外部调用）、自动回滚（失败率上升自动禁用）。

### 机制三：Prompt/Strategy 自优化——风险最高

保存有效 few-shot 示例（表现好时输入-输出对自动注入）；自动发现 edge case 处理策略并固化为规则（含原因与验证次数）；System Prompt 版本化管理（prompt_v1.0 → v1.1 加规则 → v1.2，保留回滚）。

## 经验库工程设计（Schema 示例）

```json
{"experience_id": "exp_...", "task_type": "data_extraction",
 "input_summary": "从 PDF 发票提取结构化字段含手写备注",
 "trajectory": [{"step":1,"action":"call ocr_tool","result":"部分识别失败"},...],
 "outcome": "success", "lessons": "含手写 PDF 先 OCR 失败后回退视觉模型",
 "context_tags": ["pdf","handwriting","invoice"], "success_count": 12, "last_used": "..."}
```

## 自进化的风险与约束

1. **错误经验被固化**（侥幸成功路径反复走错）：新经验需成功复用 ≥3 次才提权重、失败立即标记、定期固定测试集验证 lessons。
2. **自我修改导致不可预测行为**（同时改 prompt/工具/经验库难调试）：每次变更生成版本快照、持续监控关键指标、指标下降超阈值自动回滚。
3. **能力膨胀超安全边界**（工具越来越多）：**权限不随能力扩展**（新工具继承创建者权限不能获得额外权限）、工具总数上限、敏感操作人工审批、定期审计清理。
4. **评估漂移**（Agent 自改"成功"定义致指标虚高）：维护人工标注 golden test set 永不让 Agent 修改、定期评估实际表现、内部外部评估独立运行偏差告警。

## 自进化 vs 训练

| 维度 | 自进化（运行时） | SFT/RL（训练时） |
|------|-----------------|-----------------|
| 改变什么 | Context / Tools / Prompt | 模型权重 |
| 生效速度 | 即时 | 需训练周期 |
| 可逆性 | 版本回滚秒级 | 需重新训练 |
| 样本效率 | 高（1-5 案例） | 低（大量标注） |
| 能力上限 | 受限于模型 ICL 能力 | 可突破原有边界 |
| 风险 | Context 污染、经验过期 | 灾难性遗忘、对齐漂移 |

实践配合：日常改进用自进化（快/低成本/可回滚）→ 积累经验后用 SFT 把通用模式"烧入"权重 → 烧入后清理对应经验库条目。形成梯度：Context 注入（本次生效）→ 经验库（跨会话）→ Prompt 修改（持久化）→ SFT/RL（权重）。

**工程建议顺序**：先实现经验库（成本最低收益最直接）→ 再工具创造（需沙箱基础设施）→ 最后策略自优化（风险最高需完善评估）。

## 关联

- 概念：[[01-Wiki/concepts/Agent 自进化]]、[[01-Wiki/concepts/AI Agent]]、[[01-Wiki/concepts/Coding Agent]]
- 摘要：[[01-Wiki/summaries/Coding Agent：最成功的 Agent 落地形态]]
- 系列：[[01-Wiki/entities/zero2Agent]]
