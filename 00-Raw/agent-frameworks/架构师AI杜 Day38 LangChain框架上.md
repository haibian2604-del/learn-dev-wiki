---
title: "架构师AI杜技术文档"
source: "https://www.weekr.net/ai/day-38.html"
author:
  - "[[架构师AI杜]]"
published: 2026-03-09
created: 2026-09-04
description: "第38天：LangChain框架（上） - 架构师AI杜技术文档"
tags:
  - "clippings"
---
## 第38天：LangChain框架（上）

## 学习目标

- 理解LangChain框架的核心概念
- 掌握LangChain的核心组件
- 学习Chains的概念和使用
- 了解Agents基础
- 掌握Tools与Toolkits的使用

## LangChain简介

### 什么是LangChain

LangChain是一个用于构建由语言模型驱动的应用程序的框架。它提供了：

- **模块化组件** ：可组合的组件用于构建复杂应用
- **链式调用** ：将多个组件串联起来形成工作流
- **Agent支持** ：构建自主决策的Agent
- **记忆管理** ：管理对话和应用状态
- **工具集成** ：连接外部工具和API

### 安装LangChain

```bash
pip install langchain
pip install langchain-openai
pip install langchain-community
```

### 基础设置

```python
import os
from langchain_openai import ChatOpenAI

os.environ["OPENAI_API_KEY"] = "your-api-key"

llm = ChatOpenAI(
    model="gpt-4",
    temperature=0
)
```

## LangChain核心组件

### 1\. Models（模型）

#### LLM（大语言模型）

```python
from langchain_openai import OpenAI

llm = OpenAI(
    model="gpt-3.5-turbo-instruct",
    temperature=0.7,
    max_tokens=1000
)

response = llm.invoke("What is AI?")
print(response)
```

#### Chat Models（聊天模型）

```python
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, SystemMessage

chat = ChatOpenAI(
    model="gpt-4",
    temperature=0
)

messages = [
    SystemMessage(content="You are a helpful assistant."),
    HumanMessage(content="What is LangChain?")
]

response = chat.invoke(messages)
print(response.content)
```

### 2\. Prompts（提示词）

#### Prompt Templates

```python
from langchain.prompts import PromptTemplate

template = """
Answer the following question: {question}

Context: {context}
"""

prompt = PromptTemplate(
    template=template,
    input_variables=["question", "context"]
)

formatted_prompt = prompt.format(
    question="What is Python?",
    context="Python is a programming language."
)

print(formatted_prompt)
```

#### Chat Prompt Templates

```python
from langchain.prompts import ChatPromptTemplate

template = ChatPromptTemplate.from_messages([
    ("system", "You are a {role}."),
    ("user", "{input}")
])

prompt = template.format_messages(
    role="helpful assistant",
    input="What is AI?"
)
```

### 3\. Output Parsers（输出解析器）

```python
from langchain.output_parsers import CommaSeparatedListOutputParser

parser = CommaSeparatedListOutputParser()

format_instructions = parser.get_format_instructions()

prompt = PromptTemplate(
    template="List five {subject}.\n{format_instructions}",
    input_variables=["subject"],
    partial_variables={"format_instructions": format_instructions}
)

input_prompt = prompt.format(subject="programming languages")
output = llm.invoke(input_prompt)

result = parser.parse(output)
print(result)
```

## Chains（链）

### Simple Chain（简单链）

```python
from langchain.chains import LLMChain

chain = LLMChain(
    llm=llm,
    prompt=prompt
)

result = chain.run(
    question="What is Python?",
    context="Python is a programming language."
)

print(result)
```

### Sequential Chain（顺序链）

```python
from langchain.chains import SequentialChain

# 第一个链：生成问题
question_prompt = PromptTemplate(
    input_variables=["topic"],
    template="Generate a question about {topic}."
)

question_chain = LLMChain(
    llm=llm,
    prompt=question_prompt,
    output_key="question"
)

# 第二个链：回答问题
answer_prompt = PromptTemplate(
    input_variables=["question"],
    template="Answer this question: {question}"
)

answer_chain = LLMChain(
    llm=llm,
    prompt=answer_prompt,
    output_key="answer"
)

# 组合链
overall_chain = SequentialChain(
    chains=[question_chain, answer_chain],
    input_variables=["topic"],
    output_variables=["question", "answer"]
)

result = overall_chain("AI")
print(result)
```

### Router Chain（路由链）

