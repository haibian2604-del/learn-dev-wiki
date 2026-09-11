---
title: "什么是 Agent"
source: "https://onefly.top/zero2Agent/learn-agent-basic/01-what-is-an-agent/index.html"
author:
published:
created: 2026-08-24
description: "从工程角度理解 Agent 的最小定义"
tags:
  - "clippings"
---
很多人第一次接触 Agent 时，会把它理解成下面几种东西之一：

- 一个更聪明的聊天机器人
- 一个能自动调用工具的 LLM
- 一个会自己规划任务的系统
- 一个听起来比 Workflow 更高级的说法

这些理解都碰到了一点，但都不够完整。

## 一个更可用的定义

从工程角度看， **Agent 是一个围绕目标持续推进任务的系统** 。  
它通常具备下面几种能力：

- 接收目标，而不是只处理单轮输入
- 保留状态，而不是每次都像第一次对话
- 根据中间结果改变后续动作
- 在需要时调用外部工具
- 在不确定环境里迭代尝试，而不是一步写死

这意味着 Agent 的重点不是”模型更强”，而是”系统闭环更完整”。

## 一个值得记住的公式

如果只用一句话概括 Agent 的组成：

> **Agent = LLM + Context + Tools**

- **LLM** ：提供理解、推理和生成能力
- **Context** ：决定模型每一步能看到什么信息（指令、历史、状态、检索结果）
- **Tools** ：让系统获得外部行动能力（查询、执行、写入）

这个公式的价值在于：它把注意力从”模型多强”转移到”系统怎么组织”。

很多人直觉上认为 Agent 能力的上限取决于模型。但实际工程中， **Context 的质量和 Tools 的设计往往比模型本身更决定系统表现** 。同样的模型，在不同的上下文策略和工具配置下，行为差距巨大。

这也是为什么”Context Engineering”（上下文工程）在 2025-2026 年成为行业高频词——它不是 Prompt Engineering 的换皮说法，而是把”送进模型的完整信息组合”作为一等工程问题来设计。

## 先不要把 Agent 想得太神

很多介绍会把 Agent 说得很像“自主智能体”，但在大多数工程场景里，你更应该把它看成：

> 一个由大模型驱动、能根据状态决定下一步动作的任务执行系统。

它并不一定真的“自主”，也不一定总要长期运行、多轮反思、复杂规划。  
很多实用 Agent 其实都很朴素，只是比普通问答系统多了几个关键能力。

## Agent 的最小闭环

先看最小版本，不考虑复杂框架：

```
#mermaid-1787569748518{font-family:"Noto Sans SC","Inter",sans-serif;font-size:14px;fill:#ccc;}#mermaid-1787569748518 .error-icon{fill:#a44141;}#mermaid-1787569748518 .error-text{fill:#ddd;stroke:#ddd;}#mermaid-1787569748518 .edge-thickness-normal{stroke-width:2px;}#mermaid-1787569748518 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-1787569748518 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-1787569748518 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-1787569748518 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-1787569748518 .marker{fill:#10b981;stroke:#10b981;}#mermaid-1787569748518 .marker.cross{stroke:#10b981;}#mermaid-1787569748518 svg{font-family:"Noto Sans SC","Inter",sans-serif;font-size:14px;}#mermaid-1787569748518 .label{font-family:"Noto Sans SC","Inter",sans-serif;color:#ccc;}#mermaid-1787569748518 .cluster-label text{fill:#F9FFFE;}#mermaid-1787569748518 .cluster-label span{color:#F9FFFE;}#mermaid-1787569748518 .label text,#mermaid-1787569748518 span{fill:#ccc;color:#ccc;}#mermaid-1787569748518 .node rect,#mermaid-1787569748518 .node circle,#mermaid-1787569748518 .node ellipse,#mermaid-1787569748518 .node polygon,#mermaid-1787569748518 .node path{fill:#1f2020;stroke:#81B1DB;stroke-width:1px;}#mermaid-1787569748518 .node .label{text-align:center;}#mermaid-1787569748518 .node.clickable{cursor:pointer;}#mermaid-1787569748518 .arrowheadPath{fill:lightgrey;}#mermaid-1787569748518 .edgePath .path{stroke:#10b981;stroke-width:2.0px;}#mermaid-1787569748518 .flowchart-link{stroke:#10b981;fill:none;}#mermaid-1787569748518 .edgeLabel{background-color:#0d0d12;text-align:center;}#mermaid-1787569748518 .edgeLabel rect{opacity:0.5;background-color:#0d0d12;fill:#0d0d12;}#mermaid-1787569748518 .cluster rect{fill:#13131f;stroke:rgba(255, 255, 255, 0.25);stroke-width:1px;}#mermaid-1787569748518 .cluster text{fill:#F9FFFE;}#mermaid-1787569748518 .cluster span{color:#F9FFFE;}#mermaid-1787569748518 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:"Noto Sans SC","Inter",sans-serif;font-size:12px;background:#161e2e;border:1px solid rgba(255, 255, 255, 0.25);border-radius:2px;pointer-events:none;z-index:100;}#mermaid-1787569748518 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#ccc;}#mermaid-1787569748518 :root{--mermaid-font-family:"trebuchet ms",verdana,arial,sans-serif;}需要更多信息信息已足够接收目标读取上下文决定下一步调用工具输出结果获取返回结果更新状态
```

