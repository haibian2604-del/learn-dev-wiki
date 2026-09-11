---
type: summary
domain: tech
tags: [spring, design-pattern, java]
created: 2026-07-31
updated: 2026-07-31
sources: ["[[00-Raw/java-backend/JavaGuide-Spring设计模式]]"]
status: seedling
---

# JavaGuide · Spring 中的设计模式

> Spring 框架中 GoF 设计模式的应用总结：工厂模式、代理模式、单例模式、模板方法等，每个模式对应 Spring 中的具体落地点。

## 核心观点

- **工厂模式**：BeanFactory 负责创建管理 Bean（`getBean()`），BeanFactory = 工厂接口，具体实现为 DefaultListableBeanFactory
- **单例模式**：Spring 容器默认单例（singleton scope），Bean 由容器统一管理生命周期
- **代理模式**：AOP 底层实现（JDK 动态代理 / CGLIB）——（→ [[01-Wiki/concepts/AOP]]）
- **模板方法模式**：`JdbcTemplate`、`RestTemplate`、`JmsTemplate` 等 Template 类封装固定流程，子类/回调定制可变部分
- **观察者模式**：事件驱动机制（`ApplicationEvent` + `ApplicationListener` + `@EventListener`）
- **策略模式**：`Resource` 资源访问、HandlerMapping 等多策略接口注入
- **适配器模式**：`MethodBeforeAdviceAdapter` 等通知适配器；`HandlerAdapter` 统一处理器接口
- **装饰器模式**：`BeanWrapper`、`HttpHeadResponseDecorator` 等

## 亮点与不足

- 亮点：每个模式都绑定具体 Spring 类/场景，非纯理论罗列
- 不足：模式覆盖不全（未含组合/职责链等较少用模式）；分析深度偏浅

## 相关概念

→ [[01-Wiki/entities/Spring]]、[[01-Wiki/concepts/AOP]]、[[01-Wiki/concepts/IoC]]
