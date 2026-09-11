---
title: "Workflow 和 Agent 的区别"
source: "https://onefly.top/zero2Agent/learn-agent-basic/02-workflow-vs-agent/index.html"
author:
published:
created: 2026-08-24
description: "理清 Workflow、LLM App 与 Agent 的边界"
tags:
  - "clippings"
---
这是 Agent 学习里最容易混淆的问题之一。

很多人看到一个系统会：

就会自然地把它叫成 Agent。

但更准确地说，这里面至少有三类不同系统：

## 先给一个简单判断标准

### 1\. 普通 LLM App

特点是一次输入，一次输出。

```
#mermaid-1787575711443{font-family:"Noto Sans SC","Inter",sans-serif;font-size:14px;fill:#ccc;}#mermaid-1787575711443 .error-icon{fill:#a44141;}#mermaid-1787575711443 .error-text{fill:#ddd;stroke:#ddd;}#mermaid-1787575711443 .edge-thickness-normal{stroke-width:2px;}#mermaid-1787575711443 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-1787575711443 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-1787575711443 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-1787575711443 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-1787575711443 .marker{fill:#10b981;stroke:#10b981;}#mermaid-1787575711443 .marker.cross{stroke:#10b981;}#mermaid-1787575711443 svg{font-family:"Noto Sans SC","Inter",sans-serif;font-size:14px;}#mermaid-1787575711443 .label{font-family:"Noto Sans SC","Inter",sans-serif;color:#ccc;}#mermaid-1787575711443 .cluster-label text{fill:#F9FFFE;}#mermaid-1787575711443 .cluster-label span{color:#F9FFFE;}#mermaid-1787575711443 .label text,#mermaid-1787575711443 span{fill:#ccc;color:#ccc;}#mermaid-1787575711443 .node rect,#mermaid-1787575711443 .node circle,#mermaid-1787575711443 .node ellipse,#mermaid-1787575711443 .node polygon,#mermaid-1787575711443 .node path{fill:#1f2020;stroke:#81B1DB;stroke-width:1px;}#mermaid-1787575711443 .node .label{text-align:center;}#mermaid-1787575711443 .node.clickable{cursor:pointer;}#mermaid-1787575711443 .arrowheadPath{fill:lightgrey;}#mermaid-1787575711443 .edgePath .path{stroke:#10b981;stroke-width:2.0px;}#mermaid-1787575711443 .flowchart-link{stroke:#10b981;fill:none;}#mermaid-1787575711443 .edgeLabel{background-color:#0d0d12;text-align:center;}#mermaid-1787575711443 .edgeLabel rect{opacity:0.5;background-color:#0d0d12;fill:#0d0d12;}#mermaid-1787575711443 .cluster rect{fill:#13131f;stroke:rgba(255, 255, 255, 0.25);stroke-width:1px;}#mermaid-1787575711443 .cluster text{fill:#F9FFFE;}#mermaid-1787575711443 .cluster span{color:#F9FFFE;}#mermaid-1787575711443 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:"Noto Sans SC","Inter",sans-serif;font-size:12px;background:#161e2e;border:1px solid rgba(255, 255, 255, 0.25);border-radius:2px;pointer-events:none;z-index:100;}#mermaid-1787575711443 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#ccc;}#mermaid-1787575711443 :root{--mermaid-font-family:"trebuchet ms",verdana,arial,sans-serif;}输入模型输出
```

例如：

- 问答助手
- 摘要工具
- 翻译工具
- 结构化信息抽取

它可能很好用，但通常不负责多步执行。

### 2\. Workflow

特点是执行路径主要由开发者预先定义。

