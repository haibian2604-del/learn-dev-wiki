---
type: summary
domain: tech
tags: [spring, springboot, java]
created: 2026-07-31
updated: 2026-07-31
sources: ["[[00-Raw/java-backend/JavaGuide-SpringBoot自动装配]]"]
status: seedling
---

# JavaGuide · SpringBoot 自动装配原理

> SpringBoot 自动装配（Auto-configuration）机制深度解析：为什么加个 starter 依赖就能用，底层靠 @EnableAutoConfiguration + SpringFactories 机制。

## 核心观点

- **自动装配的入口**：`@SpringBootApplication` = `@SpringBootConfiguration` + `@EnableAutoConfiguration` + `@ComponentScan`
- **核心机制**：`@EnableAutoConfiguration` 通过 `META-INF/spring.factories`（或 `AutoConfiguration.imports`）加载候选自动配置类列表
- **条件装配**：每个自动配置类用 `@ConditionalOnClass/@ConditionalOnMissingBean` 等条件注解按需生效——**有类才配，缺 Bean 才建**
- **starter 依赖的实质**：starter 只是 Maven 依赖聚合 + 传递触发自动配置类扫描
- **自定义自动配置**：`@Configuration` + 条件注解 + 在 spring.factories 注册

## 亮点与不足

- 亮点：条件注解机制讲透了"按需装配"而非"全量装配"；配置优先级（用户自定义 > 自动配置默认值）
- 不足：进阶内容（`@ConfigurationProperties` 绑定、失效分析）未深入

## 相关概念

→ [[01-Wiki/entities/Spring]]（框架体系）