举个简单例子：

> 目标：分析某个币种今天是否存在异常风险。

一个最小 Agent 可能会这样工作：

1. 读取当前任务目标和已有上下文。
2. 判断下一步需要抓取哪些市场信息。
3. 调用工具查询价格、成交量、新闻或链上数据。
4. 根据返回结果更新内部状态。
5. 如果信息不足，继续补充查询。
6. 如果信息足够，输出风险判断和解释。

这里最关键的不是“它会说话”，而是它会围绕目标不断推进。

## Agent 和普通 LLM App 的区别

普通 LLM App 常常更像这样：

```
#mermaid-1787569748548{font-family:"Noto Sans SC","Inter",sans-serif;font-size:14px;fill:#ccc;}#mermaid-1787569748548 .error-icon{fill:#a44141;}#mermaid-1787569748548 .error-text{fill:#ddd;stroke:#ddd;}#mermaid-1787569748548 .edge-thickness-normal{stroke-width:2px;}#mermaid-1787569748548 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-1787569748548 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-1787569748548 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-1787569748548 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-1787569748548 .marker{fill:#10b981;stroke:#10b981;}#mermaid-1787569748548 .marker.cross{stroke:#10b981;}#mermaid-1787569748548 svg{font-family:"Noto Sans SC","Inter",sans-serif;font-size:14px;}#mermaid-1787569748548 .label{font-family:"Noto Sans SC","Inter",sans-serif;color:#ccc;}#mermaid-1787569748548 .cluster-label text{fill:#F9FFFE;}#mermaid-1787569748548 .cluster-label span{color:#F9FFFE;}#mermaid-1787569748548 .label text,#mermaid-1787569748548 span{fill:#ccc;color:#ccc;}#mermaid-1787569748548 .node rect,#mermaid-1787569748548 .node circle,#mermaid-1787569748548 .node ellipse,#mermaid-1787569748548 .node polygon,#mermaid-1787569748548 .node path{fill:#1f2020;stroke:#81B1DB;stroke-width:1px;}#mermaid-1787569748548 .node .label{text-align:center;}#mermaid-1787569748548 .node.clickable{cursor:pointer;}#mermaid-1787569748548 .arrowheadPath{fill:lightgrey;}#mermaid-1787569748548 .edgePath .path{stroke:#10b981;stroke-width:2.0px;}#mermaid-1787569748548 .flowchart-link{stroke:#10b981;fill:none;}#mermaid-1787569748548 .edgeLabel{background-color:#0d0d12;text-align:center;}#mermaid-1787569748548 .edgeLabel rect{opacity:0.5;background-color:#0d0d12;fill:#0d0d12;}#mermaid-1787569748548 .cluster rect{fill:#13131f;stroke:rgba(255, 255, 255, 0.25);stroke-width:1px;}#mermaid-1787569748548 .cluster text{fill:#F9FFFE;}#mermaid-1787569748548 .cluster span{color:#F9FFFE;}#mermaid-1787569748548 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:"Noto Sans SC","Inter",sans-serif;font-size:12px;background:#161e2e;border:1px solid rgba(255, 255, 255, 0.25);border-radius:2px;pointer-events:none;z-index:100;}#mermaid-1787569748548 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#ccc;}#mermaid-1787569748548 :root{--mermaid-font-family:"trebuchet ms",verdana,arial,sans-serif;}用户输入模型生成输出结果
```

它可以很好用，但通常是一次性响应。

而 Agent 更像这样：

