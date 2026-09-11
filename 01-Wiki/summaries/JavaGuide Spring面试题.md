---
type: summary
domain: tech
tags: [spring, interview, java]
created: 2026-07-31
updated: 2026-07-31
sources: ["[[00-Raw/java-backend/JavaGuide-Spring面试题]]"]
status: seedling
---

# JavaGuide · Spring 常见面试题总结

> Spring 核心面试题汇总：IoC 容器、AOP 原理、Bean 生命周期、依赖注入方式等高频考点。

## 核心观点

- **Bean 生命周期**：实例化 → 属性赋值 → Aware 回调（BeanNameAware/BeanFactoryAware）→ BeanPostProcessor 前置 → init-method/@PostConstruct → BeanPostProcessor 后置 → 使用 → 销毁（DisposableBean/destroy-method）
- **Bean 作用域**：singleton（默认）/ prototype / request / session / application
- **依赖注入方式**：构造器注入（推荐，保证不可变与必填）/ Setter 注入（可选依赖）/ 字段注入（@Autowired，不推荐，难测试）
- **循环依赖**：三级缓存解决（singletonObjects → earlySingletonObjects → singletonFactories），仅支持 setter/字段注入的循环依赖；构造器循环依赖无法解决
- **@Autowired vs @Resource**：@Autowired 按类型（Spring 注解，可配 @Qualifier），@Resource 按名称（JDK 注解）
- **Spring 事务失效场景**（→ [[01-Wiki/summaries/JavaGuide Spring事务]]）：自调用、非 public 方法、异常被 catch、传播行为设置不当等

## 亮点与不足

- 亮点：面试向高频考点集中覆盖；Bean 生命周期完整顺序是面试必背
- 亮点：循环依赖三级缓存机制讲清楚（网上常见的模糊点）
- 不足：题目以知识点清单为主，缺实际源码深度（如 AbstractAutowireCapableBeanFactory 流程）

## 相关概念

→ [[01-Wiki/entities/Spring]]、[[01-Wiki/concepts/IoC]]、[[01-Wiki/concepts/AOP]]
