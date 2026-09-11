---
type: concept
domain: tech
tags: [agent, skills, mcp]
created: 2026-07-31
updated: 2026-08-01
sources: ["[[01-Wiki/summaries/Agent Skills 与 MCP]]", "[[01-Wiki/summaries/2026 年 AI Agent 技术全景]]"]
status: growing
---

# Agent Skills

> 标准化的程序性知识封装格式（Anthropic 2025 年提出）：以 SKILL.md 文件夹为载体，教智能体"如何正确使用工具"——相当于操作手册/SOP。与 MCP（提供"手"）互补，提供"大脑皮层"。

## 定义

连接性（Connectivity）与能力（Capability）分离：

- **MCP 的职责**：标准化访问接口，让智能体"够得着"外部数据与工具
- **Skills 的职责**：领域专业知识，告诉智能体"如何组合使用这些工具"

类比：MCP 是 USB 接口/驱动程序（设备如何连接），Skills 是软件应用（如何使用设备完成任务）。

## 机制/原理：渐进式披露（Progressive Disclosure）

三层信息按需加载，破解上下文困境：

| 层级 | 内容 | 何时在上下文 | token 成本 |
|------|------|-------------|-----------|
| L1 元数据 | frontmatter（name + description） | **始终** | ~100 token/技能 |
| L2 主体 | SKILL.md body（指令/注意/示例） | 触发后加载 | 1k-5k token |
| L3 资源 | scripts/ references/ assets/ | 按需 | 无上限（脚本执行不读入，零成本） |

**description 是触发唯一依据**——必须写清"做什么 + 什么时候用"。

## SKILL.md 规范

必需字段：`name`（kebab-case）、`description`（精确、含触发关键词、说明独特价值）
可选字段：`version`、`allowed_tools`（白名单）、`required_context`、`license`、`tags`

编写原则：
- 模块化单一职责（"通用数据分析" → 拆成多个专门技能）
- 确定性优先：精确操作封装成脚本，不让 LLM 自由发挥
- 信息只在一处存在（SKILL.md 或 references，不重复）
- 用"不做什么"的反模式清单收窄行为空间

## 与 MCP 的关系：互补非竞争

混合架构分层：应用层（Agent Skills：领域知识/工作流/最佳实践）→ 传输层（MCP：标准化接口/工具调用）→ 基础设施层（数据库/API/文件系统）。

## 边界与常见误区

- Skills ≠ 简单 Prompt：是标准化格式 + 渐进披露 + 资源捆绑的完整体系
- 行业碎片化：OpenAI/Google 有相似但不同名的实现（Custom Instructions、Grounding with Functions）
- 安全风险：Skills 含可执行脚本，存在代码注入风险；第三方技能可信度难验证
- 编写对象是 AI 不是人：README/CHANGELOG/版本记录属于噪音（见 [[01-Wiki/summaries/如何写出好的 Skill]]）

## 相关概念

- [[01-Wiki/concepts/MCP]]（连接层）、[[01-Wiki/entities/FastMCP]]（MCP 实现）
- [[01-Wiki/concepts/上下文工程]]（JIT 加载同源思想）
- 实操：[[01-Wiki/summaries/如何写出好的 Skill]]（skill-creator 最佳实践）

## 补充视角：2026 三大协议定位

> 来自 [[01-Wiki/summaries/2026 年 AI Agent 技术全景]]：Skills 与 MCP、A2A 并列为 Agent 生态三大协议之一，定位"延迟加载的 sub-agent 体系"（类比"插件系统 2.0"），见 [[01-Wiki/concepts/AI Agent]]。
