---
type: concept
domain: tech
tags: [spring, aop, java]
created: 2026-07-31
updated: 2026-07-31
sources: ["[[01-Wiki/summaries/JavaGuide Spring IoC与AOP]]", "[[01-Wiki/summaries/JavaGuide Spring事务]]"]
status: growing
---

# AOP（Aspect Oriented Programming，面向切面编程）

> 将横切关注点（日志/事务/权限/限流/幂等）从核心业务逻辑中分离的编程范式，OOP 的延续与补充。Spring 通过动态代理实现。

## 定义

OOP 按对象封装业务逻辑；AOP 解决"分散在多个类中的公共行为"（横切关注点）的复用与解耦。**OOP 与 AOP 互补而非对立**。

## 关键术语

| 术语 | 含义 |
|------|------|
| 横切关注点 | 多个类共有的公共行为（日志/事务/权限） |
| 切面 Aspect | 封装横切关注点的类 |
| 连接点 JoinPoint | 方法调用的特定时刻 |
| 通知 Advice | 切面在连接点执行的操作（5 种类型） |
| 切点 Pointcut | 匹配哪些连接点被增强的表达式（如 `execution(* com.xyz.service..*(..))`） |
| 织入 Weaving | 切面与目标对象连接：编译期（AspectJ）/运行期（Spring AOP） |

**5 种通知**：Before / After / AfterReturning（与 AfterThrowing 互斥）/ AfterThrowing / Around（可编程控制，能力最大）。

## 实现机制

- **Spring AOP**：运行时动态代理——JDK 动态代理（目标有接口）或 CGLIB（无接口，子类代理）
- **代理限制**：默认只增强 public 方法；同类自调用绕过代理（AOP 失效常见原因）
- **典型应用**：声明式事务 `@Transactional`（→ [[01-Wiki/summaries/JavaGuide Spring事务]]）、日志切面、权限切面

## 边界与常见误区

- AOP ≠ Spring AOP：AspectJ 是完整实现（编译期织入），Spring AOP 只是运行时子集
- final 方法/类无法被 CGLIB 代理 → AOP 失效
- 自调用（this.method() 而非代理调用）不会触发切面

## 相关概念

- [[01-Wiki/entities/Spring]]、[[01-Wiki/concepts/IoC]]（Spring 两大基石）
- [[01-Wiki/summaries/JavaGuide Spring设计模式]]（代理模式是 AOP 底层）
- [[01-Wiki/summaries/JavaGuide Spring事务]]（AOP 的典型应用）
