---
type: summary
domain: tech
tags: [langchain, agent]
created: 2026-09-04
updated: 2026-09-04
sources: ["[[00-Raw/agent-frameworks/架构师AI杜 Day39 LangChain框架下]]"]
status: growing
---

# 架构师AI杜 Day39 LangChain框架（下）

> LangChain 进阶：四种高级 Agent 模式、五种 Memory 组件、Callback 可观测性体系、自定义 Agent 解析器，以及缓存/异步/批量/流式四招性能优化。

来源：[[01-Wiki/entities/架构师AI杜]] 系列教程 Day39（weekr.net/ai/day-39）

## 核心观点

### 四种高级 Agent 模式

| 模式 | 适用场景 | 关键构造 |
|------|---------|---------|
| Conversational | 多轮对话，需上下文 | `CONVERSATIONAL_REACT_DESCRIPTION` + `ConversationBufferMemory` |
| Structured Chat | 工具需要**多参数**结构化输入 | `STRUCTURED_CHAT_ZERO_SHOT_REACT_DESCRIPTION` + `StructuredTool.from_function(args_schema=...)` |
| Self-Ask with Search | 需拆成中间子问题逐步检索 | `SELF_ASK_WITH_SEARCH` + 搜索工具 |
| Plan-and-Execute | 长任务：先整体规划再分步执行 | `PlanAndExecute(planner=load_chat_planner(llm), executor=...)` |

- **Structured Chat 是 ReAct 的能力升级**：普通 ReAct 的工具输入是单个字符串，多参数只能靠模型自己拼 JSON（易错）；Structured Chat 用 `args_schema` 声明结构，模型按字段填，可靠性显著提升。这与 MCP 工具必须有 JSON Schema 是同一个道理。
- **Plan-and-Execute 把"规划"与"执行"解耦**：planner 一次性产出步骤，executor 逐步执行。好处是长任务不失控，代价是**计划僵化、无法根据中间结果调整**——这是它与纯 ReAct 的核心权衡（→ [[01-Wiki/concepts/ReAct]]）。

### 五种 Memory 组件

| 类型 | 策略 | 适用 |
|------|------|------|
| `ConversationBufferMemory` | 全量保存 | 短对话 |
| `ConversationBufferWindowMemory(k=2)` | 只留最近 k 轮 | 长对话、成本敏感 |
| `ConversationSummaryMemory` | LLM 压缩历史为摘要 | 超长对话，需保留主旨 |
| `ConversationKGMemory` | 抽取实体关系成知识图谱 | 需结构化事实检索 |
| `VectorStoreRetrieverMemory` | 向量库语义召回 | 海量历史、按相关性取用 |

- **五种策略本质是"保真度 vs 成本"的取舍曲线**：Buffer 最真最贵，VectorStore 最省但可能漏。选择依据是**历史信息的重要密度**，而非对话长度（→ [[01-Wiki/concepts/上下文工程]]）。

### Callback 是可观测性的骨架

- `BaseCallbackHandler` 提供九类钩子：`on_llm_start/end/error`、`on_chain_start/end/error`、`on_tool_start/end/error`；流式场景另有 `on_llm_new_token`。
- `StreamingStdOutCallbackHandler` 实现打字机输出；`get_openai_callback()` 上下文管理器统计 token 与费用；自定义 Handler 可做耗时埋点与链路追踪。**对 Agent 而言，on_tool_* 三个钩子是定位"卡在哪一步"的关键**（→ [[01-Wiki/concepts/Loop Engineering]] 的可观测性要求）。

### 自定义 Agent

- 自定义 Prompt：手写 ReAct 格式模板（Thought / Action / Action Input / Observation / Final Answer），必须保留 `{tools}`、`{tool_names}`、`{input}`、`{agent_scratchpad}` 四个占位符。
- 自定义 Parser：继承 `AgentOutputParser`，用正则从模型输出中抽取 `Action:` 与 `Action Input:`，命中 `Final Answer:` 则返回 `AgentFinish`，否则返回 `AgentAction`；配 `LLMSingleActionAgent` + `stop=["\nObservation:"]` + `AgentExecutor`。
- **这说明 Agent 框架的"智能"其实建立在一个脆弱的文本协议上**——解析器与提示词模板必须严格对齐，格式一改就全崩。这也是后来 Structured Output / Tool Calling 兴起的直接原因（→ [[01-Wiki/concepts/Tool Calling]]）。

### 性能四招

1. **缓存**：`set_llm_cache(InMemoryCache())`，重复提问直接命中（生产应换 Redis 等持久缓存）
2. **异步**：`llm.ainvoke` + `asyncio.gather` 并发处理多请求
3. **批量**：`llm.generate(prompts)` 一次提交多条
4. **流式**：`llm.stream()` 逐 chunk 返回，降低首字延迟

