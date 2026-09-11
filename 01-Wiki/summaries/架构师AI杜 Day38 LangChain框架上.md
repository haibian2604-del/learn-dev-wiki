---
type: summary
domain: tech
tags: [langchain, agent]
created: 2026-09-04
updated: 2026-09-04
sources: ["[[00-Raw/agent-frameworks/架构师AI杜 Day38 LangChain框架上]]"]
status: growing
---

# 架构师AI杜 Day38 LangChain框架（上）

> LangChain 入门全景：Models / Prompts / Output Parsers 三组件，Simple-Sequential-Router 三级链，ReAct Agent 与自定义工具的两种写法，Toolkits 与记忆接入。

来源：[[01-Wiki/entities/架构师AI杜]] 系列教程 Day38（weekr.net/ai/day-38）

## 核心观点

- **LangChain 提供五类能力**：模块化组件、链式调用（Chains）、Agent 支持、记忆管理、工具集成。它的核心价值是**把 LLM 应用的公共环节抽象成统一接口**，让开发者像拼流水线一样组合（→ [[01-Wiki/entities/LangChain]]）。
- **模型分两层**：`LLM`（文本进文本出，如 `OpenAI(model="gpt-3.5-turbo-instruct")`）与 `Chat Models`（消息列表进消息出，如 `ChatOpenAI` + `SystemMessage`/`HumanMessage`）。**新项目几乎只用 Chat Models**。
- **Prompt 模板化是复用前提**：`PromptTemplate`（`template` + `input_variables`）与 `ChatPromptTemplate.from_messages([("system", ...), ("user", ...)])`——把变量与固定文本分离，才能做版本管理与测试。
- **Output Parser 把"让模型按格式输出"变成工程约定**：`CommaSeparatedListOutputParser` 通过 `get_format_instructions()` 把格式要求注入 prompt，再 `parse()` 回结构化对象。这是 Structured Output 的早期形态（→ [[01-Wiki/concepts/Tool Calling]]）。
- **链的三种形态，复杂度递进**：
    | 链类型 | 作用 | 关键参数 |
    |--------|------|----------|
    | `LLMChain` | 单步：prompt + llm | `llm`、`prompt` |
    | `SequentialChain` | 串联：上一步输出作下一步输入 | `chains`、`input_variables`、`output_variables` |
    | `MultiPromptChain` | 路由：按输入选择目标链 | `router_chain`、`destination_chains`、`default_chain` |
- **Router Chain 的本质是"LLM 做分类器"**：把候选目标的 name + description 拼进 prompt，让模型输出 `{"destination": ..., "next_inputs": ...}`，再交给 `RouterOutputParser` 解析。**这里 destination 的描述质量直接决定路由准确率**——与工具 description 同理。
- **Agent 四要素**：LLM（推理决策）+ Tools（可用工具）+ Prompt（思考方式）+ Memory（历史经验）。这与本文 Day35 的 `<Perception, Reasoning, Action, Learning>` 四元组高度对应。
- **ReAct Agent 是默认起手式**：`AgentType.ZERO_SHOT_REACT_DESCRIPTION` + `initialize_agent(tools, llm, verbose=True)`。
- **自定义工具有两种写法**：继承 `BaseTool`（`name` / `description` / `args_schema` / `_run` / `_arun`，适合复杂逻辑）与 `Tool(name=, func=, description=)` 函数式（适合快速包装）。**`description` 决定模型会不会用、什么时候用**。`args_schema` 用 Pydantic 模型声明入参，与 MCP 工具的 schema 思路一致。
- **Toolkits 是场景化工具包**：`create_python_agent`（Python REPL）、`create_pandas_dataframe_agent`（数据分析），把一组工具 + 配套 prompt 打包。
- **记忆用 `ConversationBufferMemory` 接入**：`memory_key="chat_history"` + `return_messages=True`，配合 `AgentType.CONVERSATIONAL_REACT_DESCRIPTION` 实现多轮。

## 关键数据

