---
title: "架构师AI杜技术文档"
source: "https://www.weekr.net/ai/day-39.html"
author:
  - "[[架构师AI杜]]"
published: 2026-03-09
created: 2026-09-04
description: "第39天：LangChain框架（下） - 架构师AI杜技术文档"
tags:
  - "clippings"
---
## 第39天：LangChain框架（下）

## 学习目标

- 掌握LangChain的高级Agent模式
- 学习Memory组件的使用
- 了解Callback机制
- 掌握自定义Agent的实现
- 学习Agent性能优化

## 高级Agent模式

### 1\. Conversational Agent（对话Agent）

```python
from langchain.agents import initialize_agent, AgentType
from langchain.memory import ConversationBufferMemory
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(temperature=0)

memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True
)

tools = load_tools(["serpapi", "llm-math"], llm=llm)

agent = initialize_agent(
    tools,
    llm,
    agent=AgentType.CONVERSATIONAL_REACT_DESCRIPTION,
    memory=memory,
    verbose=True
)

result = agent.run("What is the capital of France?")
print(result)

result = agent.run("And what's its population?")
print(result)
```

### 2\. Structured Chat Agent（结构化对话Agent）

```python
from langchain.agents import initialize_agent, AgentType
from langchain.tools import StructuredTool
from pydantic import BaseModel, Field

class WeatherInput(BaseModel):
    location: str = Field(description="City name")
    unit: str = Field(description="Temperature unit (C or F)")

def get_weather(location: str, unit: str = "C") -> str:
    return f"The weather in {location} is 25{unit} and sunny"

weather_tool = StructuredTool.from_function(
    func=get_weather,
    name="Weather",
    description="Get current weather for a location",
    args_schema=WeatherInput
)

tools = [weather_tool]

agent = initialize_agent(
    tools,
    llm,
    agent=AgentType.STRUCTURED_CHAT_ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

result = agent.run("What's the weather in New York?")
print(result)
```

### 3\. Self-Ask with Search Agent

```python
from langchain.agents import initialize_agent, AgentType
from langchain.tools import Tool

search_tool = Tool(
    name="Search",
    func=lambda q: f"Search results for: {q}",
    description="Useful for searching the internet"
)

tools = [search_tool]

agent = initialize_agent(
    tools,
    llm,
    agent=AgentType.SELF_ASK_WITH_SEARCH,
    verbose=True
)

result = agent.run("Who was the first person to walk on the moon?")
print(result)
```

### 4\. Plan-and-Execute Agent

```python
from langchain.experimental import PlanAndExecute, load_agent_executor, load_chat_planner

planner = load_chat_planner(llm)
executor = load_agent_executor(llm, tools, verbose=True)

agent = PlanAndExecute(
    planner=planner,
    executor=executor,
    verbose=True
)

result = agent.run("Research the history of AI and write a summary")
print(result)
```

## Memory组件

### 1\. ConversationBufferMemory

```python
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory()

memory.save_context(
    {"input": "Hi, I'm Alice"},
    {"output": "Hello Alice! How can I help you?"}
)

memory.save_context(
    {"input": "What's my name?"},
    {"output": "Your name is Alice."}
)

print(memory.load_memory_variables({}))
```

### 2\. ConversationBufferWindowMemory

```python
from langchain.memory import ConversationBufferWindowMemory

memory = ConversationBufferWindowMemory(k=2)

memory.save_context({"input": "Hi"}, {"output": "Hello"})
memory.save_context({"input": "How are you?"}, {"output": "I'm good"})
memory.save_context({"input": "What's your name?"}, {"output": "I'm an AI"})

print(memory.load_memory_variables({}))
```

### 3\. ConversationSummaryMemory

```python
from langchain.memory import ConversationSummaryMemory

memory = ConversationSummaryMemory(llm=llm)

memory.save_context(
    {"input": "I'm learning about AI"},
    {"output": "That's great! AI is a fascinating field"}
)

memory.save_context(
    {"input": "What should I learn first?"},
    {"output": "Start with basics like machine learning and neural networks"}
)

print(memory.load_memory_variables({}))
```

### 4\. ConversationKGMemory

```python
from langchain.memory import ConversationKGMemory

memory = ConversationKGMemory(llm=llm)

memory.save_context(
    {"input": "Alice is a software engineer"},
    {"output": "I understand Alice is a software engineer"}
)

memory.save_context(
    {"input": "She works at Google"},
    {"output": "Noted that Alice works at Google"}
)

print(memory.load_memory_variables({}))
```