```
#mermaid-1787569748554{font-family:"Noto Sans SC","Inter",sans-serif;font-size:14px;fill:#ccc;}#mermaid-1787569748554 .error-icon{fill:#a44141;}#mermaid-1787569748554 .error-text{fill:#ddd;stroke:#ddd;}#mermaid-1787569748554 .edge-thickness-normal{stroke-width:2px;}#mermaid-1787569748554 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-1787569748554 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-1787569748554 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-1787569748554 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-1787569748554 .marker{fill:#10b981;stroke:#10b981;}#mermaid-1787569748554 .marker.cross{stroke:#10b981;}#mermaid-1787569748554 svg{font-family:"Noto Sans SC","Inter",sans-serif;font-size:14px;}#mermaid-1787569748554 .label{font-family:"Noto Sans SC","Inter",sans-serif;color:#ccc;}#mermaid-1787569748554 .cluster-label text{fill:#F9FFFE;}#mermaid-1787569748554 .cluster-label span{color:#F9FFFE;}#mermaid-1787569748554 .label text,#mermaid-1787569748554 span{fill:#ccc;color:#ccc;}#mermaid-1787569748554 .node rect,#mermaid-1787569748554 .node circle,#mermaid-1787569748554 .node ellipse,#mermaid-1787569748554 .node polygon,#mermaid-1787569748554 .node path{fill:#1f2020;stroke:#81B1DB;stroke-width:1px;}#mermaid-1787569748554 .node .label{text-align:center;}#mermaid-1787569748554 .node.clickable{cursor:pointer;}#mermaid-1787569748554 .arrowheadPath{fill:lightgrey;}#mermaid-1787569748554 .edgePath .path{stroke:#10b981;stroke-width:2.0px;}#mermaid-1787569748554 .flowchart-link{stroke:#10b981;fill:none;}#mermaid-1787569748554 .edgeLabel{background-color:#0d0d12;text-align:center;}#mermaid-1787569748554 .edgeLabel rect{opacity:0.5;background-color:#0d0d12;fill:#0d0d12;}#mermaid-1787569748554 .cluster rect{fill:#13131f;stroke:rgba(255, 255, 255, 0.25);stroke-width:1px;}#mermaid-1787569748554 .cluster text{fill:#F9FFFE;}#mermaid-1787569748554 .cluster span{color:#F9FFFE;}#mermaid-1787569748554 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:"Noto Sans SC","Inter",sans-serif;font-size:12px;background:#161e2e;border:1px solid rgba(255, 255, 255, 0.25);border-radius:2px;pointer-events:none;z-index:100;}#mermaid-1787569748554 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#ccc;}#mermaid-1787569748554 :root{--mermaid-font-family:"trebuchet ms",verdana,arial,sans-serif;}目标多步决策工具调用状态更新继续执行最终完成
```

前者强调一次生成，后者强调持续执行。

## Agent 通常包含什么

一个稍微像样的 Agent，往往会逐步引入下面这些部分：

- `State` ：当前任务状态
- `Tools` ：查询、搜索、执行、写入等外部能力
- `Memory` ：会话内或跨会话记忆
- `Planner` ：决定下一步做什么
- `Policy / Guardrails` ：限制它不能乱做
- `Evaluator` ：判断结果是否足够好

不是每个 Agent 都必须全部具备，但越接近真实业务，这些模块就越重要。

## 一个容易踩的坑

很多 Demo 只要实现了“模型调用工具”就开始自称 Agent。  
但如果一个系统：

- 没有明确状态
- 没有执行闭环
- 没有结束条件
- 无法根据结果调整下一步

那它更像是“带工具调用的 LLM”，而不一定是一个完整 Agent。

## 先记住这句话

判断一个系统是不是 Agent，不要先看它用了什么框架，也不要先看它会不会调用工具。

先看三件事：

1. 它是不是围绕目标持续推进任务。
2. 它会不会根据中间状态改变行为。
3. 它是不是一个闭环系统，而不是一次性生成。

## 小结

Agent 的本质不是“更会聊天”，而是“更会执行”。

真正有价值的 Agent，通常不是在 UI 上看起来更智能，而是在系统层面更能处理：

- 多步任务
- 外部环境变化
- 工具协作
- 状态更新
- 不确定条件下的决策

下一篇建议接着看：

- [Workflow 和 Agent 的区别](https://onefly.top/zero2Agent/learn-agent-basic/02-workflow-vs-agent/index.html)