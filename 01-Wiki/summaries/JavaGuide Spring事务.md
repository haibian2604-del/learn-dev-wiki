---
type: summary
domain: tech
tags: [spring, transaction, java]
created: 2026-07-31
updated: 2026-07-31
sources: ["[[00-Raw/java-backend/JavaGuide-Spring事务]]"]
status: seedling
---

# JavaGuide · Spring 事务详解

> Spring 声明式事务管理：@Transactional 注解、事务传播行为、隔离级别、失效场景。

## 核心观点

- **声明式事务**：`@Transactional` 基于 AOP 实现（→ [[01-Wiki/concepts/AOP]]），代理拦截方法调用，事务管理交给 PlatformTransactionManager
- **传播行为（Propagation）**：REQUIRED（默认，加入或新建）/ REQUIRES_NEW（挂起当前，新建）/ NESTED（嵌套，savepoint）/ SUPPORTS / NOT_SUPPORTED / MANDATORY / NEVER
- **隔离级别**：DEFAULT（数据库默认）/ READ_UNCOMMITTED / READ_COMMITTED / REPEATABLE_READ / SERIALIZABLE
- **事务失效场景（高频面试点）**：
  - 自调用（同类内方法调用绕过代理）
  - 方法非 public（Spring AOP 默认只增强 public）
  - 异常被 catch 吞掉（默认仅回滚 RuntimeException/Error）
  - rollbackFor 设置不当（默认不回滚 checked Exception）
  - 传播行为误设（如 REQUIRES_NEW 导致外层异常不回滚内层已提交事务）
- **只读事务**：readOnly=true 优化（仅查询场景）

## 亮点与不足

- 亮点：事务失效场景清单是面试高频题，讲得全（自调用/非 public/catch/rollbackFor/传播）
- 亮点：传播行为语义与嵌套（NESTED savepoint 与 REQUIRES_NEW 区别）讲清楚
- 不足：未深入分布式事务（XA/Seata/TCC）——JavaGuide 分布式中另有专题

## 相关概念

→ [[01-Wiki/entities/Spring]]、[[01-Wiki/concepts/AOP]]、[[01-Wiki/summaries/JavaGuide Spring面试题]]