### 5\. VectorStore Memory

```python
from langchain.memory import VectorStoreRetrieverMemory
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings

embeddings = OpenAIEmbeddings()
vectorstore = Chroma.from_texts(
    ["Alice is a software engineer", "Bob is a data scientist"],
    embeddings
)

retriever = vectorstore.as_retriever()
memory = VectorStoreRetrieverMemory(retriever=retriever)

memory.save_context(
    {"input": "Who is Alice?"},
    {"output": "Alice is a software engineer"}
)

print(memory.load_memory_variables({}))
```

## Callback机制

### 1\. 基础Callback Handler

```python
from langchain.callbacks.base import BaseCallbackHandler

class MyCallbackHandler(BaseCallbackHandler):
    def on_llm_start(self, serialized, prompts, **kwargs):
        print(f"LLM started with prompts: {prompts}")
    
    def on_llm_end(self, response, **kwargs):
        print(f"LLM finished with response: {response.generations[0][0].text}")
    
    def on_llm_error(self, error, **kwargs):
        print(f"LLM error: {error}")
    
    def on_chain_start(self, serialized, inputs, **kwargs):
        print(f"Chain started with inputs: {inputs}")
    
    def on_chain_end(self, outputs, **kwargs):
        print(f"Chain finished with outputs: {outputs}")
    
    def on_chain_error(self, error, **kwargs):
        print(f"Chain error: {error}")
    
    def on_tool_start(self, serialized, input_str, **kwargs):
        print(f"Tool started with input: {input_str}")
    
    def on_tool_end(self, output, **kwargs):
        print(f"Tool finished with output: {output}")
    
    def on_tool_error(self, error, **kwargs):
        print(f"Tool error: {error}")

handler = MyCallbackHandler()

llm = ChatOpenAI(
    temperature=0,
    callbacks=[handler]
)

response = llm.invoke("What is AI?")
```

### 2\. Streaming Callback

```python
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler

streaming_handler = StreamingStdOutCallbackHandler()

llm = ChatOpenAI(
    temperature=0,
    streaming=True,
    callbacks=[streaming_handler]
)

response = llm.invoke("Tell me a story about AI")
```

### 3\. Token Usage Callback

```python
from langchain.callbacks import get_openai_callback

with get_openai_callback() as cb:
    response = llm.invoke("What is AI?")
    
    print(f"Total Tokens: {cb.total_tokens}")
    print(f"Prompt Tokens: {cb.prompt_tokens}")
    print(f"Completion Tokens: {cb.completion_tokens}")
    print(f"Total Cost: ${cb.total_cost}")
```

### 4\. Custom Callback Handler

```python
class TokenCounterHandler(BaseCallbackHandler):
    def __init__(self):
        self.token_count = 0
    
    def on_llm_new_token(self, token, **kwargs):
        self.token_count += 1
        print(f"Token {self.token_count}: {token}")

token_handler = TokenCounterHandler()

llm = ChatOpenAI(
    temperature=0,
    streaming=True,
    callbacks=[token_handler]
)

response = llm.invoke("What is AI?")
print(f"\nTotal tokens: {token_handler.token_count}")
```

## 自定义Agent

### 1\. 自定义Agent Prompt

```python
from langchain.agents import initialize_agent, AgentType
from langchain.prompts import PromptTemplate

custom_prompt = PromptTemplate.from_template("""
You are a helpful AI assistant with access to the following tools:

{tools}

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question

Begin!

Question: {input}
Thought: {agent_scratchpad}
""")

agent = initialize_agent(
    tools,
    llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True,
    agent_prompt=custom_prompt
)

result = agent.run("What is the weather in Tokyo?")
print(result)
```

### 2\. 自定义Agent类

```python
from langchain.agents import AgentExecutor, LLMSingleActionAgent, AgentOutputParser
from langchain.schema import AgentAction, AgentFinish
import re

class CustomAgentOutputParser(AgentOutputParser):
    def parse(self, llm_output: str):
        if "Final Answer:" in llm_output:
            return AgentFinish(
                return_values={"output": llm_output.split("Final Answer:")[-1].strip()},
                log=llm_output,
            )
        
        match = re.search(r"Action: (.*)\nAction Input: (.*)", llm_output, re.DOTALL)
        if not match:
            raise ValueError(f"Could not parse LLM output: \`{llm_output}\`")
        
        action = match.group(1).strip()
        action_input = match.group(2).strip()
        
        return AgentAction(
            tool=action,
            tool_input=action_input,
            log=llm_output
        )

parser = CustomAgentOutputParser()

agent = LLMSingleActionAgent(
    llm=llm,
    prompt=custom_prompt,
    output_parser=parser,
    stop=["\nObservation:"],
    tools=tools
)

agent_executor = AgentExecutor.from_agent_and_tools(
    agent=agent,
    tools=tools,
    verbose=True
)

result = agent_executor.run("What is 2 + 2?")
print(result)
```