| 指标 | 数值 | 出处 |
|------|------|------|
| 核心组件 | 3 类（Models / Prompts / Output Parsers） | §核心组件 |
| 链类型 | 3 种（Simple / Sequential / Router） | §Chains |
| Agent 四要素 | LLM / Tools / Prompt / Memory | §Agents 基础概念 |
| 自定义工具写法 | 2 种（BaseTool 子类 / Tool 函数式） | §Custom Tool |
| 路由示例目标数 | 3 个（physics / math / biology） | §Router Chain |
| 安装 | `langchain`、`langchain-openai`、`langchain-community` | §安装 |

## 亮点与不足

**亮点**
- 覆盖面完整，一篇讲清从"调一次模型"到"能路由、能用工具、能记上下文"的完整路径。
- Router Chain 的示例非常具体（三个专家 prompt + 路由模板 + `MultiPromptChain` 组装），可直接改造复用。
- 自定义工具的两种写法对比清晰，并示范了 `args_schema` 用 Pydantic 声明结构化入参。
- `load_tools(["serpapi", "llm-math", "python-repl"])` 一行加载多个内置工具，展示了生态优势。

**不足**
- ⚠️ **API 已过时**：`LLMChain`、`initialize_agent`、`load_tools` 均属 LangChain **0.1.x 旧版 API**。官方当前主推 LCEL（`prompt | llm | parser` 管道式）与 LangGraph 做 Agent 编排。新项目照本文写法会在版本升级后失效。
- ⚠️ **安全反例未加警示**：`CalculatorTool._run` 直接 `eval(expression)`，`python-repl` 工具更是直接执行任意代码——两者都无任何沙箱说明。模型输出或用户输入一旦被拼接，就是完整的 RCE 链路。
- Router Chain 未讨论路由失败的兜底成本（选错分支 = 整条链白跑）与路由本身的 token 开销。
- 没有讲 Chain 的可观测性（如何看到中间步骤），只提了 `verbose=True`。
- 记忆部分只用了 Buffer 一种，未涉及长对话的窗口与摘要策略（下篇才展开）。

## 与既有知识的联系

- **扩展** [[01-Wiki/entities/LangChain]]：该实体页现有内容集中在 RAG 组件（Loader/Splitter/Embedding/VectorStore/Retriever）与 LCEL 管道，本文补齐了 **Chains 与 Agents 侧**的组件地图。
- **实践** [[01-Wiki/concepts/ReAct]]：本文的 `ZERO_SHOT_REACT_DESCRIPTION` 是该概念页的 LangChain 落地写法。
- **呼应** [[01-Wiki/summaries/架构师AI杜 Day21 MCP工具开发]]：两者对工具 `description` 与参数 schema 的要求完全一致——**工具描述质量决定模型选择准确度**，只是 LangChain 用 `args_schema`，MCP 用 JSON Schema。
- **对照** [[01-Wiki/concepts/Workflow Graph]]：Router Chain 实际上是一个"LLM 驱动的动态分支"，与静态工作流图的条件边是同一问题的两种解法——前者灵活但不确定，后者确定但不灵活。
- **衔接** [[01-Wiki/summaries/架构师AI杜 Day39 LangChain框架下]]：下篇展开高级 Agent 模式、五种 Memory 与 Callback。

## 延伸问题

- LCEL（`|` 管道）相比 `LLMChain` 除了写法简洁，在流式、异步、并行、追踪上具体强在哪？迁移成本多大？
- Router Chain 选错分支如何检测与纠正？是否需要"路由置信度 + 回退重试"？
- `eval` 与 `python-repl` 工具如何安全地暴露给 Agent？容器沙箱与 AST 白名单哪种更适合？（→ [[01-Wiki/concepts/Agent 训练环境]]）
- 当工具数量超过模型能有效选择的规模时，LangChain 侧有什么按需加载机制？

## 速查：旧版 → 新版对照

| 场景 | 本文（0.1.x 旧版） | 当前推荐 |
|------|-------------------|----------|
| 简单链 | `LLMChain(llm=, prompt=)` | `prompt \| llm \| parser`（LCEL） |
| 建 Agent | `initialize_agent(tools, llm, agent=...)` | LangGraph `create_react_agent` |
| 加载工具 | `load_tools([...])` | 显式构造工具对象 / MCP adapter |
| 自定义工具 | `BaseTool` 子类 | `@tool` 装饰器 + Pydantic schema |

> 读本文掌握概念，写新项目请查当前版本官方文档。
