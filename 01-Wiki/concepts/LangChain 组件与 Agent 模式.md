---
type: concept
domain: tech
tags: [langchain, agent]
created: 2026-09-04
updated: 2026-09-04
sources: ["[[01-Wiki/summaries/架构师AI杜 Day38 LangChain框架上]]", "[[01-Wiki/summaries/架构师AI杜 Day39 LangChain框架下]]"]
status: growing
---

# LangChain 组件与 Agent 模式

> LangChain 框架侧的通用编排范式：Chains 三形态、Memory 五策略、Callback 可观测性、四种 Agent 模式与性能四招。**框架本身的事实（生态、定位、RAG 组件）在 [[01-Wiki/entities/LangChain]]，可迁移的编排模式在本页。**

## 定义

一套把 LLM 应用拆成可组合单元的编排模式集合。核心价值是**将提示词、模型、解析器、工具、记忆抽象为统一接口**，让开发者像拼流水线一样组装，而不必每次从零写胶水代码。

## 机制/原理

### 1. 三基础组件

| 组件 | 作用 | 关键类 |
|------|------|--------|
| Models | 封装模型调用 | `ChatOpenAI`（消息进消息出，主流）、`OpenAI`（文本进文本出，旧式） |
| Prompts | 模板化提示词，分离变量与固定文本 | `PromptTemplate`、`ChatPromptTemplate.from_messages` |
| Output Parsers | 把模型文本解析为结构化对象 | `CommaSeparatedListOutputParser`、`get_format_instructions()` |

Output Parser 的工作方式值得一提：先 `get_format_instructions()` 把格式要求注入 prompt，再 `parse()` 回结构化对象——这是 Structured Output 的早期形态（→ [[01-Wiki/concepts/Tool Calling]]）。

### 2. Chains 三形态（复杂度递进）

| 链类型 | 作用 | 关键参数 |
|--------|------|----------|
| Simple（`LLMChain`） | 单步：prompt + llm | `llm`、`prompt` |
| Sequential（`SequentialChain`） | 串联：上一步输出作下一步输入 | `chains`、`input_variables`、`output_variables` |
| Router（`MultiPromptChain`） | 路由：按输入选择目标链 | `router_chain`、`destination_chains`、`default_chain` |

**Router Chain 的本质是"让 LLM 当分类器"**：把候选目标的 name + description 拼进 prompt，模型输出 `{"destination": ..., "next_inputs": ...}` 再解析。

> ⚠️ **destination 的 description 质量直接决定路由准确率**——与工具描述决定工具选择准确率是同一个道理（→ [[01-Wiki/summaries/JavaGuide MCP]]）。

### 3. Memory 五策略：保真度 vs 成本的取舍曲线

| 类型 | 策略 | 适用 |
|------|------|------|
| `ConversationBufferMemory` | 全量保存 | 短对话 |
| `ConversationBufferWindowMemory(k=N)` | 只留最近 N 轮 | 长对话、成本敏感 |
| `ConversationSummaryMemory` | LLM 压缩历史为摘要 | 超长对话，需保留主旨 |
| `ConversationKGMemory` | 抽取实体关系成知识图谱 | 需结构化事实检索 |
| `VectorStoreRetrieverMemory` | 向量库语义召回 | 海量历史、按相关性取用 |

**选型判据不是"对话有多长"，而是"历史信息的重要密度"**——密集则保真（Buffer），稀疏则压缩（Summary）或检索（VectorStore）。

这与 [[01-Wiki/summaries/Context、State 与 Memory]] 的记忆分类可以直接映射：Buffer ≈ 全量上下文，Window ≈ 滑动窗口，Summary ≈ 压缩，VectorStore ≈ 检索式记忆。

### 4. Callback：可观测性的骨架

`BaseCallbackHandler` 提供九类钩子：

- `on_llm_start` / `on_llm_end` / `on_llm_error`
- `on_chain_start` / `on_chain_end` / `on_chain_error`
- `on_tool_start` / `on_tool_end` / `on_tool_error`
- 流式场景另有 `on_llm_new_token`

实用 Handler：`StreamingStdOutCallbackHandler`（打字机输出）、`get_openai_callback()`（token 与费用统计）、自定义 Handler（耗时埋点、链路追踪）。

> **对 Agent 而言，`on_tool_*` 三个钩子是定位"卡在哪一步"的关键**（→ [[01-Wiki/concepts/Loop Engineering]] 的可观测性要求）。Loop Guard 所需的步数、耗时、失败率统计都从这里取数。