### 3\. 自定义Tool

```python
from langchain.tools import BaseTool
from typing import Type
from pydantic import BaseModel, Field

class SearchInput(BaseModel):
    query: str = Field(description="Search query")

class CustomSearchTool(BaseTool):
    name = "custom_search"
    description = "Search for information on the web"
    args_schema: Type[BaseModel] = SearchInput
    
    def _run(self, query: str) -> str:
        return f"Search results for: {query}"
    
    async def _arun(self, query: str) -> str:
        return self._run(query)

custom_tool = CustomSearchTool()

agent = initialize_agent(
    [custom_tool],
    llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

result = agent.run("Search for 'AI trends 2024'")
print(result)
```

## 性能优化

### 1\. 缓存

```python
from langchain.cache import InMemoryCache
from langchain.globals import set_llm_cache

set_llm_cache(InMemoryCache())

llm = ChatOpenAI(temperature=0)

response1 = llm.invoke("What is AI?")
response2 = llm.invoke("What is AI?")

print(response1 == response2)
```

### 2\. 异步调用

```python
import asyncio
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(temperature=0)

async def async_invoke(prompt: str):
    return await llm.ainvoke(prompt)

async def main():
    prompts = [
        "What is AI?",
        "What is machine learning?",
        "What is deep learning?"
    ]
    
    tasks = [async_invoke(prompt) for prompt in prompts]
    results = await asyncio.gather(*tasks)
    
    for result in results:
        print(result.content)

asyncio.run(main())
```

### 3\. 批量处理

```python
from langchain.prompts import PromptTemplate

prompt = PromptTemplate.from_template("Tell me about {topic}")

prompts = [
    prompt.format(topic="AI"),
    prompt.format(topic="ML"),
    prompt.format(topic="DL")
]

results = llm.generate(prompts)

for generation in results.generations:
    print(generation[0].text)
```

### 4\. 流式输出

```python
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler

streaming_handler = StreamingStdOutCallbackHandler()

llm = ChatOpenAI(
    temperature=0,
    streaming=True,
    callbacks=[streaming_handler]
)

for chunk in llm.stream("Tell me about AI"):
    print(chunk.content, end="", flush=True)
```

## 实践练习

### 练习1：创建带有记忆和自定义工具的Agent

```python
from langchain.memory import ConversationBufferMemory
from langchain.tools import BaseTool
from pydantic import BaseModel, Field

class CalculatorInput(BaseModel):
    expression: str = Field(description="Mathematical expression")

class CalculatorTool(BaseTool):
    name = "calculator"
    description = "Calculate mathematical expressions"
    args_schema: Type[BaseModel] = CalculatorInput
    
    def _run(self, expression: str) -> str:
        return str(eval(expression))

memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True
)

tools = [CalculatorTool()]

agent = initialize_agent(
    tools,
    llm,
    agent=AgentType.CONVERSATIONAL_REACT_DESCRIPTION,
    memory=memory,
    verbose=True
)

result = agent.run("Calculate 25 * 4")
print(result)
```

### 练习2：创建带有Callback的Agent

```python
class LoggingCallbackHandler(BaseCallbackHandler):
    def on_tool_start(self, serialized, input_str, **kwargs):
        print(f"Tool {serialized['name']} started with input: {input_str}")
    
    def on_tool_end(self, output, **kwargs):
        print(f"Tool finished with output: {output}")

handler = LoggingCallbackHandler()

agent = initialize_agent(
    tools,
    llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    callbacks=[handler],
    verbose=True
)

result = agent.run("Calculate 10 + 20")
print(result)
```

## 总结

本节我们学习了LangChain框架的高级功能：

1. 高级Agent模式（Conversational、Structured Chat、Self-Ask、Plan-and-Execute）
2. Memory组件的使用（Buffer、Window、Summary、KG、VectorStore）
3. Callback机制（基础、Streaming、Token Usage、Custom）
4. 自定义Agent的实现
5. Agent性能优化（缓存、异步、批量、流式）

这些高级功能使我们能够构建更强大、更高效的Agent应用。