```python
from langchain.chains import RouterChain
from langchain.chains.router import MultiPromptChain
from langchain.chains.router.llm_router import LLMRouterChain, RouterOutputParser

# 定义多个提示模板
physics_template = """You are a physics expert. 
Answer the following question: {input}"""

math_template = """You are a math expert. 
Answer the following question: {input}"""

biology_template = """You are a biology expert. 
Answer the following question: {input}"""

# 创建提示信息
prompt_infos = [
    {
        "name": "physics",
        "description": "Good for answering physics questions",
        "prompt_template": physics_template
    },
    {
        "name": "math",
        "description": "Good for answering math questions",
        "prompt_template": math_template
    },
    {
        "name": "biology",
        "description": "Good for answering biology questions",
        "prompt_template": biology_template
    }
]

# 创建路由链
llm = ChatOpenAI(temperature=0)
destination_chains = {}

for p_info in prompt_infos:
    name = p_info["name"]
    prompt_template = p_info["prompt_template"]
    prompt = PromptTemplate(
        template=prompt_template,
        input_variables=["input"]
    )
    chain = LLMChain(llm=llm, prompt=prompt)
    destination_chains[name] = chain

default_chain = LLMChain(
    llm=llm,
    prompt=PromptTemplate.from_template("{input}")
)

router_template = """Given a raw text input to a language model, 
select the best prompt to use. You will be given the names of the 
available prompts and a description of what the prompt is best suited for.

<< FORMATTING >>
Return a JSON object formatted as follows:
{{"destination": string (name of the prompt to use), "next_inputs": string (the raw input text)}}

<< CANDIDATE PROMPTS >>
{destinations}

<< INPUT >>
{{input}}

<< OUTPUT (must include the JSON object)>>"""

router_prompt = PromptTemplate(
    template=router_template,
    input_variables=["input", "destinations"],
)

destinations_str = "\n".join([
    f'{p["name"]}: {p["description"]}' for p in prompt_infos
])

router_chain = LLMRouterChain.from_llm(
    llm,
    router_prompt
)

chain = MultiPromptChain(
    router_chain=router_chain,
    destination_chains=destination_chains,
    default_chain=default_chain
)

result = chain.run("What is Newton's second law?")
print(result)
```

## Agents（智能体）

### Agent基础概念

Agent是使用LLM来决定采取什么行动的系统。它包括：

- **LLM** ：用于推理和决策
- **Tools** ：Agent可以使用的工具
- **Prompt** ：指导Agent如何思考和行动
- **Memory** ：存储Agent的经验

### ReAct Agent

```python
from langchain.agents import AgentType, initialize_agent, load_tools
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(temperature=0)

tools = load_tools(["serpapi", "llm-math"], llm=llm)

agent = initialize_agent(
    tools,
    llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

result = agent.run("What is the current weather in Beijing?")
print(result)
```

### Custom Tool（自定义工具）

```python
from langchain.tools import BaseTool
from typing import Optional
from pydantic import BaseModel, Field

class CalculatorInput(BaseModel):
    expression: str = Field(description="Mathematical expression to evaluate")

class CalculatorTool(BaseTool):
    name = "calculator"
    description = "Useful for mathematical calculations"
    args_schema: Optional[type[BaseModel]] = CalculatorInput
    
    def _run(self, expression: str) -> str:
        try:
            result = eval(expression)
            return str(result)
        except Exception as e:
            return f"Error: {str(e)}"
    
    async def _arun(self, expression: str) -> str:
        return self._run(expression)

calculator = CalculatorTool()

tools = [calculator]

agent = initialize_agent(
    tools,
    llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

result = agent.run("Calculate 25 * 4 + 10")
print(result)
```

## Tools与Toolkits

### 内置工具

```python
from langchain.agents import load_tools

# 加载搜索工具
tools = load_tools(["serpapi"], serpapi_api_key="your-key")

# 加载计算工具
tools = load_tools(["llm-math"], llm=llm)

# 加载Python REPL工具
tools = load_tools(["python-repl"])

# 加载多个工具
tools = load_tools(["serpapi", "llm-math", "python-repl"], llm=llm)
```

### Toolkits（工具集）

```python
from langchain.agents.agent_toolkits import (
    create_python_agent,
    create_pandas_dataframe_agent
)

# Python Agent
python_agent = create_python_agent(
    llm,
    tool=PythonREPLTool(),
    verbose=True
)

result = python_agent.run("Calculate the factorial of 10")
print(result)

# Pandas DataFrame Agent
import pandas as pd

df = pd.read_csv("data.csv")

pandas_agent = create_pandas_dataframe_agent(
    llm,
    df,
    verbose=True
)

result = pandas_agent.run("How many rows are in the dataframe?")
print(result)
```

### 自定义Toolkit

```python
from langchain.agents import Tool

def search_database(query: str) -> str:
    return f"Database search results for: {query}"

def send_email(to: str, subject: str, body: str) -> str:
    return f"Email sent to {to} with subject '{subject}'"

tools = [
    Tool(
        name="Database Search",
        func=search_database,
        description="Useful for searching the database"
    ),
    Tool(
        name="Email Sender",
        func=lambda x: send_email(**eval(x)),
        description="Useful for sending emails. Input should be a JSON string with 'to', 'subject', and 'body' fields"
    )
]

agent = initialize_agent(
    tools,
    llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

result = agent.run("Search the database for 'customer' and send the results to admin@example.com")
print(result)
```

## 实践练习

### 练习1：创建简单的问答链

```python
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate

qa_template = """
Question: {question}

Answer:
"""

qa_prompt = PromptTemplate(
    template=qa_template,
    input_variables=["question"]
)

qa_chain = LLMChain(
    llm=llm,
    prompt=qa_prompt
)

result = qa_chain.run("What is machine learning?")
print(result)
```

### 练习2：创建带有记忆的Agent

```python
from langchain.memory import ConversationBufferMemory
from langchain.agents import initialize_agent, AgentType

memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True
)

agent = initialize_agent(
    tools,
    llm,
    agent=AgentType.CONVERSATIONAL_REACT_DESCRIPTION,
    memory=memory,
    verbose=True
)

result1 = agent.run("My name is Alice")
result2 = agent.run("What is my name?")
print(result2)
```

## 总结

本节我们学习了LangChain框架的基础知识：

这些基础知识为后续深入学习LangChain的高级功能和构建复杂Agent应用打下了基础。