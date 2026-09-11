---
type: summary
domain: tech
tags: [agent, skills, prompt]
created: 2026-07-31
updated: 2026-07-31
sources: ["[[00-Raw/agent-skills/Extra08-如何写出好的Skill]]"]
status: growing
---

# 如何写出好的 Skill

> hello-agents 附加章节 Extra08：沿着 skill-creator 的设计思路，讲解写 skill 的最佳实践——根本约束、信息分层、自由度光谱、六步创建流程。

## 核心观点

- **Skill 是给 AI 写指令，不是给人**：读者是 AI，不需要背景/版本记录/人类文档（README/CHANGELOG 属禁止清单）
- **根本约束：简洁**——上下文窗口是公共资源，每句话要值得它占用的 token；前提假设"AI 已经很聪明，只补充它不知道的"
- **信息放哪里（三级分层）**：L1 元数据（frontmatter，~100 词，始终在上下文，**description 是触发唯一依据**）→ L2 body（触发后加载，<5k 词）→ L3 scripts/references/assets（按需；**scripts 执行而不读入，零 token 成本**）
- **给 AI 多大自由度（自由度光谱）**：任务越脆弱（做对只有一种方式）→ 越低自由度 → 用脚本锁死；越灵活 → 文字引导。**"不做什么"比"做什么"更精确**（反模式清单 vs 正面描述）
- **六步创建流程**：理解（具体例子建立共识）→ 规划（可复用资源清单）→ 初始化（必须用 init_skill.py）→ 编辑（先资源后 SKILL.md）→ 校验（quick_validate.py）→ 迭代
- **三个脚本形成确定性保障链**：init_skill.py（输入保障）→ AI 创造性编写 → quick_validate.py（输出保障）；generate_openai_yaml.py 锁死格式（25-64 字符等）

## 关键数据

| 指标 | 数值 | 出处 |
|------|------|------|
| L1 元数据 | ~100 词 | §5.1 |
| L2 body 上限 | <5k 词（500 行内） | §5.1 |
| openai.yaml 字段约束 | short_description 25-64 字符 | §6.2 |
| frontmatter 允许键 | name/description/license/allowed-tools/metadata 仅 5 个 | §6.5 |

## 亮点与不足

- 亮点：kebab-case 命名、description 写法（"做什么+什么时候用"）、三种渐进披露模式（高层指南+参考/按领域组织/条件性细节）、层错位错误表（触发条件放 body、参考塞 SKILL.md 等 6 类常见错误）
- 不足：以 Codex 的 skill-creator 为唯一蓝本，其他实现（Claude Skills）规范未覆盖

## 与既有知识的联系

- 深化 [[01-Wiki/concepts/Agent Skills]]：本页是"怎么写"，前者是"是什么"
- 渐进式披露与 [[01-Wiki/concepts/上下文工程]] 的 JIT 理念、[[01-Wiki/concepts/RAG]] 的切块检索思想一致——都是有限上下文下的信息管理

## 延伸问题

- 本知识库自身的 AGENTS.md 是否符合这些最佳实践（自查：是否够简洁、指令是否祈使、有无人类文档噪音）
