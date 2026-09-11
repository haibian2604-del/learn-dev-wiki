---
type: entity
domain: tech
tags: [langchain, rag, llm, agent]
created: 2026-07-31
updated: 2026-09-04
sources: ["[[01-Wiki/summaries/第 19 章 RAG 检索增强生成]]", "[[01-Wiki/summaries/2026 年 AI Agent 技术全景]]", "[[01-Wiki/summaries/架构师AI杜 Day38 LangChain框架上]]", "[[01-Wiki/summaries/架构师AI杜 Day39 LangChain框架下]]"]
status: mature
---

# LangChain

> 构建 LLM 应用的开发框架，将 RAG 所需的组件统一为一致接口，便于按步骤搭建流水线。

## 是什么

LangChain 的价值在于把 RAG 流水线的各环节抽象成统一接口，开发者无需关心数据源差异。RAG 不是某一个类能完成的功能，而是一条由多个组件拼起来的流水线。

## 关键事实

RAG 组件分工（→ 来源 [[01-Wiki/summaries/第 19 章 RAG 检索增强生成]]）：

| 组件 | 作用 | 常见类 |
|------|------|--------|
| Document | 统一文档对象 | `page_content` + `metadata` |
| 文档加载器 | 读入各类文件 | `TextLoader`、`PyPDFLoader`、`Docx2txtLoader` 等 |
| 文本分割器 | 长文档切片段 | `RecursiveCharacterTextSplitter`（通用首选） |
| 嵌入模型 | 文本转向量 | `DashScopeEmbeddings`（text-embedding-v3） |
| 向量数据库 | 存向量+相似检索 | Redis / RedisStack、Chroma、FAISS |
| 检索器 | 提问时召回片段 | `vector_store.as_retriever()` |
| 提示词模板 | 组装 context+question | `PromptTemplate`、`ChatPromptTemplate` |
| 聊天模型 | 生成最终答案 | `ChatOpenAI`、`init_chat_model()` |

关键工程写法：

- **两种入库方式**：`from_documents(docs)`（文档流：Loader→Splitter→批量建库）；`add_texts(texts, metadata)`（纯文本流：向量库实例追加内容）
- **LCEL 管道式 RAG**：`{"context": retriever, "question": RunnablePassthrough()} | prompt | llm`
- 分割入口三选一：`split_text` / `create_documents` / `split_documents`（真实项目最常用后者）

## Agent 框架定位（→ [[01-Wiki/summaries/2026 年 AI Agent 技术全景]]）

- GitHub 106k+ Stars，12 框架横评中**生态最丰富、通用首选**；模块化可定制；含 LangGraph 状态化编排
- 上手难度 ⭐⭐⭐ / 生产就绪 ⭐⭐⭐⭐ / 生态 ⭐⭐⭐⭐⭐
- 新手路径：Langflow（可视化）→ LangChain（系统学习）；生产组合：LangChain + LlamaIndex + PydanticAI

## Chains / Memory / Callback（→ [[01-Wiki/concepts/LangChain 组件与 Agent 模式]]）

除 RAG 组件外，框架的编排侧能力集中在三块：

| 能力 | 形态 | 要点 |
|------|------|------|
| Chains | Simple / Sequential / Router | Router 本质是"LLM 当分类器"，destination 描述质量决定路由准确率 |
| Memory | Buffer / Window / Summary / KG / VectorStore | 五种策略是"保真度 vs 成本"的取舍曲线，选型看历史信息的**重要密度**而非对话长度 |
| Callback | 九类钩子（llm×3、chain×3、tool×3） | `on_tool_*` 是定位 Agent 卡在哪一步的关键；`get_openai_callback()` 统计 token 与费用 |

Agent 侧提供四种模式：Conversational、Structured Chat（多参数工具）、Self-Ask with Search、Plan-and-Execute（规划与执行解耦，代价是计划僵化）。

### ⚠️ 版本演进提示

`LLMChain`、`initialize_agent`、`load_tools` 均属 **0.1.x 旧版 API**，官方当前主推 **LCEL**（`prompt | llm | parser` 管道式）与 **LangGraph**（图基 Agent 编排，→ [[01-Wiki/entities/LangGraph]]）。新项目不应再沿用旧写法。

另需注意：教程中常见的 `eval(expression)` 计算器工具与 `python-repl` 工具会执行模型生成的字符串，**存在命令注入风险**，生产须替换为 AST 白名单解析或容器沙箱。

## 相关

- 相关概念：[[01-Wiki/concepts/RAG]]、[[01-Wiki/concepts/文本分块]]、[[01-Wiki/concepts/Document]]、[[01-Wiki/concepts/AI Agent]]、[[01-Wiki/concepts/LangChain 组件与 Agent 模式]]（Chains/Memory/Callback/Agent 模式详解）、[[01-Wiki/concepts/ReAct]]
- 相关实体：[[01-Wiki/entities/Redis向量库]]、[[01-Wiki/entities/LangGraph]]（同生态图基编排）、[[01-Wiki/entities/LlamaIndex]]（RAG 检索搭档）
- 相关来源：[[01-Wiki/summaries/第 19 章 RAG 检索增强生成]]、[[01-Wiki/summaries/2026 年 AI Agent 技术全景]]
