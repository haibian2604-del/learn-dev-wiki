---
type: summary
domain: tech
tags: [high-availability, system-design, interview]
created: 2026-07-31
updated: 2026-07-31
sources: ["[[00-Raw/system-design/JavaGuide-高可用系统设计面试题]]"]
status: growing
---

# JavaGuide · 2026 高可用系统设计面试题

> 高可用系统设计全维度面试题：SLA、可用性指标、单点故障、RTO/RPO、限流降级熔断、超时重试、接口幂等、容灾。

## 核心观点

- **可用性度量**：SLA（如 99.9% 年停机 <8.76h）；可用性 = 正常运行时间/总时间
- **容灾指标**：RTO（恢复时间目标）/ RPO（恢复点目标，可容忍数据丢失量）；两地三中心、同城双活/异地多活
- **单点故障消除**：负载均衡（Nginx/LVS）、主从/集群、分布式一致性（→ 引入一致性协议）
- **限流降级熔断**：限流保护自己（→ [[01-Wiki/concepts/限流]]）；降级保核心链路（兜底方案）；熔断防雪崩（Hystrix/Sentinel 状态机：关闭→打开→半开）
- **超时重试**：合理超时（读短写长）、重试策略（退避/幂等前提）、避免重试风暴（限制重试次数+抖动）
- **接口幂等**：唯一请求号 + 幂等表/分布式锁；天然幂等（GET）/ 需处理（POST 下单、支付回调）
- **防雪崩**：缓存预热/降级、线程池隔离、队列削峰

## 亮点与不足

- 亮点：RTO/RPO、SLA 数字量化讲透；熔断状态机（closed/open/half-open）是面试常考点
- 亮点：幂等 + 重试 + 超时的"铁三角"关系（重试的前提是幂等）讲清楚
- 不足：分布式事务/一致性协议仅提及，未展开（JavaGuide 分布式章节另有专题）

## 相关概念

→ [[01-Wiki/concepts/限流]]、[[01-Wiki/summaries/JavaGuide 服务限流详解]]
