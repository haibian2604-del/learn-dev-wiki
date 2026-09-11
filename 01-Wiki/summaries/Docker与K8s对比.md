---
type: summary
domain: tech
tags: [docker, kubernetes, container]
created: 2026-07-31
updated: 2026-07-31
sources: ["[[00-Raw/devops/Docker与K8s对比-阿里云]]"]
status: growing
---

# Docker 与 K8s 对比（阿里云）

> 阿里云开发者社区文章：Docker（容器打包）与 Kubernetes（集群编排）的核心定位差异、适用场景与基础命令，为技术选型提供决策依据。

## 核心观点

- **定位差异**：Docker 是**容器技术**（打包/交付/运行单个应用，保证环境一致）；K8s 是**容器编排工具**（分布式环境管理 Docker 容器，提供高可用/伸缩/自愈）
- **关系**：互补而非竞争——Docker 解决"怎么把应用打包跑起来"，K8s 解决"成百上千个容器怎么调度管理"
- **选型建议**：
  - 单机/小规模/开发环境 → Docker 足够
  - 生产环境/大规模/需要高可用与自动伸缩 → Docker + K8s
- **命令对比**：Docker（run/ps/build/compose）vs kubectl（get pods/deploy/scale/rollout）
- **常见组合**：Docker Compose（单机多容器编排，轻量）→ K8s（生产级集群编排）

## 亮点与不足

- 亮点：定位与场景对比清晰，选型决策直给
- 亮点：两者命令对照便于理解各自职责
- 不足：篇幅短，未覆盖 K8s 的 Service/Ingress/存储等细节（详见 K8s 教程摘要）

## 相关概念

→ [[01-Wiki/concepts/Docker]]、[[01-Wiki/concepts/Kubernetes]]、[[01-Wiki/summaries/Docker超详细教程]]、[[01-Wiki/summaries/Kubernetes超详细教程]]
