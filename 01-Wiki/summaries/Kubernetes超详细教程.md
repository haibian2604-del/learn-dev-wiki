---
type: summary
domain: tech
tags: [kubernetes, container, devops]
created: 2026-07-31
updated: 2026-07-31
sources: ["[[00-Raw/devops/Kubernetes超详细教程-从入门到实战]]"]
status: growing
---

# Kubernetes 超详细教程（从入门到实战）

> K8s 全概念教程：概述、设计架构、minikube 安装、裸机集群搭建、Pod 深入理解、常用资源（Deployment/Service/Ingress）、面试高频点。

## 核心观点

- **k8s 是什么**：容器编排平台，管理大规模容器化应用（部署/伸缩/自愈/服务发现）——"生产级容器操作系统"（→ [[01-Wiki/concepts/Kubernetes]]）
- **项目部署演进**：传统物理机 → 虚拟机 → 容器化 → 容器编排（k8s）；Docker 解决"单机怎么跑"，k8s 解决"集群怎么管"
- **设计架构**：Master（API Server / Scheduler / Controller Manager / etcd）+ Node（Kubelet / Kube-Proxy / 容器运行时）
- **Pod 是调度最小单位**：一个或多个容器的组合，共享网络命名空间与存储卷；**Pod 生命周期与探针（liveness/readiness）是面试高频**
- **核心资源对象**：Deployment（无状态应用，滚动更新/回滚）、StatefulSet（有状态）、Service（负载均衡+服务发现）、Ingress（七层路由）、ConfigMap/Secret（配置）
- **搭建方式**：minikube（本地单机）vs 裸机集群（kubeadm 初始化 master/worker 节点）

## 亮点与不足

- 亮点：10w+ 长文，Pod 深入理解 + 面试高频点（探针、调度、控制器模式）覆盖全
- 亮点：从本地 minikube 到裸机集群的完整搭建流程
- 不足：实操命令为主，原理深度（调度器算法、etcd 一致性、CNI 网络插件原理）偏浅

## 相关概念

→ [[01-Wiki/concepts/Kubernetes]]、[[01-Wiki/concepts/Docker]]（容器运行时基础）、[[01-Wiki/summaries/Docker与K8s对比]]
