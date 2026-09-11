---
title: "Loop Engineering 深度解析与实战指南（全网最全）"
source: "https://zhuanlan.zhihu.com/p/2048317502342666078"
author:
  - "[[徐小夕​​]]"
published:
created: 2026-07-31
description: "大家好，我是徐小夕。 架构师，曾任职多家上市公司，多年架构经验，打造过上亿用户规模的产品，目前全职创业，主要聚集于“Dooring AI零代码搭建平台”和“JitWord协同AI办公软件”之前和大家分享了我们团队花1年…"
tags:
  - "clippings"
---
[收录于 · 趣谈AI](https://www.zhihu.com/column/c_1939809117427458985)

33 人赞同了该文章

> 大家好，我是徐小夕。  
> 架构师，曾任职多家上市公司，多年架构经验，打造过上亿用户规模的产品，目前全职创业，主要聚集于“Dooring AI零代码搭建平台”和“JitWord协同AI办公软件”

之前和大家分享了我们团队花1年打造的企业知识库系统 [JitKnow](https://zhuanlan.zhihu.com/p/2032172573383995422) 和对标WPS的协同AI文档 [JitWord](https://zhuanlan.zhihu.com/p/2042909204663496897) 。

上个月刚把我做的 **[HiCAD 2.0 AI渲染引擎正式发布！一句话生成酷炫3D模型](https://zhuanlan.zhihu.com/p/2038201589563909971)** 项目加上了 **[Harness Engineering](https://zhida.zhihu.com/search?content_id=276670391&content_type=Article&match_order=1&q=Harness+Engineering&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3ODU2NzU3NzMsInEiOiJIYXJuZXNzIEVuZ2luZWVyaW5nIiwiemhpZGFfc291cmNlIjoiZW50aXR5IiwiY29udGVudF9pZCI6Mjc2NjcwMzkxLCJjb250ZW50X3R5cGUiOiJBcnRpY2xlIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.SuyHbTF3t8jqJvpyLDS2ncc0iGuj8_gJm1F1IAQmwcE&zhida_source=entity)** ，还没来得及写文章分享，AI圈就出了“大事”：

6月7号谷歌工程师 Addy Osmani 发布了一篇题为《Loop Engineering》的文章  
，正式将这个正在 AI 编程圈悄然兴起的新范式推向了大众视野。

短短三天，这篇文章就引发了全球 [开发者社区](https://zhida.zhihu.com/search?content_id=276670391&content_type=Article&match_order=1&q=%E5%BC%80%E5%8F%91%E8%80%85%E7%A4%BE%E5%8C%BA&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3ODU2NzU3NzMsInEiOiLlvIDlj5HogIXnpL7ljLoiLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyNzY2NzAzOTEsImNvbnRlbnRfdHlwZSI6IkFydGljbGUiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.X6D7IdXuUMoL2NCk-A5nf-V32tA7Odvy2LtAB6QpOYc&zhida_source=entity) 的热烈讨论，被称为 " **AI 编程的第三次革命** "。

而且很多AI圈技术大佬早已带头掀起了 “AI Loop” 的热潮，比如：

![](https://pic3.zhimg.com/v2-fe109c1e8b19780065948bb12a361ab4_1440w.jpg)

作为一名 **AI** 技术博主，我花了3天时间，整理和实践了 **Loop Engineering** 范式，下面我就和大家详细聊聊这个技术，并在文章最后给大家一个详细且完整的 **Loop** 工程化的代码案例，帮助大家快速上手 **Loop Engineering** 。

## 什么是 Loop Engineering？

![](https://pic4.zhimg.com/v2-c418fbd2bde2c674670bef0aad52b407_1440w.jpg)

**Loop Engineering** 是一种全新的 AI 编程思想，用大白话来说，就是 我们 **不用手动向 AI 编程工具一条条地输入提示词，而是通过设计一个能够自动发现需求、分发任务、检查成果、记录当前状态并决定下一步做什么的自循环系统** 。

这个系统会不断地调用 AI 模型/工具，直到我们指定的目标被达成为止。

这有点像我们工程学里面的 **PDCA** 循环。

简单来说，它和传统模式的差异如下：

![](https://pic4.zhimg.com/v2-7ba51c2a2158d4e340b71e3a84e6f117_1440w.jpg)

这是一个根本性的思维转变： **从 "与 AI 对话" 转向 "编程式 AI"** 。我们的工作不再是写出完美的提示词，而是设计出完美的反馈系统。

（还记得大学计算机课程最头疼的就是“循环”遍历）

**AI 编程的三次革命： [Prompt Engineering](https://zhida.zhihu.com/search?content_id=276670391&content_type=Article&match_order=1&q=Prompt+Engineering&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3ODU2NzU3NzMsInEiOiJQcm9tcHQgRW5naW5lZXJpbmciLCJ6aGlkYV9zb3VyY2UiOiJlbnRpdHkiLCJjb250ZW50X2lkIjoyNzY2NzAzOTEsImNvbnRlbnRfdHlwZSI6IkFydGljbGUiLCJtYXRjaF9vcmRlciI6MSwiemRfdG9rZW4iOm51bGx9.HWKcxe02ZQYNvLeh7JOtlouec6-Q-ELBO3wuxTimMNg&zhida_source=entity) 到 Loop Engineering**

AI 编程在短短三年内经历了三次重大的范式转变，每一次变革都极大地提升了我们的编程“生产力”，从 **提示词** 生成代码到 **上下文 + Harness** 工程化思想，其实已经能解决大部分软件开发场景了。

比如我们以前需要手写的静态网站，现在采用 **提示词 + skills** ，基本上没程序员什么事了，公司的运营和产品经理都能搞定。

再比如一个CRM系统，我们只需要搭建一套成熟的 **上下文** 和 **Harness工程** ，再采用AI编程工具，一天时间就能完成 **80%** 的工作量，剩下的就是不断的 人工测试，优化，然后上线 。

现在的 **Loop Engineering** ，就是要把我们的人工参与部分，直接“砍掉”。下面我画了一个3阶段的演进图，来致敬这次AI变革：

![](https://picx.zhimg.com/v2-3acd938525e84a3727a6d16c09359633_1440w.jpg)

说了这么多，我想告诉大家的是，我们需要再次转变编程思维， 从“手艺活”转变成“规则制定者”。

**Loop Engineering** 并不是孤立存在的，它建立在上面我介绍的所有技术的基础之上，我总结成了四层架构，大家可以参考一下：

![](https://pica.zhimg.com/v2-9165f1aa586381b43a7626a54970074e_1440w.jpg)

下面给大家详细介绍一下这4个模块：

1. **Prompt 层** 解决 "怎么问" 的问题 —— 比如角色设定、输出格式、示例等
2. **Context 层** 解决 "让 AI 看到什么" 的问题 ——如 RAG、记忆管理、文件检索等
3. **Harness 层** 解决 "AI 在什么环境里工作" 的问题 —— 如工具调用、沙箱、权限控制，业务规则等
4. **Loop 层** 解决 "AI 做完一步后怎么办" 的问题 —— 自动检查、修正、继续、停止条件

**Loop Engineering** 是站在这四层架构的最顶端，它关心的不是单次对话的质量，而是整个系统的 **自运行** 能力。

下面就和大家上干货了，建议收藏。

## Loop Engineering 的核心原理

下面分享一下国外大佬设计的 Loop 通用五阶段循环：

**![](https://pic3.zhimg.com/v2-37c74d9a01ae663496b3b317d0bfc55a_1440w.jpg)

**

**每一个编码循环，无论是单 Agent 还是多 Agent —— 都遵循完全相同的五阶段循环，直到满足可验证的停止条件。**

上面图片中提到的5层循环，包括：

- **Discover (发现)**
- **Plan (计划)**
- **Execute (执行)**
- **Verify (验证)**
- **Iterate (迭代)**

我结合自己的理解，梳理了一个流程图，大家可以参考一下：

![](https://pic1.zhimg.com/v2-b4044d3df307015be3d4f089f1820394_1440w.jpg)

### 一个经验反思：状态存在于外部，而非上下文窗口

我认为 **Loop Engineering** 最核心的思想哲学是： **不要信任模型的上下文窗口作为持久化存储。模型会遗忘，会漂移，会压缩信息导致约束丢失。**

企业级AI开发的最佳实践是： **所有状态都存储在外部系统中** ——git 仓库、markdown 文件、数据库、issue 跟踪系统等 。 每个循环迭代都从一个全新的上下文窗口开始，但需要在实际持久化的内容基础上进行工作 。

这就是为什么最原始的 **Ralph Loop** 这么有影响力，只用了一行 bash 代码，就让AI永无止境的帮你干活：

```
while :; do cat PROMPT.md | claude-code; done
```

给大家分析一下这行循环的作用：

每次循环都会重新读取 PROMPT.md 和当前代码库状态，完全忽略之前的对话历史。

这种看似简单粗暴的方式，实际上解决了所有长对话上下文带来的问题。

（当然不得不说，那个时间段的AI能力，国内用这种做法只能是“白烧钱”）

## Loop Engineering 的六大核心要素

Addy Osmani 指出，所有现代 AI 编码工具（ [Claude Code](https://zhida.zhihu.com/search?content_id=276670391&content_type=Article&match_order=1&q=Claude+Code&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3ODU2NzU3NzMsInEiOiJDbGF1ZGUgQ29kZSIsInpoaWRhX3NvdXJjZSI6ImVudGl0eSIsImNvbnRlbnRfaWQiOjI3NjY3MDM5MSwiY29udGVudF90eXBlIjoiQXJ0aWNsZSIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.phg8MA22o9Kew55fJD2uXc5Fd4n39JUK5RIkgs3C0XA&zhida_source=entity) 、Codex 等）都已经内置了 **Loop Engineering** 所需的六大核心要素：

![](https://picx.zhimg.com/v2-88d5625d3893d758e90dc7b9d125efaf_1440w.jpg)

一旦我们理解了这些要素，就可以在任何AI工具中设计出有效的循环。下面我详细和大家介绍一下这6大要素。

### 1\. Automations (自动化)

**自动化是将一次性 AI 运行转变为真正循环的关键** 。 **它允许我们指定任务何时运行、运行频率以及在什么环境下运行。**

**这里分享一个典型案例** ：

- 每日早上 7 点30分自动运行脚本，处理前一天的 bug
- 每当有新 PR 被打开时，自动运行代码审查
- 每2小时检查一次性能基准，并进行回归
- 每周五下午5点自动生成 CHANGELOG.md

**上面的场景，对应到 Claude Code 的代码示例如下** ：

```
# 每天早上6点运行，处理CI失败
/loop "Run the triage skill on yesterday's CI failures and open PRs for fixes" --schedule "0 6 * * *"
# 运行直到所有测试通过
/goal all tests in test/auth pass and the lint step is clean
```

如果大家用了其他 AI Coding 工具，原理也是类似的。

### 2\. Worktrees (工作树)：无冲突协作并行

当我们同时运行多个 AI 时，需要考虑最多的问题就是 **文件冲突** 。 **Git 工作树** 为每个 **AI Agent** 提供了一个独立的工作目录，共享相同的仓库历史但不共享文件。

**Worktrees 的工作原理如下** ：

![](https://picx.zhimg.com/v2-6bce5a55f916c10b9351767fcbc65a95_1440w.jpg)

我个人理解其实就是 **git** 那套协作机制，我们把它搬到了 **Loop** 工程里来了。

**这里我写了一个 Claude Code 示例，供大家参考** ：

```
# 在独立的工作树中打开一个会话
claude-code --worktree feature/add-search
# 子代理自动使用独立工作树
/subagent "Build the search API" --isolation worktree
```

### 3\. Skills (技能)

**Skills 技能是将项目知识编码到磁盘上的一种方式** 。它包含了：

- **`SKILL.md ` 文件**
- **可选脚本**
- **参考资料**

采用 **文件夹** 来组织。有关 **skills** 的详细落地经验，我在之前文章里有深度分享，大家感兴趣的可以参考一下：

[![](https://picx.zhimg.com/v2-1c5fb7e9d698bb7047839682c1c8d073.jpg?source=7e7ef6e2&needBackground=1)](https://zhuanlan.zhihu.com/p/2041514021988324506)

AI Agent 可以在需要的时候调用这些技能，而不是每次都重新学习项目的约定。

**skills 核心解决的问题有** ：

- **每次会话都要重新解释项目结构**
- **AI 经常忘记编码规范和最佳实践**
- **相同的错误在不同会话中反复出现**

我个人感觉其本质上就是经验的复用包。

为了照顾到不熟悉Skills的朋友，我再分享一下 Skills 的企业级文件结构：

```
skills/
  database/
    SKILL.md
    scripts/
      migrate.sh
    references/
      schema.md
  api/
    SKILL.md
  testing/
    SKILL.md
```

**Skills.md** 的文件示例如下：

```
# Database Skill
## 我们如何写数据库代码
- 使用Knex.js进行所有数据库操作
- 所有迁移文件都放在migrations/目录下
- 每个表必须有created_at和updated_at字段
- 永远不要在生产中使用ALTER TABLE DROP COLUMN
## 如何运行迁移
\`\`\`bash
npm run migrate
```

**4\. [Connectors](https://zhida.zhihu.com/search?content_id=276670391&content_type=Article&match_order=1&q=Connectors&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3ODU2NzU3NzMsInEiOiJDb25uZWN0b3JzIiwiemhpZGFfc291cmNlIjoiZW50aXR5IiwiY29udGVudF9pZCI6Mjc2NjcwMzkxLCJjb250ZW50X3R5cGUiOiJBcnRpY2xlIiwibWF0Y2hfb3JkZXIiOjEsInpkX3Rva2VuIjpudWxsfQ.as45Q5BHnSqvTCPqPCiHTuC_8-jgidNs_KTDYkYHzKU&zhida_source=entity) (连接器)**

连接器(基于MCP协议)主要作用是 **让循环能够与我们已在使用的工具进行交互** 。它是" **AI告诉你该做什么事情** "和" **AI实际帮你完成了哪些事情** "之间的关键区别。

这里分享几个常见连接器，供大家研究参考：

- Issue跟踪：GitHub Issues、Linear、Jira 等
- 通讯：Slack、Discord、Teams 等
- 数据库：PostgreSQL、MySQL、MongoDB 等
- CI/CD： [GitHub Actions](https://zhida.zhihu.com/search?content_id=276670391&content_type=Article&match_order=1&q=GitHub+Actions&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3ODU2NzU3NzMsInEiOiJHaXRIdWIgQWN0aW9ucyIsInpoaWRhX3NvdXJjZSI6ImVudGl0eSIsImNvbnRlbnRfaWQiOjI3NjY3MDM5MSwiY29udGVudF90eXBlIjoiQXJ0aWNsZSIsIm1hdGNoX29yZGVyIjoxLCJ6ZF90b2tlbiI6bnVsbH0.weaji4laMgo8PrqnZ8dOqTCZZ-oae-5sxWSfkZw_TF4&zhida_source=entity) 、Jenkins、GitLab CI 等
- 云服务：AWS、GCP、Azure 等

**5\. Sub-agents(子代理)**

最高效的循环设计原则是： **一个代理负责实现，另一个代理负责验证** 。

我个人认为，让编写代码的模型来评判自己的代码，就像让学生给自己的考试打分一样不可靠。所以一定要让不同的 **Agent** 来实现从生产到检验的完整流程。

分享一下经典的三层代理协作架构：

![](https://pic1.zhimg.com/v2-64783ed007ee90824b388cdbad85bfbc_1440w.jpg)

### 6\. State (状态)：Loop范式的记忆保障

**模型会遗忘，但仓库不会** 。所有复杂运行循环都依赖外部状态来记住自己的运行阶段，比如什么已经完成了，什么还在运行阶段。

**常见的状态存储方式有** ：

- **Markdown 文件** ： `STATE.md` 、 `AGENTS.md` 、 `PROGRESS.md`
- **任务队列** ： `tasks.json`
- **Issue 跟踪系统** ：GitHub Issues、Linear
- **数据库** ：SQLite、PostgreSQL

**大家可以参考上面我分享的3种方式，来设计 Loop 的记忆层。下面分享一个实际的案例，说明如何设计记忆层** ：

```
# Loop State
## 2026-06-10
### 已完成
- [x] 修复#123：登录页面CSS问题
- [x] 更新依赖包到最新版本
### 进行中
- [ ] 修复#124：API返回500错误
  - 尝试1：修改auth中间件，测试失败
  - 尝试2：检查数据库连接，正在进行
### 待处理
- [ ] 添加单元测试覆盖auth模块
- [ ] 重构用户服务
```

## Loop Engineering 的两大循环类型：闭环 vs 开环

**Loop Engineering** 有两种基本类型，分别适用于不同的场景，我整理了一个表格，大家可以对比参考一下：

![](https://pica.zhimg.com/v2-834c7dc0f86aea9a620cd7270f2a33d8_1440w.jpg)

**闭环的五个必要组成包括** ：

1. **明确的目标 (Goal)** 精确地定义 "完成" 的样子
2. **充足的上下文 (Context)** `比如提供VISION.md` 、 `ARCHITECTURE.md` 、 `RULES.md等文件`
3. **受限的动作 (Action)** 只允许使用必要的工具（约束行为）
4. **客观的反馈 (Feedback)** 包括如测试、lint、类型检查等
5. **清晰的停止条件 (Stop Condition)** 可验证的成功标准/结束条件

**这里我个人是建议大家从闭环开始** 。只有当我们完全掌握了闭环设计，并且有足够的预算和评估能力时，再尝试开环。

## 实战案例：构建自动修复 CI 失败的循环

接下来我带大家通过一个完整的实战案例来学习如何设计和实现一个 **Loop Engineering** 系统。

这里我将构建一个 **每天早上自动运行，修复前一天 CI 失败** 的循环。

### 步骤 1：准备项目结构

首先，在我们的项目中创建必要的文件夹和文件：

```
your-project/
  .claude/
    agents/
      ci-fixer.toml
      code-reviewer.toml
  skills/
    ci-triage/
      SKILL.md
    code-fixer/
      SKILL.md
  STATE.md
  .github/
    workflows/
      ci-fix-loop.yml
```

### 步骤 2：创建 CI 分类技能

`这里直接分享我的 skills/ci-triage/SKILL.md`:

```
# CI Triage Skill
## 目的
分析CI失败日志，确定问题的根本原因和修复优先级。
## 输入
- GitHub Actions CI运行日志
- 失败的测试名称和错误信息
## 输出
- 问题分类：测试失败、lint错误、构建错误、依赖问题、其他
- 根本原因分析
- 估计修复难度：简单、中等、困难
- 是否可以自动修复：是/否
## 分类规则
- **简单**：语法错误、拼写错误、简单的lint警告
- **中等**：测试失败但错误信息明确、依赖版本冲突
- **困难**：间歇性测试失败、复杂的逻辑错误、性能问题
## 输出格式
\`\`\`json
{
  "issue_type": "test_failure",
  "root_cause": "The user service is returning null when user not found",
  "difficulty": "medium",
  "auto_fixable": true,
  "file_path": "src/services/user.js",
  "line_number": 42
}
```

**步骤3：创建代码修复技能**

skills/code-fixer/SKILL.md 的内容设计如下:

```
# Code Fixer Skill
## 目的
根据CI失败信息修复代码问题。
## 修复原则
1. 只修复与CI失败直接相关的问题
2. 不要重构不相关的代码
3. 保持代码风格与现有代码一致
4. 如果测试失败，添加或修复相应的测试
5. 所有修复必须通过lint和类型检查
## 输出
- 修改后的代码文件
- 修复说明
- 运行测试的结果
```

### 步骤 4：配置子代理

`.claude/agents/ci-fixer.toml 代码如下`:

```
name = "ci-fixer"
description = "Fixes CI failures"
instructions = "Use the code-fixer skill to fix the specified CI issue. Run tests after making changes. If tests pass, open a PR."
model = "claude-3-5-sonnet-20260514"
tools = ["edit", "run-command", "git", "github"]
skills = ["code-fixer"]
```

.claude/agents/ [code-reviewer](https://zhida.zhihu.com/search?content_id=276670391&content_type=Article&match_order=2&q=code-reviewer&zd_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ6aGlkYV9zZXJ2ZXIiLCJleHAiOjE3ODU2NzU3NzMsInEiOiJjb2RlLXJldmlld2VyIiwiemhpZGFfc291cmNlIjoiZW50aXR5IiwiY29udGVudF9pZCI6Mjc2NjcwMzkxLCJjb250ZW50X3R5cGUiOiJBcnRpY2xlIiwibWF0Y2hfb3JkZXIiOjIsInpkX3Rva2VuIjpudWxsfQ.PQ8lLYYt7AxCmCFf1aOttjszHKemT0ybpu0EFphqx_g&zhida_source=entity).toml 代码如下:

```
name = "code-reviewer"
description = "Reviews code changes"
instructions = "Review the code changes. Check for correctness, security issues, and code style. Approve or request changes."
model = "claude-3-opus-20260301"
reasoning_effort = "high"
tools = ["read", "lint", "security-scan"]
```

### 步骤 5：创建 GitHub Actions 工作流

`这里涉及到 Github 的自动部署工作流， 大家不熟悉的可以看我之前的文章，这里就直接上实际的代码了。`

`.github/workflows/ci-fix-loop.yml 代码如下`:

```
name: CI Fix Loop
on:
  schedule:
    - cron: '0 6 * * *'  # 每天早上6点运行
  workflow_dispatch:  # 允许手动触发
jobs:
  fix-ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Configure Claude Code
        run: |
          claude-code config set api-key ${{ secrets.ANTHROPIC_API_KEY }}
          claude-code config set github-token ${{ secrets.GITHUB_TOKEN }}

      - name: Run CI fix loop
        run: |
          claude-code --worktree ci-fix-$(date +%Y%m%d) "
            Use the ci-triage skill to analyze all failed CI runs from yesterday.
            For each auto-fixable issue:
              1. Create a new branch
              2. Spawn the ci-fixer subagent to fix the issue
              3. Spawn the code-reviewer subagent to review the fix
              4. If approved, open a PR with a clear description
              5. Update STATE.md with the results
            Write all findings and actions to STATE.md.
          "

      - name: Commit state changes
        run: |
          git config --local user.email "ai-bot@example.com"
          git config --local user.name "AI Fix Bot"
          git add STATE.md
          git commit -m "Update CI fix loop state for $(date +%Y-%m-%d)" || true
          git push
```

### 步骤 6：初始化状态文件

`这一步很简单但也非常关键， 大家需要重点关注。`

`STATE.md 内容如下`:

```
# CI Fix Loop State
## 运行历史
### 2026-06-10
- 发现3个CI失败
- 自动修复2个简单问题
- 1个复杂问题标记为需要人工干预
- 打开PR: #125, #126
## 待处理
- [ ] 修复#127：复杂的测试失败，需要人工审查
```

### 下面我画了一个这个循环如何工作的流程图，大家可以参考一下：

![](https://pica.zhimg.com/v2-c6dd476b2cb6671f0b85859bf2d64024_1440w.jpg)

## 成本与安全考量

**Loop Engineering** 虽然强大，但如果使用不当，可能会带来高昂的成本和安全风险。

很显然， **Loop** 可能会消耗大量的 API 额度。在中等规模代码库上运行 50 -100 次迭代可能花费 ¥500 - 1000，甚至更高。

所以我们需要设计一套可靠的成本管控策略，下面分享一下我研究下来的一下方法和经验：

1. **设置严格的迭代限制** 永远不要省略 `max-iterations（最大迭代数）`
2. **从小规模开始** 先在 10-20 次迭代上测试，观察行为后再逐步扩大
3. **计算 ROI** 这里需要设计一套符合公司自身的成本管控标准，比如 ¥500 的循环节省 20 小时工作？值得。完成 30 分钟能做的任务？不值得
4. **使用成本较低的模型** 比如对于简单任务使用 Sonnet 而不是 Opus
5. **监控和警报** 设置每日 API 使用警报，避免意外账单

### 下面再来分享一下技术层面的安全实践：

![](https://pic2.zhimg.com/v2-5bac46290504857a9abaf4371617e6af_1440w.jpg)

## 最后

当然还有很多落地的实践，由于篇幅太长，我会在专栏中和大家深度分享，下面分享一下 Loop Engineering 的最佳实践，大家可以参考学习一下：

![](https://picx.zhimg.com/v2-024de0b4dda1202de59917fee703671f_1440w.jpg)

**Loop Engineering** 目前还处于早期阶段，但它已经展示出了巨大的潜力。后续我会持续实践和研究，挖掘更多的应用场景和价值，如果大家有好的经验和想法，也欢迎留言区交流反馈～

发布于 2026-06-11 10:23・重庆[万小智AI建站：域名备案证书一体，首月15元送灵感值](https://click.aliyun.com/m/20000000463/?spu=biz%3D0%26ci%3D3770689%26si%3D14d8691d-7fb0-474e-bf19-b29b08c81c47%26ts%3D1785502973%26zid%3D1629)

[

阿里云17年技术沉淀，域名、备案、证书、解析无感集成，对话生成专业网站。不懂技术也能快速上线企业官网、品牌...

](https://click.aliyun.com/m/20000000463/?spu=biz%3D0%26ci%3D3770689%26si%3D14d8691d-7fb0-474e-bf19-b29b08c81c47%26ts%3D1785502973%26zid%3D1629)

赞同 33