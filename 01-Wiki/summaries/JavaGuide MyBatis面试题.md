---
type: summary
domain: tech
tags: [mybatis, java, interview]
created: 2026-07-31
updated: 2026-07-31
sources: ["[[00-Raw/java-backend/JavaGuide-MyBatis面试题]]"]
status: growing
---

# JavaGuide · MyBatis 常见面试题

> MyBatis 面试高频考点：`#{}` vs `${}`、动态 SQL、一级/二级缓存、分页插件、Mapper 映射原理。

## 核心观点

- **`#{}` vs `${}`**：`#{}` 预编译占位符（PreparedStatement，防 SQL 注入）；`${}` 字符串直接拼接（有注入风险，仅用于动态表名/列名等无法预编译的场景）
- **动态 SQL**：`<if>/<choose>/<where>/<set>/<foreach>` 标签，基于 OGNL 表达式
- **缓存机制**：一级缓存（SqlSession 级别，默认开启）、二级缓存（Mapper namespace 级别，需显式配置）；查询缓存失效条件（增删改清缓存、会话关闭）
- **分页**：逻辑分页（RowBounds，全表查出再分）vs 物理分页（PageHelper 插件基于拦截器改写 SQL）
- **Mapper 映射原理**：Mapper 接口 + XML/注解绑定，`SqlSessionFactory` → MapperProxy 动态代理
- **与 JDBC 对比**：参数映射、结果集映射（resultMap）自动处理，免样板代码

## 亮点与不足

- 亮点：`#{}`/`${}` 区别是必考题，讲清预编译与注入风险；缓存两级作用域区别明确
- 亮点：分页插件拦截器原理（改写原生 SQL）是加分点
- 不足：未深入 MyBatis 源码级原理（Executor 缓存链）与 MyBatis-Plus 对比

## 相关概念

→ [[01-Wiki/entities/MyBatis]]、[[01-Wiki/entities/Spring]]（Spring 集成 MyBatis 生态）