## 关键数据

| 指标 | 数值 | 出处 |
|------|------|------|
| 高级 Agent 模式 | 4 种（Conversational / Structured Chat / Self-Ask / Plan-and-Execute） | §高级Agent模式 |
| Memory 组件 | 5 种（Buffer / Window / Summary / KG / VectorStore） | §Memory组件 |
| Callback 基础钩子 | 9 个（llm×3、chain×3、tool×3） | §基础Callback Handler |
| 自定义 Agent 组成 | 3 件套（Prompt + OutputParser + AgentExecutor） | §自定义Agent |
| 性能优化手段 | 4 招（缓存/异步/批量/流式） | §性能优化 |

## 亮点与不足

**亮点**
- **Memory 五件套的对比是全文最有价值的部分**：一张表讲清五种策略的取舍，配可运行代码，可直接作为选型依据。
- Callback 章节给出了完整钩子清单与三类实用 Handler（流式、计费、计数），是 LangChain 可观测性的实用入口。
- 自定义 OutputParser 的示例揭示了 Agent 框架的内部机理——**ReAct 的"思考"本质是正则可解析的文本协议**，这个认知对调试 Agent 极有帮助。
- 性能四招覆盖了延迟与成本两个维度，且点出生产应替换 `InMemoryCache`。

**不足**
- ⚠️ **安全反例反复出现且无警示**：`CalculatorTool._run` 用 `eval(expression)`，`send_email` 工具用 `lambda x: send_email(**eval(x))`，`python-repl` 直接执行代码。**`eval` 执行模型生成或用户提供的字符串 = 命令注入**，与 [[01-Wiki/summaries/架构师AI杜 Day21 MCP工具开发]] 自己主张的输入验证完全冲突。
- ⚠️ 同 Day38，**全部为 LangChain 0.1.x 旧版 API**，`initialize_agent`、`LLMSingleActionAgent`、`langchain.experimental` 均非当前推荐路径。
- Plan-and-Execute 未讨论计划失败后的重规划机制（replanning），这是该模式落地的主要难点。
- 自定义 Parser 用正则解析，未给出解析失败的重试与容错策略——而这恰恰是生产中最常见的崩溃点。
- 缓存只演示了 `InMemoryCache`，未提缓存键设计（temperature>0 时缓存会固化随机性）与失效策略。

## 与既有知识的联系

- **扩展** [[01-Wiki/entities/LangChain]]：补上 Memory 体系与 Callback 机制，使该实体页从"RAG 组件清单"扩展为"框架能力全景"。
- **深化** [[01-Wiki/summaries/Context、State 与 Memory]]：本文五种 Memory 是该摘要页"Memory 设计"的 LangChain 具体实现——Buffer≈全量上下文，Window≈滑动窗口，Summary≈压缩，VectorStore≈检索式记忆。
- **呼应** [[01-Wiki/concepts/Loop Engineering]]：Callback 的 `on_tool_*` 钩子正是"Agent 循环可观测性"的落地手段；Loop Guard 所需的步数、耗时、失败率统计都从这里取数。
- **对照** [[01-Wiki/concepts/ReAct]]：本文揭示了 ReAct 在 LangChain 中的**文本协议本质**（正则解析 Action），而 [[01-Wiki/concepts/Tool Calling]] 记录的是其向结构化协议演进的方向。
- **关联** [[01-Wiki/concepts/Agent 评估]]：token 与耗时统计是评估 Agent 成本效率的基础数据。

## 延伸问题

- Plan-and-Execute 如何在执行中途根据观察结果重规划？LangGraph 的条件边是否比 `langchain.experimental` 更适合？
- 五种 Memory 能否组合（如"窗口 + 摘要"混合）？混合策略的收益在多少轮对话后显现？
- 正则解析器的脆弱性如何通过 Structured Output / Tool Calling 彻底解决？迁移代价是什么？
- `eval` 类工具的安全替代方案：AST 白名单解析、容器沙箱、还是受限 DSL？（→ [[01-Wiki/concepts/Agent 训练环境]] 沙箱四硬规则）

## 速查：Memory 选型决策

```
对话轮次少、要求零信息丢失      → ConversationBufferMemory
长对话、只需近期上下文           → ConversationBufferWindowMemory(k=N)
超长对话、需保留主旨大意         → ConversationSummaryMemory
需要检索具体事实/实体关系        → ConversationKGMemory
历史海量、按语义相关性取用        → VectorStoreRetrieverMemory
```

> 判据不是"对话有多长"，而是"历史信息的重要密度"——密集则保真，稀疏则压缩或检索。
