---
type: entity
domain: tech
tags: [spring, java, framework]
created: 2026-07-31
updated: 2026-07-31
sources: ["[[01-Wiki/summaries/JavaGuide Spring IoC与AOP]]", "[[01-Wiki/summaries/JavaGuide Spring面试题]]"]
status: growing
---

# Spring

> Java 生态最主流的企业级应用框架。IoC（容器）与 AOP（切面）是其两大基石，SpringBoot 提供自动装配简化配置。

## 是什么

Spring 将两大思想（IoC 控制反转、AOP 面向切面编程）做了工程化实现，提供 Bean 管理、依赖注入、声明式事务、Web MVC、数据访问抽象等能力。

## 关键事实

- **IoC 容器**：BeanFactory 为工厂接口，DefaultListableBeanFactory 为默认实现；容器本质是 `Map<String, Object>`（→ [[01-Wiki/concepts/IoC]]）
- **AOP**：运行时动态代理（JDK/CGLIB），支撑声明式事务与切面编程（→ [[01-Wiki/concepts/AOP]]）
- **SpringBoot 自动装配**：`@EnableAutoConfiguration` + 条件注解 + SpringFactories 按需装配（→ [[01-Wiki/summaries/JavaGuide SpringBoot自动装配]]）
- **事务管理**：`@Transactional` 声明式事务 + 传播行为/隔离级别（→ [[01-Wiki/summaries/JavaGuide Spring事务]]）
- **设计模式应用**：工厂/单例/代理/模板方法/观察者/策略/适配器/装饰器（→ [[01-Wiki/summaries/JavaGuide Spring设计模式]]）
- **面试核心**：Bean 生命周期、循环依赖三级缓存、@Autowired vs @Resource（→ [[01-Wiki/summaries/JavaGuide Spring面试题]]）

## 相关

- 相关概念：[[01-Wiki/concepts/IoC]]、[[01-Wiki/concepts/AOP]]
- 相关来源：JavaGuide Spring 系列 5 篇摘要页
- 关联：本知识库所在机器另有 JavaGuide 仓库（`/Users/kk/my-node/JavaGuide`），本页为其 docs 的提炼