### 5. 四种 Agent 模式

| 模式 | 适用场景 | 关键构造 |
|------|---------|---------|
| Conversational | 多轮对话，需上下文 | `CONVERSATIONAL_REACT_DESCRIPTION` + BufferMemory |
| Structured Chat | 工具需多参数结构化输入 | `STRUCTURED_CHAT_ZERO_SHOT_REACT_DESCRIPTION` + `StructuredTool(args_schema=...)` |
| Self-Ask with Search | 拆成中间子问题逐步检索 | `SELF_ASK_WITH_SEARCH` + 搜索工具 |
| Plan-and-Execute | 长任务：先整体规划再分步执行 | `PlanAndExecute(planner=..., executor=...)` |

- **Structured Chat 是 ReAct 的能力升级**：普通 ReAct 的工具输入是单个字符串，多参数只能靠模型自己拼 JSON（易错）；Structured Chat 用 schema 声明结构，模型按字段填，可靠性显著提升——**与 MCP 工具必须有 JSON Schema 是同一个道理**。
- **Plan-and-Execute 的权衡**：规划与执行解耦，长任务不失控；代价是**计划僵化、无法根据中间结果调整**。落地难点在于失败后的重规划（replanning）。

### 6. 自定义 Agent 揭示了框架的内部机理

手写 ReAct 模板（Thought / Action / Action Input / Observation / Final Answer）+ 自定义 `AgentOutputParser`（正则抽取 Action）+ `LLMSingleActionAgent` + `AgentExecutor`，可以让整个循环完全可控。

但这也暴露了一个事实：**早期 Agent 的"智能"建立在一个脆弱的文本协议上**——解析器与提示词模板必须严格对齐，输出格式一改就全崩。这正是后来 Structured Output 与 Tool Calling 兴起的直接原因。

自定义 prompt 必须保留四个占位符：`{tools}`、`{tool_names}`、`{input}`、`{agent_scratchpad}`。

### 7. 性能四招

1. **缓存**：`set_llm_cache(...)`，重复提问直接命中（生产应换 Redis 等持久缓存；注意 temperature>0 时缓存会固化随机性）
2. **异步**：`llm.ainvoke` + `asyncio.gather` 并发
3. **批量**：`llm.generate(prompts)` 一次提交多条
4. **流式**：`llm.stream()` 逐 chunk 返回，降低首字延迟

## 边界与常见误区

- ⚠️ **API 版本陷阱**：`LLMChain`、`initialize_agent`、`load_tools`、`LLMSingleActionAgent` 均属 LangChain **0.1.x 旧版 API**。当前官方主推 LCEL（`prompt | llm | parser` 管道式）与 LangGraph 做 Agent 编排。新项目照旧版写法会在升级后失效。
- ⚠️ **`eval` 与 `python-repl` 是安全反例**：教程示例中 `CalculatorTool._run` 直接 `eval(expression)`，`create_python_agent` 直接执行任意代码。**`eval` 执行模型生成的字符串 = 完整命令注入链路**，与 [[01-Wiki/summaries/架构师AI杜 Day21 MCP工具开发]] 主张的输入验证完全冲突。生产必须替换为 AST 白名单解析或容器沙箱。
- **Router 失败代价高**：选错分支 = 整条链白跑，且路由本身消耗 token。需要"路由置信度 + 回退重试"。
- **正则解析器必须配容错**：解析失败是生产中最常见的崩溃点，必须有重试与降级策略。
- **Chain 不等于 Agent**：Chain 的路径是开发者写死的，Agent 的路径由运行时决定（→ [[01-Wiki/summaries/Workflow 和 Agent 的区别]]）。

## 相关概念

- [[01-Wiki/concepts/ReAct]]（本文四种模式的底层范式）
- [[01-Wiki/concepts/Tool Calling]]（结构化工具调用，取代文本协议解析）
- [[01-Wiki/concepts/Loop Engineering]]（可观测性与退出条件设计）
- [[01-Wiki/concepts/上下文工程]]（Memory 五策略的本质是上下文组织）
- [[01-Wiki/concepts/Agent 评估]]（token 与耗时统计是成本效率评估基础）
- 相关实体：[[01-Wiki/entities/LangChain]]、[[01-Wiki/entities/LangGraph]]（图基编排，当前推荐路径）、[[01-Wiki/entities/架构师AI杜]]（本页主要来源系列）
