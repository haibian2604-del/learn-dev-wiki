---
type: concept
domain: tech
tags: [kubernetes, container, devops]
created: 2026-07-31
updated: 2026-07-31
sources: ["[[01-Wiki/summaries/Kubernetes超详细教程]]", "[[01-Wiki/summaries/Docker与K8s对比]]"]
status: growing
---

# Kubernetes（k8s）

> 容器编排平台：管理大规模容器化应用的部署、伸缩、自愈与服务发现。"生产级容器操作系统"。

## 定义

K8s 解决 Docker 解决不了的问题：**集群层面**的容器管理——成百上千容器怎么调度、故障怎么自愈、流量怎么分发、容量怎么伸缩。

## 机制/原理

### 架构

- **Master 控制面**：API Server（唯一入口）、Scheduler（调度）、Controller Manager（控制器循环）、etcd（分布式存储）
- **Node 工作节点**：Kubelet（管理 Pod）、Kube-Proxy（网络代理）、容器运行时（containerd/docker）

### 核心对象

| 对象 | 作用 |
|------|------|
| Pod | 调度最小单位（1+ 容器，共享网络/存储）；有生命周期与探针 |
| Deployment | 无状态应用：声明期望状态，控制器不断收敛（滚动更新/回滚/副本管理） |
| StatefulSet | 有状态应用：稳定网络标识 + 持久化存储 |
| Service | 四层负载均衡 + 服务发现（ClusterIP/NodePort/LoadBalancer） |
| Ingress | 七层路由（域名/路径 → Service） |
| ConfigMap/Secret | 配置与密钥分离注入 |

### 关键机制

- **控制器模式**：声明式 API——用户声明"要 3 个副本"，控制器循环保证现实趋近期望
- **Pod 探针**：liveness（存活）/ readiness（就绪）/ startup（启动），面试高频
- **声明式 vs 命令式**：kubectl apply -f（声明）优于 kubectl run（命令式）

## 边界与常见误区

- K8s ≠ 容器运行时：docker/containerd 是它的底层执行者
- 单机/小规模用 K8s 是过度设计：Docker Compose 足够（→ [[01-Wiki/summaries/Docker与K8s对比]]）
- 有状态应用（数据库）在 K8s 上运维复杂，常建议数据库外置

## 相关概念

- [[01-Wiki/concepts/Docker]]（运行时基础）
- [[01-Wiki/summaries/Kubernetes超详细教程]]（搭建与实战）
