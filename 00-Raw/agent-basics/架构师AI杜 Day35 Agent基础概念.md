---
title: "架构师AI杜技术文档"
source: "https://www.weekr.net/ai/day-35.html"
author:
  - "[[架构师AI杜]]"
published: 2026-03-09
created: 2026-09-04
description: "第35天：Agent基础概念 - 架构师AI杜技术文档"
tags:
  - "clippings"
---
## 第35天：Agent基础概念

## 学习目标

- 理解AI Agent的定义和核心特征
- 掌握Agent的分类体系
- 了解Agent与传统AI系统的区别
- 熟悉Agent的应用场景
- 理解Agent的发展历史

## Agent的定义

### 什么是Agent

AI Agent（智能体）是一个能够自主感知环境、进行推理决策、执行行动并实现目标的智能系统。

**核心特征** ：

1. **自主性** ：Agent能够自主地做出决策和行动
2. **感知性** ：Agent能够感知和理解环境信息
3. **反应性** ：Agent能够对环境变化做出及时响应
4. **主动性** ：Agent能够主动采取行动实现目标
5. **社会性** ：Agent能够与其他Agent或人类进行交互

**形式化定义** ：

```
Agent = <Perception, Reasoning, Action, Learning>
```
- **Perception（感知）** ：从环境中获取信息
- **Reasoning（推理）** ：基于感知信息进行决策
- **Action（行动）** ：执行决策产生的行动
- **Learning（学习）** ：从经验中学习和改进

### Agent vs 传统AI系统

| 特性 | 传统AI系统 | AI Agent |
| --- | --- | --- |
| 自主性 | 低 | 高 |
| 感知能力 | 有限 | 强 |
| 决策方式 | 规则/模型驱动 | 自主推理 |
| 适应性 | 低 | 高 |
| 目标导向 | 否 | 是 |
| 交互能力 | 被动 | 主动 |

## Agent的分类

### 按能力分类

#### 1\. Reactive Agent（反应式Agent）

**特点** ：

- 直接对感知信息做出反应
- 不维护内部状态
- 不进行复杂推理
- 响应速度快

**适用场景** ：

- 简单任务
- 实时响应
- 资源受限环境

**示例** ：

```python
class ReactiveAgent:
    def __init__(self):
        self.rules = {
            "high_temperature": "turn_on_fan",
            "low_temperature": "turn_on_heater",
            "dark": "turn_on_light"
        }
    
    def perceive(self, environment):
        return environment.get_current_state()
    
    def act(self, perception):
        for condition, action in self.rules.items():
            if condition in perception:
                return action
        return "do_nothing"
```

#### 2\. Cognitive Agent（认知式Agent）

**特点** ：

- 维护内部状态
- 进行复杂推理
- 支持规划和学习
- 具有记忆能力

**适用场景** ：

- 复杂任务
- 长期规划
- 需要学习的场景

**示例** ：

```python
class CognitiveAgent:
    def __init__(self):
        self.memory = []
        self.goals = []
        self.planner = Planner()
    
    def perceive(self, environment):
        state = environment.get_current_state()
        self.update_memory(state)
        return state
    
    def reason(self, state):
        current_goal = self.select_goal()
        plan = self.planner.create_plan(state, current_goal)
        return plan
    
    def act(self, plan):
        action = plan.next_action()
        result = self.execute_action(action)
        self.learn_from_result(action, result)
        return result
    
    def update_memory(self, state):
        self.memory.append({
            "timestamp": time.time(),
            "state": state
        })
```

### 按数量分类

#### 1\. Single Agent（单Agent）

**特点** ：

- 独立完成任务
- 不依赖其他Agent
- 控制简单

**适用场景** ：

- 个人助理
- 单任务系统
- 独立应用

#### 2\. Multi-Agent（多Agent）

**特点** ：

- 多个Agent协作
- 需要协调机制
- 可以并行处理

**适用场景** ：

- 复杂系统
- 分布式任务
- 需要协作的场景

**协作模式** ：

