---
type: summary
domain: tech
tags: [rate-limit, high-availability, java]
created: 2026-07-31
updated: 2026-07-31
sources: ["[[00-Raw/system-design/JavaGuide-服务限流详解]]"]
status: growing
---

# JavaGuide · 服务限流详解

> 限流算法与实现全解析：固定窗口、滑动窗口、令牌桶、漏桶，以及单机（Guava RateLimiter/Bucket4j）与分布式（Sentinel/Redis Lua/Redisson）落地。

## 核心观点

- **限流目的**：保护系统不被突发流量打垮，与熔断、降级共同构成高可用三件套（→ [[01-Wiki/summaries/JavaGuide 高可用系统设计面试题]]）
- **四大算法对比**（→ [[01-Wiki/concepts/限流]]）：
  - 固定窗口：实现简单，但临界突刺（窗口边界双倍流量）
  - 滑动窗口：按粒度划分小窗口，缓解临界问题，精度取决于粒度
  - 令牌桶：匀速生成令牌、允许一定突发，适合一般 API 限流
  - 漏桶：恒定速率流出（强制平滑），适合保护下游（如数据库）
- **单机实现**：Guava RateLimiter（令牌桶）、Bucket4j（支持滑动窗口）
- **分布式限流**：Redis + Lua 原子计数（固定窗口/滑动窗口）、Sentinel（规则配置+流控效果：快速失败/Warm Up/排队等待）、Redisson RateLimiter
- **算法选型**：追求突发能力选令牌桶；要求平滑恒定选漏桶；简单场景固定/滑动窗口足够

## 亮点与不足

- 亮点：算法+落地工具全链路覆盖；临界突刺问题（固定窗口 0:00-1:00 与 1:00-2:00 边界双倍放行）是经典考点
- 亮点：Redis Lua 原子性（避免竞态）与 Sentinel 流控效果讲清楚
- 不足：未深入限流与熔断/降级的协同编排细节（Sentinel 集群流控、热点参数限流）

## 相关概念

→ [[01-Wiki/concepts/限流]]、[[01-Wiki/summaries/JavaGuide 高可用系统设计面试题]]
