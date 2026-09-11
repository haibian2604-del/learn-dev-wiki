---
type: concept
domain: tech
tags: [agent]
created: 2026-08-27
updated: 2026-08-27
sources: ["[[01-Wiki/summaries/Agent 自进化：不改权重也能持续变强]]"]
status: growing
---

# Agent 自进化（Agent Self-Evolution）

## 定义

在**不修改模型权重**的前提下，通过运行时机制让 Agent 持续自我改进。动机：模型权重静态但世界在变（需求漂移/API 更新/规则调整），人工迭代太慢（几十 prompt 模板 + 上百工具），理想状态是"Agent 通过使用自己来改善自己"——不是 AGI 自我意识，而是工程上可实现的反馈闭环。

## 三种自进化机制

1. **经验学习（Experience Learning）——最实用**：任务轨迹结构化保存，类似任务检索相关经验注入 Context。比 RL 高效（In-Context Learning 1-5 案例即时生效 vs RL 数千-数万样本，样本效率高 250-400 倍）。工程：经验 Schema（task_type/input_summary/trajectory/lessons/context_tags/success_count）→ 相关性检索（task_type 匹配 + embedding 相似度 + 标签重叠 + 新近性 + 成功率加权）→ 只注入 lessons 与关键路径。过期清理：时间衰减/失败追踪/自动淘汰（failure 占比 >0.3 归档）/环境变更感知。
2. **工具创造（Tool Creator）**：发现现有工具无法完成子步骤 → 生成新工具代码（函数+Schema+文档）→ 自动测试验证 → 加入工具库。能力边界动态扩展。**安全约束**：沙箱执行、权限继承（新工具 ≤ 创建者权限）、人工审批（涉外部调用）、自动回滚。
3. **策略自优化（Prompt/Strategy）——风险最高**：保存有效 few-shot 示例自动注入、edge case 处理策略固化为规则（含原因与验证次数）、System Prompt 版本化管理（v1.0→v1.1→v1.2 保留回滚）。

## 风险与约束

- **错误经验被固化** → 新经验成功复用 ≥3 次才提权重、失败立即标记、定期固定测试集验证
- **自我修改不可预测** → 每次变更版本快照、监控关键指标、下降超阈值自动回滚
- **能力膨胀超安全边界** → **权限不随能力扩展**、工具总数上限、敏感操作审批、定期审计
- **评估漂移**（Agent 自改"成功"定义致指标虚高）→ 维护人工 golden test set 永不让 Agent 修改、内外评估独立运行偏差告警

## 自进化 vs 训练（梯度两端）

| | 自进化（运行时） | SFT/RL（训练时） |
|---|---|---|
| 改变 | Context/Tools/Prompt | 模型权重 |
| 生效 | 即时 | 训练周期 |
| 可逆 | 秒级回滚 | 需重训 |
| 样本效率 | 高（1-5 案例） | 低 |
| 能力上限 | 受限于 ICL | 可突破边界 |

配合使用：日常用自进化 → 积累后用 SFT 把通用模式"烧入"权重 → 清理对应经验库。梯度：Context 注入（本次生效）→ 经验库（跨会话）→ Prompt 修改（持久化）→ SFT/RL（权重）。

## 关联

- 上游：[[01-Wiki/concepts/AI Agent]]、[[01-Wiki/concepts/Coding Agent]]、[[01-Wiki/concepts/Agent 评估]]
- 论文延伸：[[01-Wiki/concepts/时空可组合性]]（自进化 Harness 的形式化基础）
- 实战来源：[[01-Wiki/summaries/Agent 自进化：不改权重也能持续变强]]