```python
class MultiAgentSystem:
    def __init__(self):
        self.agents = []
        self.coordinator = Coordinator()
    
    def add_agent(self, agent):
        self.agents.append(agent)
    
    def execute_task(self, task):
        subtasks = self.coordinator.decompose_task(task)
        
        results = []
        for subtask in subtasks:
            agent = self.coordinator.assign_agent(subtask)
            result = agent.execute(subtask)
            results.append(result)
        
        return self.coordinator.combine_results(results)
```

### 按目标分类

#### 1\. Goal-Oriented Agent（目标导向Agent）

**特点** ：

- 有明确的目标
- 主动追求目标
- 规划最优路径

**示例** ：

```python
class GoalOrientedAgent:
    def __init__(self, goal):
        self.goal = goal
        self.planner = Planner()
    
    def perceive(self, environment):
        return environment.get_state()
    
    def plan(self, state):
        return self.planner.plan(state, self.goal)
    
    def act(self, plan):
        for action in plan:
            self.execute(action)
            if self.goal_achieved():
                break
```

#### 2\. Utility-Based Agent（效用导向Agent）

**特点** ：

- 基于效用函数决策
- 最大化期望效用
- 处理不确定性

**示例** ：

```python
class UtilityBasedAgent:
    def __init__(self, utility_function):
        self.utility_function = utility_function
    
    def evaluate_actions(self, state, possible_actions):
        utilities = {}
        for action in possible_actions:
            expected_utility = self.calculate_expected_utility(
                state, action
            )
            utilities[action] = expected_utility
        return utilities
    
    def choose_action(self, utilities):
        return max(utilities, key=utilities.get)
```

## Agent的核心组件

### 1\. 感知模块

**功能** ：

- 从环境中获取信息
- 过滤和处理感知数据
- 更新内部状态

**实现** ：

```python
class PerceptionModule:
    def __init__(self, sensors):
        self.sensors = sensors
    
    def perceive(self, environment):
        perceptions = {}
        for sensor in self.sensors:
            data = sensor.read(environment)
            perceptions[sensor.name] = self.process(data)
        return perceptions
    
    def process(self, data):
        return self.filter(data)
    
    def filter(self, data):
        return self.remove_noise(data)
```

### 2\. 推理模块

**功能** ：

- 基于感知信息进行推理
- 制定决策和计划
- 评估行动方案

**实现** ：

```python
class ReasoningModule:
    def __init__(self, knowledge_base):
        self.knowledge_base = knowledge_base
    
    def reason(self, perceptions, goals):
        context = self.build_context(perceptions)
        options = self.generate_options(context, goals)
        decision = self.evaluate_options(options)
        return decision
    
    def build_context(self, perceptions):
        return self.knowledge_base.integrate(perceptions)
    
    def generate_options(self, context, goals):
        return self.knowledge_base.query(context, goals)
    
    def evaluate_options(self, options):
        return self.rank_options(options)
```

### 3\. 行动模块

**功能** ：

- 执行决策产生的行动
- 监控执行过程
- 处理执行异常

**实现** ：

```python
class ActionModule:
    def __init__(self, actuators):
        self.actuators = actuators
    
    def execute(self, action):
        actuator = self.select_actuator(action)
        try:
            result = actuator.perform(action)
            return self.success(result)
        except Exception as e:
            return self.failure(e)
    
    def select_actuator(self, action):
        for actuator in self.actuators:
            if actuator.can_perform(action):
                return actuator
        raise Exception("No suitable actuator")
```

### 4\. 学习模块

**功能** ：

- 从经验中学习
- 更新知识库
- 改进决策策略

**实现** ：

```python
class LearningModule:
    def __init__(self):
        self.experience = []
        self.model = None
    
    def learn(self, experience):
        self.experience.append(experience)
        self.update_model()
    
    def update_model(self):
        self.model = self.train_model(self.experience)
    
    def predict(self, state, action):
        if self.model:
            return self.model.predict(state, action)
        return None
```

## Agent的应用场景

### 1\. 个人助理

**功能** ：

- 日程管理
- 信息查询
- 任务执行
- 决策支持

