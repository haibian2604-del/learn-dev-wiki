---
title: "JavaGuide/docs/ai-coding/practices/drawio-chart-skill.md at main"
source: "https://github.com/Snailclimb/JavaGuide/blob/main/docs/system-design/framework/spring/spring-boot-auto-assembly-principles.md"
author:
published:
created: 2026-07-31
description: "Java 面试 & 后端通用面试指南，覆盖计算机基础、数据库、分布式、高并发、系统设计与 AI 应用开发 - JavaGuide/docs/ai-coding/practices/drawio-chart-skill.md at main · Snailclimb/JavaGuide"
tags:
  - "clippings"
---
titleSpringBoot 自动装配原理详解descriptionSpringBoot自动装配原理深度解析，详解@EnableAutoConfiguration、SpringFactories加载机制及条件注解工作原理。category框架tag

SpringBoot

head

meta

| name | content |
| --- | --- |
| keywords | Spring Boot自动装配,AutoConfiguration,EnableAutoConfiguration,SpringFactories,条件注解,Starter,Spring Boot原理 |

> 作者： [Miki-byte-1024](https://github.com/Miki-byte-1024) & [Snailclimb](https://github.com/Snailclimb)

每次问到 Spring Boot， 面试官非常喜欢问这个问题：“讲述一下 SpringBoot 自动装配原理？”。

我觉得我们可以从以下几个方面回答：

1. 什么是 SpringBoot 自动装配？
2. SpringBoot 是如何实现自动装配的？如何实现按需加载？
3. 如何实现一个 Starter？

篇幅问题，这篇文章并没有深入，小伙伴们也可以直接使用 debug 的方式去看看 SpringBoot 自动装配部分的源代码。

## 前言

使用过 Spring 的小伙伴，一定有被 XML 配置统治的恐惧。即使 Spring 后面引入了基于注解的配置，我们在开启某些 Spring 特性或者引入第三方依赖的时候，还是需要用 XML 或 Java 进行显式配置。

举个例子。没有 Spring Boot 的时候，我们写一个 RestFul Web 服务，还首先需要进行如下配置。

```
@Configuration
public class RESTConfiguration
{
    @Bean
    public View jsonTemplate() {
        MappingJackson2JsonView view = new MappingJackson2JsonView();
        view.setPrettyPrint(true);
        return view;
    }

    @Bean
    public ViewResolver viewResolver() {
        return new BeanNameViewResolver();
    }
}
```

`spring-servlet.xml`

```
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:context="http://www.springframework.org/schema/context"
    xmlns:mvc="http://www.springframework.org/schema/mvc"
    xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
    http://www.springframework.org/schema/context/ http://www.springframework.org/schema/context/spring-context.xsd
    http://www.springframework.org/schema/mvc/ http://www.springframework.org/schema/mvc/spring-mvc.xsd">

    <context:component-scan base-package="com.howtodoinjava.demo" />
    <mvc:annotation-driven />

    <!-- JSON Support -->
    <bean name="viewResolver" class="org.springframework.web.servlet.view.BeanNameViewResolver"/>
    <bean name="jsonTemplate" class="org.springframework.web.servlet.view.json.MappingJackson2JsonView"/>

</beans>
```

但是，Spring Boot 项目，我们只需要添加相关依赖，无需配置，通过启动下面的 `main` 方法即可。

```
@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

并且，我们通过 Spring Boot 的全局配置文件 `application.properties` 或 `application.yml` 即可对项目进行设置比如更换端口号，配置 JPA 属性等等。

**为什么 Spring Boot 使用起来这么酸爽呢？** 这得益于其自动装配。 **自动装配可以说是 Spring Boot 的核心，那究竟什么是自动装配呢？**

## 什么是 SpringBoot 自动装配？

我们现在提到自动装配的时候，一般会和 Spring Boot 联系在一起。但是，实际上 Spring Framework 早就实现了这个功能。Spring Boot 只是在其基础上，通过 SPI 的方式，做了进一步优化。

> 在 Spring Boot 2.6 及更早版本中，自动配置类主要通过外部 jar 包中的 `META-INF/spring.factories` 注册。Spring Boot 2.7 引入了 `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` ，同时兼容旧的注册方式；Spring Boot 3.0 移除了通过 `spring.factories` 中 `EnableAutoConfiguration` key 注册自动配置类的支持，但 `spring.factories` 的其他用途不受影响。

没有 Spring Boot 的情况下，如果我们需要引入第三方依赖，需要手动配置，非常麻烦。但是，Spring Boot 中，我们直接引入一个 starter 即可。比如你想要在项目中使用 redis 的话，直接在项目中引入对应的 starter 即可。

```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

引入 starter 之后，我们通过少量注解和一些简单的配置就能使用第三方组件提供的功能了。

在我看来，自动装配可以简单理解为： **通过注解或者一些简单的配置就能在 Spring Boot 的帮助下实现某块功能。**

## SpringBoot 是如何实现自动装配的？

我们先看一下 SpringBoot 的核心注解 `SpringBootApplication` 。

```
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
<1.>@SpringBootConfiguration
<2.>@ComponentScan
<3.>@EnableAutoConfiguration
public @interface SpringBootApplication {

}

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Configuration //实际上它也是一个配置类
public @interface SpringBootConfiguration {
}
```

大概可以把 `@SpringBootApplication` 看作是 `@Configuration` 、 `@EnableAutoConfiguration` 、 `@ComponentScan` 注解的集合。根据 SpringBoot 官网，这三个注解的作用分别是：

- `@EnableAutoConfiguration` ：启用 SpringBoot 的自动配置机制
- `@Configuration` ：允许在上下文中注册额外的 bean 或导入其他配置类
- `@ComponentScan` ：扫描被 `@Component` (`@Service`,`@Controller`)注解的 bean，注解默认会扫描启动类所在的包下所有的类 ，可以自定义不扫描某些 bean。如下图所示，容器中将排除 `TypeExcludeFilter` 和 `AutoConfigurationExcludeFilter` 。

[![](https://camo.githubusercontent.com/b2847e4f0a832b6bbf596da494c9b24ef9f42d62d0a10242309ee40af04d815e/68747470733a2f2f6f73732e6a61766167756964652e636e2f70332d6a75656a696e2f62636337333439306166626534633662613632616364653661393466666466647e74706c762d6b3375316662706663702d77617465726d61726b2e706e67)](https://camo.githubusercontent.com/b2847e4f0a832b6bbf596da494c9b24ef9f42d62d0a10242309ee40af04d815e/68747470733a2f2f6f73732e6a61766167756964652e636e2f70332d6a75656a696e2f62636337333439306166626534633662613632616364653661393466666466647e74706c762d6b3375316662706663702d77617465726d61726b2e706e67)

`@EnableAutoConfiguration` 是实现自动装配的重要注解，我们以这个注解入手。

### @EnableAutoConfiguration:实现自动装配的核心注解

`EnableAutoConfiguration` 只是一个简单地注解，自动装配核心功能的实现实际是通过 `AutoConfigurationImportSelector` 类。

```
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@AutoConfigurationPackage //作用：将main包下的所有组件注册到容器中
@Import({AutoConfigurationImportSelector.class}) //加载自动装配类 xxxAutoconfiguration
public @interface EnableAutoConfiguration {
    String ENABLED_OVERRIDE_PROPERTY = "spring.boot.enableautoconfiguration";

    Class<?>[] exclude() default {};

    String[] excludeName() default {};
}
```

我们现在重点分析下 `AutoConfigurationImportSelector` 类到底做了什么？

### AutoConfigurationImportSelector:加载自动装配类

下面以 Spring Boot 2.1.x 的源码节选为例分析 `AutoConfigurationImportSelector` 。这些代码省略了部分不影响流程的实现，不能作为独立类直接编译。Spring Boot 2.7 及以上版本的候选自动配置类主要从 `AutoConfiguration.imports` 文件读取，具体源码结构与下面的旧版本代码有所不同。

`AutoConfigurationImportSelector` 类的继承体系如下：

```
public class AutoConfigurationImportSelector implements DeferredImportSelector, BeanClassLoaderAware, ResourceLoaderAware, BeanFactoryAware, EnvironmentAware, Ordered {

}

public interface DeferredImportSelector extends ImportSelector {

}

public interface ImportSelector {
    String[] selectImports(AnnotationMetadata var1);
}
```

可以看出， `AutoConfigurationImportSelector` 类实现了 `ImportSelector` 接口，也就实现了这个接口中的 `selectImports` 方法，该方法主要用于 **获取所有符合条件的类的全限定类名，这些类需要被加载到 IoC 容器中** 。

```
private static final String[] NO_IMPORTS = new String[0];

public String[] selectImports(AnnotationMetadata annotationMetadata) {
        // <1>.判断自动装配开关是否打开
        if (!this.isEnabled(annotationMetadata)) {
            return NO_IMPORTS;
        } else {
          //<2>.获取所有需要装配的bean
            AutoConfigurationMetadata autoConfigurationMetadata = AutoConfigurationMetadataLoader.loadMetadata(this.beanClassLoader);
            AutoConfigurationImportSelector.AutoConfigurationEntry autoConfigurationEntry = this.getAutoConfigurationEntry(autoConfigurationMetadata, annotationMetadata);
            return StringUtils.toStringArray(autoConfigurationEntry.getConfigurations());
        }
    }
```

这里我们需要重点关注一下 `getAutoConfigurationEntry()` 方法，这个方法主要负责加载自动配置类的。

该方法调用链如下：

[![](https://camo.githubusercontent.com/3aae1194d960529270537726f137583889fd8e57cac0fc7c8b7f8537a02eeb6b/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f73797374656d2d64657369676e2f6672616d65776f726b2f737072696e672f33633132303037313236353534343363613462333835303064363135626237307e74706c762d6b3375316662706663702d77617465726d61726b2e706e67)](https://camo.githubusercontent.com/3aae1194d960529270537726f137583889fd8e57cac0fc7c8b7f8537a02eeb6b/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f73797374656d2d64657369676e2f6672616d65776f726b2f737072696e672f33633132303037313236353534343363613462333835303064363135626237307e74706c762d6b3375316662706663702d77617465726d61726b2e706e67)

现在我们结合 `getAutoConfigurationEntry()` 的源码来详细分析一下：

```
private static final AutoConfigurationEntry EMPTY_ENTRY = new AutoConfigurationEntry();

AutoConfigurationEntry getAutoConfigurationEntry(AutoConfigurationMetadata autoConfigurationMetadata, AnnotationMetadata annotationMetadata) {
        //<1>.
        if (!this.isEnabled(annotationMetadata)) {
            return EMPTY_ENTRY;
        } else {
            //<2>.
            AnnotationAttributes attributes = this.getAttributes(annotationMetadata);
            //<3>.
            List<String> configurations = this.getCandidateConfigurations(annotationMetadata, attributes);
            //<4>.
            configurations = this.removeDuplicates(configurations);
            Set<String> exclusions = this.getExclusions(annotationMetadata, attributes);
            this.checkExcludedClasses(configurations, exclusions);
            configurations.removeAll(exclusions);
            configurations = this.filter(configurations, autoConfigurationMetadata);
            this.fireAutoConfigurationImportEvents(configurations, exclusions);
            return new AutoConfigurationImportSelector.AutoConfigurationEntry(configurations, exclusions);
        }
    }
```

**第 1 步**:

判断自动装配开关是否打开。默认 `spring.boot.enableautoconfiguration=true` ，可在 `application.properties` 或 `application.yml` 中设置

[![](https://camo.githubusercontent.com/b7ed5d3d6ea8f2fb4383edaf8ca1e9daf209f6a4d76e761c9869a77e61e4a8f9/68747470733a2f2f6f73732e6a61766167756964652e636e2f70332d6a75656a696e2f37376161366133373237656134333932383730663563636364303938343461627e74706c762d6b3375316662706663702d77617465726d61726b2e706e67)](https://camo.githubusercontent.com/b7ed5d3d6ea8f2fb4383edaf8ca1e9daf209f6a4d76e761c9869a77e61e4a8f9/68747470733a2f2f6f73732e6a61766167756964652e636e2f70332d6a75656a696e2f37376161366133373237656134333932383730663563636364303938343461627e74706c762d6b3375316662706663702d77617465726d61726b2e706e67)

**第 2 步** ：

用于获取 `EnableAutoConfiguration` 注解中的 `exclude` 和 `excludeName` 。

[![](https://camo.githubusercontent.com/d068320e7efa68d71224fe96c101a755d58cd57509a7724f4a8da9d61c20f703/68747470733a2f2f6f73732e6a61766167756964652e636e2f70332d6a75656a696e2f33643665633933626264613134353361613038633532623439353136633035617e74706c762d6b3375316662706663702d7a6f6f6d2d312e706e67)](https://camo.githubusercontent.com/d068320e7efa68d71224fe96c101a755d58cd57509a7724f4a8da9d61c20f703/68747470733a2f2f6f73732e6a61766167756964652e636e2f70332d6a75656a696e2f33643665633933626264613134353361613038633532623439353136633035617e74706c762d6b3375316662706663702d7a6f6f6d2d312e706e67)

**第 3 步**

在本文采用的 Spring Boot 2.1.x 源码中，获取需要自动装配的所有配置类时会读取 `META-INF/spring.factories` ：

```
spring-boot/spring-boot-project/spring-boot-autoconfigure/src/main/resources/META-INF/spring.factories
```

[![](https://camo.githubusercontent.com/dccd4307f7b39a79782dac8c4b8134d77db1dc64b524d17be3a0e297ef8af802/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f73797374656d2d64657369676e2f6672616d65776f726b2f737072696e672f35386335313932306566656134373537616131656332396336643566396533367e74706c762d6b3375316662706663702d77617465726d61726b2e706e67)](https://camo.githubusercontent.com/dccd4307f7b39a79782dac8c4b8134d77db1dc64b524d17be3a0e297ef8af802/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f73797374656d2d64657369676e2f6672616d65776f726b2f737072696e672f35386335313932306566656134373537616131656332396336643566396533367e74706c762d6b3375316662706663702d77617465726d61726b2e706e67)

从下图可以看到这个文件的配置内容都被我们读取到了。 `XXXAutoConfiguration` 的作用就是按需加载组件。

[![](https://camo.githubusercontent.com/e39e353e2063ef84bdc6bd90107cc97dbcc6b81aa3f1f110d1124200e1f52fe3/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f73797374656d2d64657369676e2f6672616d65776f726b2f737072696e672f39346436653161303630616334316462393730343365313735383738393032367e74706c762d6b3375316662706663702d77617465726d61726b2e706e67)](https://camo.githubusercontent.com/e39e353e2063ef84bdc6bd90107cc97dbcc6b81aa3f1f110d1124200e1f52fe3/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f73797374656d2d64657369676e2f6672616d65776f726b2f737072696e672f39346436653161303630616334316462393730343365313735383738393032367e74706c762d6b3375316662706663702d77617465726d61726b2e706e67)

不光是这个依赖下的 `META-INF/spring.factories` 会被读取，类路径中其他 jar 包的同名资源也会被 `SpringFactoriesLoader` 合并读取。需要注意，Starter 通常只是用于聚合依赖的 jar，自动配置代码和注册文件可以放在独立的 autoconfigure 模块中，也可以和 Starter 合并，并不是每个 Starter 都必须包含 `spring.factories` 。

所以，你可以清楚滴看到， druid 数据库连接池的 Spring Boot Starter 就创建了 `META-INF/spring.factories` 文件。

如果要为 Spring Boot 2.6 及更早版本编写自动配置，需要使用这种注册方式；面向 Spring Boot 3.x 的自动配置应改用 `AutoConfiguration.imports` 。

[![](https://camo.githubusercontent.com/abc968f3d09662e6acb523da2f3a892b095a4a73062271c97330e51632fec0f6/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f73797374656d2d64657369676e2f6672616d65776f726b2f737072696e672f36386661363661656565343734623033383566393464323362636665313734357e74706c762d6b3375316662706663702d77617465726d61726b2e706e67)](https://camo.githubusercontent.com/abc968f3d09662e6acb523da2f3a892b095a4a73062271c97330e51632fec0f6/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f73797374656d2d64657369676e2f6672616d65776f726b2f737072696e672f36386661363661656565343734623033383566393464323362636665313734357e74706c762d6b3375316662706663702d77617465726d61726b2e706e67)

**第 4 步** ：

到这里可能面试官会问你:“ `spring.factories` 中这么多配置，每次启动都要全部加载么？”。

很明显，这是不现实的。我们 debug 到后面你会发现， `configurations` 的值变小了。

[![](https://camo.githubusercontent.com/5866545c27a80ad64bca59944d7d7fa6634df0fbe0ab683816c216cfb5f7c418/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f73797374656d2d64657369676e2f6672616d65776f726b2f737072696e672f32363766383233316165326534386439383231353431343061663634333762307e74706c762d6b3375316662706663702d77617465726d61726b2e706e67)](https://camo.githubusercontent.com/5866545c27a80ad64bca59944d7d7fa6634df0fbe0ab683816c216cfb5f7c418/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f73797374656d2d64657369676e2f6672616d65776f726b2f737072696e672f32363766383233316165326534386439383231353431343061663634333762307e74706c762d6b3375316662706663702d77617465726d61726b2e706e67)

因为，这一步有经历了一遍筛选， `@ConditionalOnXXX` 中的所有条件都满足，该类才会生效。

```
@Configuration
// 检查相关的类：RabbitTemplate 和 Channel是否存在
// 存在才会加载
@ConditionalOnClass({ RabbitTemplate.class, Channel.class })
@EnableConfigurationProperties(RabbitProperties.class)
@Import(RabbitAnnotationDrivenConfiguration.class)
public class RabbitAutoConfiguration {
}
```

有兴趣的童鞋可以详细了解下 Spring Boot 提供的条件注解

- `@ConditionalOnBean` ：当容器里有指定 Bean 的条件下
- `@ConditionalOnMissingBean` ：当容器里没有指定 Bean 的情况下
- `@ConditionalOnSingleCandidate` ：当指定 Bean 在容器中只有一个，或者虽然有多个但是指定首选 Bean
- `@ConditionalOnClass` ：当类路径下有指定类的条件下
- `@ConditionalOnMissingClass` ：当类路径下没有指定类的条件下
- `@ConditionalOnProperty` ：指定的属性是否有指定的值
- `@ConditionalOnResource` ：类路径是否有指定的值
- `@ConditionalOnExpression` ：基于 SpEL 表达式作为判断条件
- `@ConditionalOnJava` ：基于 Java 版本作为判断条件
- `@ConditionalOnJndi` ：在 JNDI 存在的条件下差在指定的位置
- `@ConditionalOnNotWebApplication` ：当前项目不是 Web 项目的条件下
- `@ConditionalOnWebApplication` ：当前项目是 Web 项 目的条件下

## 如何实现一个 Starter

光说不练假把式，现在就来撸一个 starter，实现自定义线程池

第一步，创建 `threadpool-spring-boot-starter` 工程

[![](https://camo.githubusercontent.com/f1c332d826d8f5af2171afc33c4201bfc27a457eff288c1833475f923eac0e2b/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f73797374656d2d64657369676e2f6672616d65776f726b2f737072696e672f31666630656265373834346634303238396562363032313361663732633561367e74706c762d6b3375316662706663702d77617465726d61726b2e706e67)](https://camo.githubusercontent.com/f1c332d826d8f5af2171afc33c4201bfc27a457eff288c1833475f923eac0e2b/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f73797374656d2d64657369676e2f6672616d65776f726b2f737072696e672f31666630656265373834346634303238396562363032313361663732633561367e74706c762d6b3375316662706663702d77617465726d61726b2e706e67)

第二步，引入 Spring Boot 相关依赖

[![](https://camo.githubusercontent.com/f021eb7f20c5000e141734a2af68a708b75529e03b43cc81e6c475d735d05bbc/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f73797374656d2d64657369676e2f6672616d65776f726b2f737072696e672f35653134323534323736363034663837623236316535613830613335346363307e74706c762d6b3375316662706663702d77617465726d61726b2e706e67)](https://camo.githubusercontent.com/f021eb7f20c5000e141734a2af68a708b75529e03b43cc81e6c475d735d05bbc/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f73797374656d2d64657369676e2f6672616d65776f726b2f737072696e672f35653134323534323736363034663837623236316535613830613335346363307e74706c762d6b3375316662706663702d77617465726d61726b2e706e67)

第三步，创建 `ThreadPoolAutoConfiguration`

[![](https://camo.githubusercontent.com/388c2da6e0a7e8738e1c8b86ecee0fb812377a183bd80a3178f3ced57a87f1e6/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f73797374656d2d64657369676e2f6672616d65776f726b2f737072696e672f31383433663164313263353634396662613835666437623465346135396533397e74706c762d6b3375316662706663702d77617465726d61726b2e706e67)](https://camo.githubusercontent.com/388c2da6e0a7e8738e1c8b86ecee0fb812377a183bd80a3178f3ced57a87f1e6/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f73797374656d2d64657369676e2f6672616d65776f726b2f737072696e672f31383433663164313263353634396662613835666437623465346135396533397e74706c762d6b3375316662706663702d77617465726d61726b2e706e67)

第四步，注册自动配置类。对于 Spring Boot 2.6 及更早版本，在 `threadpool-spring-boot-starter` 工程的 resources 包下创建 `META-INF/spring.factories` 文件；Spring Boot 2.7 及以上版本应使用 `META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports` ，面向 Spring Boot 3.x 时自动配置类通常使用 `@AutoConfiguration` 标注。

[![](https://camo.githubusercontent.com/17e9bbb8d798f844d02c5b5f49c89ca2df9c0463d5779d43a65a93757fd209e2/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f73797374656d2d64657369676e2f6672616d65776f726b2f737072696e672f39376237333833323166313534326561383134303438346436616166303732387e74706c762d6b3375316662706663702d77617465726d61726b2e706e67)](https://camo.githubusercontent.com/17e9bbb8d798f844d02c5b5f49c89ca2df9c0463d5779d43a65a93757fd209e2/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f73797374656d2d64657369676e2f6672616d65776f726b2f737072696e672f39376237333833323166313534326561383134303438346436616166303732387e74706c762d6b3375316662706663702d77617465726d61726b2e706e67)

最后新建工程引入 `threadpool-spring-boot-starter`

[![](https://camo.githubusercontent.com/493f42469e6e9b1b6ac6931d9e6d556738ebe99bd1addf1968c18ad35580fc0b/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f73797374656d2d64657369676e2f6672616d65776f726b2f737072696e672f65646364643835393561303234616261383562366262323064306533666564347e74706c762d6b3375316662706663702d77617465726d61726b2e706e67)](https://camo.githubusercontent.com/493f42469e6e9b1b6ac6931d9e6d556738ebe99bd1addf1968c18ad35580fc0b/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f73797374656d2d64657369676e2f6672616d65776f726b2f737072696e672f65646364643835393561303234616261383562366262323064306533666564347e74706c762d6b3375316662706663702d77617465726d61726b2e706e67)

测试通过！！！

[![](https://camo.githubusercontent.com/dd09a10ccd6a381a860e943e4d4af984e0ada8180259bb7ee0fac0bc4ced1cf2/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f73797374656d2d64657369676e2f6672616d65776f726b2f737072696e672f39613236356565613464653734326136626264626261613735663433373330377e74706c762d6b3375316662706663702d77617465726d61726b2e706e67)](https://camo.githubusercontent.com/dd09a10ccd6a381a860e943e4d4af984e0ada8180259bb7ee0fac0bc4ced1cf2/68747470733a2f2f6f73732e6a61766167756964652e636e2f6769746875622f6a61766167756964652f73797374656d2d64657369676e2f6672616d65776f726b2f737072696e672f39613236356565613464653734326136626264626261613735663433373330377e74706c762d6b3375316662706663702d77617465726d61726b2e706e67)

## 总结

Spring Boot 通过 `@EnableAutoConfiguration` 开启自动装配，并加载类路径中注册的候选自动配置类。Spring Boot 2.6 及更早版本主要通过 `spring.factories` 注册，Spring Boot 2.7 及以上版本使用 `AutoConfiguration.imports` 。自动配置类会结合 `@Conditional` 系列注解按需生效；Starter 的主要作用是聚合常用依赖，并不是自动配置生效所要求的固定包名。