---
type: summary
domain: tech
tags: [agent, skills, mcp]
created: 2026-07-31
updated: 2026-07-31
sources: ["[[00-Raw/agent-skills/Extra05-Agent Skills与MCP]]"]
status: growing
---

# Agent Skills 与 MCP：智能体能力扩展的两种范式

> hello-agents 附加章节 Extra05：Agent Skills 是什么、渐进式披露机制、与 MCP 的本质区别与互补关系、混合架构最佳实践。

## 核心观点

- **连接性与能力分离**：MCP 提供"手"（标准化访问接口，够得着外部数据/工具）；Skills 提供"操作手册/SOP"（领域专业知识，教模型如何组合使用工具）（→ [[01-Wiki/concepts/Agent Skills]]）
- **Agent Skills 是标准化的程序性知识封装格式**：核心是 `SKILL.md` 文件夹，Anthropic 2025 年初提出
- **渐进式披露三层架构**：L1 元数据（frontmatter，~100 token/技能，始终在上下文）→ L2 技能主体（触发后加载，1-5k token）→ L3 附加资源（scripts/references，按需加载，脚本执行不读入）
- **实测效果**：传统 MCP 初始加载 16,000 token vs Skills 包装后仅 500 token；token 消耗降低 90%+
- **互补非竞争**：MCP 解决"能连接"，Skills 解决"知道怎么用"；典型工作流 = Skills 识别任务→分解子步骤→MCP 执行→Skills 解读结果
- **行业演进**：OpenAI（Custom Instructions/GPTs 知识库）、Google Vertex（Grounding with Functions）本质是 Skills 理念的不同实现；预测未来出现统一能力描述协议 + 能力包管理生态

## 关键数据

| 指标 | 数值 | 出处 |
|------|------|------|
| 元数据消耗 | ~100 token/技能；50 个技能 ≈ 5,000 token | §渐进式披露 |
| 案例对比 | MCP 16k token vs Skills 网关 500 token | §实测 |
| SKILL.md 主体 | 1,000-5,000 token | §L2 |

## 亮点与不足

- 亮点：MCP 类比"USB 接口/驱动"，Skills 类比"软件应用"，直觉建立到位；SKILL.md 完整规范（必需/可选字段）+ 好/坏 description 对比 + 完整 MySQL 分析技能案例
- 亮点：明确"描述就是触发依据"、allowed_tools 白名单、确定性优先（脚本而非 LLM 生成）
- 不足：Skills 格式尚未统一（碎片化风险）；含可执行脚本存在代码注入风险；内容偏 Anthropic 视角

## 与既有知识的联系

- 直接扩展 [[01-Wiki/concepts/MCP]]：MCP 解决连接性，本页补充知识层
- 与 [[01-Wiki/entities/FastMCP]]（MCP 服务端实现）、[[01-Wiki/entities/LangChain]]（MCP 客户端适配）形成完整工具链
- 渐进式披露思想与 [[01-Wiki/concepts/上下文工程]]（9.2.2 JIT 上下文）同源

## 延伸问题

- Skills 安全实践：第三方技能可信度验证与代码审计
- SKILL.md 与各框架（Codex/Claude）兼容性差异