```
#mermaid-1787575711471{font-family:"Noto Sans SC","Inter",sans-serif;font-size:14px;fill:#ccc;}#mermaid-1787575711471 .error-icon{fill:#a44141;}#mermaid-1787575711471 .error-text{fill:#ddd;stroke:#ddd;}#mermaid-1787575711471 .edge-thickness-normal{stroke-width:2px;}#mermaid-1787575711471 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-1787575711471 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-1787575711471 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-1787575711471 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-1787575711471 .marker{fill:#10b981;stroke:#10b981;}#mermaid-1787575711471 .marker.cross{stroke:#10b981;}#mermaid-1787575711471 svg{font-family:"Noto Sans SC","Inter",sans-serif;font-size:14px;}#mermaid-1787575711471 .label{font-family:"Noto Sans SC","Inter",sans-serif;color:#ccc;}#mermaid-1787575711471 .cluster-label text{fill:#F9FFFE;}#mermaid-1787575711471 .cluster-label span{color:#F9FFFE;}#mermaid-1787575711471 .label text,#mermaid-1787575711471 span{fill:#ccc;color:#ccc;}#mermaid-1787575711471 .node rect,#mermaid-1787575711471 .node circle,#mermaid-1787575711471 .node ellipse,#mermaid-1787575711471 .node polygon,#mermaid-1787575711471 .node path{fill:#1f2020;stroke:#81B1DB;stroke-width:1px;}#mermaid-1787575711471 .node .label{text-align:center;}#mermaid-1787575711471 .node.clickable{cursor:pointer;}#mermaid-1787575711471 .arrowheadPath{fill:lightgrey;}#mermaid-1787575711471 .edgePath .path{stroke:#10b981;stroke-width:2.0px;}#mermaid-1787575711471 .flowchart-link{stroke:#10b981;fill:none;}#mermaid-1787575711471 .edgeLabel{background-color:#0d0d12;text-align:center;}#mermaid-1787575711471 .edgeLabel rect{opacity:0.5;background-color:#0d0d12;fill:#0d0d12;}#mermaid-1787575711471 .cluster rect{fill:#13131f;stroke:rgba(255, 255, 255, 0.25);stroke-width:1px;}#mermaid-1787575711471 .cluster text{fill:#F9FFFE;}#mermaid-1787575711471 .cluster span{color:#F9FFFE;}#mermaid-1787575711471 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:"Noto Sans SC","Inter",sans-serif;font-size:12px;background:#161e2e;border:1px solid rgba(255, 255, 255, 0.25);border-radius:2px;pointer-events:none;z-index:100;}#mermaid-1787575711471 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#ccc;}#mermaid-1787575711471 :root{--mermaid-font-family:"trebuchet ms",verdana,arial,sans-serif;}分支1分支2输入步骤 A步骤 B条件分支步骤 C步骤 D输出
```

例如：

- 先检索，再总结，再格式化输出
- 收到工单后，分类、路由、生成回复草稿
- 输入简历后，抽取信息、评分、写评价

Workflow 很有价值，而且在很多业务里已经足够了。

### 3\. Agent

特点是系统会根据中间状态自己决定下一步做什么。

```
#mermaid-1787575711486{font-family:"Noto Sans SC","Inter",sans-serif;font-size:14px;fill:#ccc;}#mermaid-1787575711486 .error-icon{fill:#a44141;}#mermaid-1787575711486 .error-text{fill:#ddd;stroke:#ddd;}#mermaid-1787575711486 .edge-thickness-normal{stroke-width:2px;}#mermaid-1787575711486 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-1787575711486 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-1787575711486 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-1787575711486 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-1787575711486 .marker{fill:#10b981;stroke:#10b981;}#mermaid-1787575711486 .marker.cross{stroke:#10b981;}#mermaid-1787575711486 svg{font-family:"Noto Sans SC","Inter",sans-serif;font-size:14px;}#mermaid-1787575711486 .label{font-family:"Noto Sans SC","Inter",sans-serif;color:#ccc;}#mermaid-1787575711486 .cluster-label text{fill:#F9FFFE;}#mermaid-1787575711486 .cluster-label span{color:#F9FFFE;}#mermaid-1787575711486 .label text,#mermaid-1787575711486 span{fill:#ccc;color:#ccc;}#mermaid-1787575711486 .node rect,#mermaid-1787575711486 .node circle,#mermaid-1787575711486 .node ellipse,#mermaid-1787575711486 .node polygon,#mermaid-1787575711486 .node path{fill:#1f2020;stroke:#81B1DB;stroke-width:1px;}#mermaid-1787575711486 .node .label{text-align:center;}#mermaid-1787575711486 .node.clickable{cursor:pointer;}#mermaid-1787575711486 .arrowheadPath{fill:lightgrey;}#mermaid-1787575711486 .edgePath .path{stroke:#10b981;stroke-width:2.0px;}#mermaid-1787575711486 .flowchart-link{stroke:#10b981;fill:none;}#mermaid-1787575711486 .edgeLabel{background-color:#0d0d12;text-align:center;}#mermaid-1787575711486 .edgeLabel rect{opacity:0.5;background-color:#0d0d12;fill:#0d0d12;}#mermaid-1787575711486 .cluster rect{fill:#13131f;stroke:rgba(255, 255, 255, 0.25);stroke-width:1px;}#mermaid-1787575711486 .cluster text{fill:#F9FFFE;}#mermaid-1787575711486 .cluster span{color:#F9FFFE;}#mermaid-1787575711486 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:"Noto Sans SC","Inter",sans-serif;font-size:12px;background:#161e2e;border:1px solid rgba(255, 255, 255, 0.25);border-radius:2px;pointer-events:none;z-index:100;}#mermaid-1787575711486 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#ccc;}#mermaid-1787575711486 :root{--mermaid-font-family:"trebuchet ms",verdana,arial,sans-serif;}是否目标判断当前状态决定动作执行动作更新状态继续?结束
```

