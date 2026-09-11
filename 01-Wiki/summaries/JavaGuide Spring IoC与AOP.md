---
type: summary
domain: tech
tags: [spring, ioc, aop, java]
created: 2026-07-31
updated: 2026-07-31
sources: ["[[00-Raw/java-backend/JavaGuide-Spring IoC与AOP]]"]
status: growing
---

# JavaGuide · Spring IoC 与 AOP

> JavaGuide 经典教程：控制反转与面向切面编程的原理详解，从"思想"到 Spring 实现。IoC & AOP 不是 Spring 发明，Spring 是优秀的技术实现。

## 核心观点

- **IoC（控制反转）= 思想**：将对象创建/管理的控制权从代码转交给外部容器（Spring IoC 容器本质是个 Map<String, Object>）；换来"不用再考虑对象创建与管理"，代价是"丧失创建对象的权力"
- **IoC 解决的问题**：降低耦合（换 `IUserDao` 实现类无需改所有引用方）、资源易管理（容器级单例）
- **IoC vs DI**：IoC 是设计思想；DI（依赖注入）是其最常见/最合理的实现方式。Martin Fowler 建议改名 DI 因为 IoC 太泛（→ [[01-Wiki/concepts/IoC]]）
- **AOP = OOP 的延续**：解决横切关注点（日志/事务/权限/限流/幂等）分散在多个类中的代码冗余问题，通过动态代理/字节码实现复用解耦
- **AOP 关键术语**：横切关注点 / 切面 Aspect / 连接点 JoinPoint / 通知 Advice / 切点 Pointcut / 织入 Weaving（编译期 AspectJ vs 运行期 Spring AOP）
- **5 种通知**：Before / After / AfterReturning / AfterThrowing（与 AfterReturning 互斥）/ Around（可编程控制，能力最大）
- **动态代理**：Spring AOP 默认 JDK 动态代理（接口）或 CGLIB（类），无接口时用 CGLIB

## 亮点与不足

- 亮点："IoC 是 Map"的类比简洁；Service/Dao 换实现的例子讲透了解耦价值
- 亮点：AOP 术语表完整（含 pointcut 表达式示例 `execution(* com.xyz.service..*(..))`）
- 不足：未深入 AOP 失效场景（自调用、final 方法）——在面试题篇可能覆盖

## 相关概念

→ [[01-Wiki/concepts/IoC]]、[[01-Wiki/concepts/AOP]]、[[01-Wiki/entities/Spring]]