**示例** ：

```python
class PersonalAssistantAgent:
    def __init__(self):
        self.calendar = Calendar()
        self.knowledge = KnowledgeBase()
        self.tools = ToolRegistry()
    
    def handle_request(self, request):
        intent = self.understand(request)
        if intent == "schedule":
            return self.schedule(request)
        elif intent == "query":
            return self.query(request)
        elif intent == "execute":
            return self.execute(request)
```

### 2\. 智能客服

**功能** ：

- 自动问答
- 问题分类
- 工单处理
- 客户服务

**示例** ：

```python
class CustomerServiceAgent:
    def __init__(self):
        self.knowledge_base = KnowledgeBase()
        self.ticket_system = TicketSystem()
    
    def handle_query(self, query):
        answer = self.knowledge_base.search(query)
        if answer:
            return answer
        else:
            return self.escalate(query)
    
    def escalate(self, query):
        ticket = self.ticket_system.create(query)
        return f"Created ticket {ticket.id}"
```

### 3\. 自动化任务

**功能** ：

- 流程自动化
- 数据处理
- 报告生成
- 系统监控

**示例** ：

```python
class AutomationAgent:
    def __init__(self):
        self.workflows = WorkflowRegistry()
    
    def execute_workflow(self, workflow_name, parameters):
        workflow = self.workflows.get(workflow_name)
        return workflow.execute(parameters)
```

### 4\. 研究助手

**功能** ：

- 文献检索
- 数据分析
- 实验设计
- 结果总结

**示例** ：

```python
class ResearchAssistantAgent:
    def __init__(self):
        self.literature_db = LiteratureDatabase()
        self.analysis_tools = AnalysisTools()
    
    def research_topic(self, topic):
        papers = self.literature_db.search(topic)
        summary = self.summarize(papers)
        insights = self.analyze(papers)
        return {
            "summary": summary,
            "insights": insights
        }
```

## Agent的发展历史

### 早期阶段（1950s-1980s）

**关键事件** ：

- 1956：AI概念提出
- 1969：Shakey机器人
- 1970s：专家系统兴起

**特点** ：

- 基于规则的系统
- 有限的环境感知
- 简单的决策机制

### 中期阶段（1990s-2010s）

**关键事件** ：

- 1990s：强化学习兴起
- 1997：Deep Blue战胜卡斯帕罗夫
- 2000s：多Agent系统研究

**特点** ：

- 学习能力增强
- 更复杂的推理
- 多Agent协作

### 现代阶段（2010s-至今）

**关键事件** ：

- 2012：深度学习突破
- 2016：AlphaGo战胜李世石
- 2020s：大语言模型Agent

**特点** ：

- 深度学习驱动
- 强大的语言理解
- 自主决策能力

### 未来趋势

**发展方向** ：

1. **更强的自主性**
2. **更好的协作能力**
3. **更深的理解能力**
4. **更广泛的应用场景**

## 实践练习

### 练习1：实现简单的反应式Agent

```python
class SimpleReactiveAgent:
    def __init__(self):
        pass
    
    def perceive(self, environment):
        return environment.get_state()
    
    def act(self, perception):
        if perception["temperature"] > 30:
            return "turn_on_fan"
        elif perception["temperature"] < 20:
            return "turn_on_heater"
        else:
            return "do_nothing"
```

### 练习2：实现目标导向Agent

```python
class SimpleGoalAgent:
    def __init__(self, goal):
        self.goal = goal
        self.planner = SimplePlanner()
    
    def perceive(self, environment):
        return environment.get_state()
    
    def plan(self, state):
        return self.planner.plan(state, self.goal)
    
    def act(self, plan):
        for action in plan:
            self.execute(action)
            if self.check_goal():
                break
```

## 总结

本节我们学习了Agent的基础概念：

1. Agent的定义和核心特征
2. Agent的分类体系
3. Agent的核心组件
4. Agent的应用场景
5. Agent的发展历史

理解这些基础概念为后续深入学习Agent的感知、规划、行动和记忆机制打下了坚实的基础。