也就是说，执行路径不是完全写死的，而是部分由系统在运行中决定。

## 真正的分界线在哪里

分界线不在于：

- 用没用大模型
- 调没调用工具
- 步骤多不多
- UI 看起来高级不高级

真正的分界线在于：

> 下一步动作是由开发者提前写死，还是由系统根据状态动态决定。

如果大部分路径都已经写好，那它更像 Workflow。  
如果系统会在运行中判断“下一步该做什么”，那它才更接近 Agent。

## 一个对比例子

假设任务是：

> 帮我分析今天某个币种是否有异常风险。

### Workflow 版本

开发者可能提前写好：

1. 拉价格数据
2. 拉成交量数据
3. 拉相关新闻
4. 统一交给模型总结
5. 输出风险等级

这个系统有多步，也可能很实用，但它的路径基本固定。

### Agent 版本

系统可能这样运行：

1. 先看价格是否异常
2. 如果价格异常，再决定是否查成交量
3. 如果成交量也异常，再决定是否查新闻
4. 如果新闻不足，再继续查社交媒体或链上数据
5. 信息足够后再输出判断

这里每一步都依赖前一步结果，路径不是完全预先写死。

这就是更典型的 Agent 行为。

## 为什么很多场景其实不需要 Agent

这是一个很重要的现实问题。

很多需求一旦认真拆开，你会发现：

- 输入稳定
- 处理步骤固定
- 分支数量有限
- 结果格式明确

这种场景下，Workflow 往往更便宜、更稳定、更可控。

如果你硬上 Agent，常见结果是：

- 成本更高
- 延迟更长
- 行为更不稳定
- 调试更困难

所以不是“Agent 更高级就一定更好”，而是“这个任务是否真的需要动态决策”。

## 一个实用判断方法

在设计系统前，可以先问自己四个问题：

1. 任务步骤是否基本固定。
2. 执行路径是否大多可预先枚举。
3. 模型是否只负责生成，而不负责决定流程。
4. 我是否更在意稳定性和可控性，而不是灵活性。

如果大多数答案是“是”，你应该优先考虑 Workflow。

再问另外四个问题：

1. 系统是否需要根据中间结果动态选择工具。
2. 是否需要在信息不足时继续探索。
3. 是否需要围绕目标持续推进，而不是一次性回答。
4. 是否存在开放环境和不确定决策。

如果这些答案更多是“是”，那 Agent 才真正有意义。

## 不要把它们对立起来

实际工程里，Workflow 和 Agent 往往是组合关系，不是二选一。

常见的方式是：

- 外层用 Workflow 控制主流程
- 某些节点内部再放 Agent

例如：

- 主流程：接收任务 -> 选择任务类型 -> 调不同处理模块
- 某个处理模块内部：用 Agent 做信息探索和多步分析

这类设计通常比“全站都 Agent 化”更稳。

## 小结

你可以先记住一句更务实的话：

> Workflow 负责确定性流程，Agent 负责不确定环境下的动态推进。

两者没有高低之分，只有适不适合。

如果你一开始就把所有东西都做成 Agent，很容易得到一个“看起来更智能，但实际上更难维护”的系统。

下一篇建议继续看：

- [一个 Agent 系统的核心组成](https://onefly.top/zero2Agent/learn-agent-basic/03-core-components/index.html)