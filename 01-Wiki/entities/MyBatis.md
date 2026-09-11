---
type: entity
domain: tech
tags: [mybatis, java, framework]
created: 2026-07-31
updated: 2026-07-31
sources: ["[[01-Wiki/summaries/JavaGuide MyBatis面试题]]"]
status: growing
---

# MyBatis

> Java 半自动 ORM 框架：SQL 由开发者编写（XML/注解），映射由框架处理。以灵活 SQL 控制力著称，与 Spring Boot 集成紧密。

## 是什么

MyBatis 定位"半自动"：相比 Hibernate 全自动映射，MyBatis 把 SQL 控制权留给开发者，适合复杂查询与 SQL 调优场景。

## 关键事实

- **`#{}` vs `${}`**：`#{}` 预编译占位符（PreparedStatement，防 SQL 注入）；`${}` 字符串拼接（有注入风险，仅动态表名/列名）
- **Mapper 映射原理**：Mapper 接口 → MapperProxy 动态代理 → 绑定 XML/注解 SQL；`SqlSessionFactory` 为工厂入口
- **动态 SQL**：`<if>/<choose>/<where>/<set>/<foreach>`（OGNL 表达式）
- **缓存**：一级缓存（SqlSession 级，默认开）、二级缓存（namespace 级，显式配置）；增删改会清缓存
- **分页**：RowBounds 逻辑分页（全查再分）vs PageHelper 物理分页（拦截器改写 SQL 加 LIMIT）
- **ResultMap**：结果集到实体的灵活映射（自动/手动映射、association/collection 嵌套）

## 相关

- 相关实体：[[01-Wiki/entities/Spring]]（Spring Boot 集成：mybatis-spring-boot-starter）
- 相关来源：[[01-Wiki/summaries/JavaGuide MyBatis面试题]]
- 相关概念：数据库访问层（JDBC → MyBatis 的演进）
