---
type: concept
domain: tech
tags: [spring, ioc, java]
created: 2026-07-31
updated: 2026-07-31
sources: ["[[01-Wiki/summaries/JavaGuide Spring IoC与AOP]]", "[[01-Wiki/summaries/JavaGuide Spring面试题]]"]
status: growing
---

# IoC（Inversion of Control，控制反转）

> 将对象创建/管理的控制权从代码转交给外部容器的设计思想。Spring 的核心基石，IoC 容器本质是一个 `Map<String, Object>`。

## 定义

- **控制**：对象创建（实例化、管理）的权力
- **反转**：控制权交给外部环境（IoC 容器）
- 传统方式：`new` 手动创建依赖对象；IoC 方式：向容器"要"对象

IoC 是设计思想而非技术实现，非 Spring 独有；**DI（依赖注入）是 IoC 最常见最合理的实现方式**（Martin Fowler 建议用 DI 精确命名）。

## 解决的问题

1. **降低耦合**：换 `IUserDao` 实现类无需修改所有引用方（传统 new 方式需改每一处）
2. **资源易管理**：容器级单例、生命周期统一管理

## 关键机制

- **Bean 生命周期**：实例化 → 属性赋值 → Aware 回调 → BeanPostProcessor → init → 使用 → 销毁
- **作用域**：singleton（默认）/ prototype / request / session
- **注入方式**：构造器（推荐）/ Setter / 字段注入
- **循环依赖**：三级缓存解决（singletonObjects → earlySingletonObjects → singletonFactories），仅支持 setter/字段注入；构造器循环依赖不可解

## 边界与常见误区

- IoC ≠ Spring：Spring 只是优秀实现，IoC 在其他语言/框架同样存在
- 依赖注入 ≠ 唯一实现方式：还有 Service Locator 等其他 IoC 实现
- @Autowired 按类型注入；@Resource 按名称（JSR-250）

## 相关概念

- [[01-Wiki/entities/Spring]]（框架载体）
- [[01-Wiki/concepts/AOP]]（Spring 另一基石，与 IoC 互补）
- [[01-Wiki/summaries/JavaGuide Spring设计模式]]（工厂/单例模式与 IoC 相关）
