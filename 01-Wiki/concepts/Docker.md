---
type: concept
domain: tech
tags: [docker, container, devops]
created: 2026-07-31
updated: 2026-07-31
sources: ["[[01-Wiki/summaries/Docker超详细教程]]", "[[01-Wiki/summaries/Docker与K8s对比]]"]
status: growing
---

# Docker

> 轻量级容器技术：把应用与其依赖打包成镜像，一次构建、到处运行。解决环境一致性问题的 DevOps 基石。

## 定义

Docker = 打包（镜像）+ 运行（容器）+ 分发（仓库）。核心价值：应用与依赖（库/框架/配置）打包进镜像，在任何环境获得一致运行行为——消灭"在我机器上是好的"。

## 机制/原理

- **镜像 vs 容器**：镜像是只读模板（分层构建，层可复用）；容器是镜像的运行实例（可写层 + 进程）
- **虚拟化方式**：VM 虚拟化硬件（隔离完整但重）；Docker 共享宿主机内核（进程级隔离，秒级启动）——**轻但不是完全隔离**
- **Run 流程**：本地无镜像 → 仓库拉取 → 解压分层 → 创建可写容器层 → 启动进程
- **核心组件**：Dockerfile（构建指令）、镜像仓库（Docker Hub）、Volume（数据持久化）、Network（bridge/host/none）

## 常用命令速查

- 镜像：`docker images` / `docker pull` / `docker rmi`
- 容器：`docker run -d -p 8080:80` / `docker ps` / `docker exec -it` / `docker logs`
- 构建编排：`docker build` / `docker-compose up`

## 边界与常见误区

- Docker 解决"单机容器运行"；**集群编排是 K8s 的职责**（→ [[01-Wiki/concepts/Kubernetes]]）
- 容器共享宿主机内核：隔离性弱于 VM，安全性敏感场景需额外防护
- 生产级优化（多阶段构建、镜像瘦身、安全扫描）在入门教程中常缺失，需专项补充

## 相关概念

- [[01-Wiki/concepts/Kubernetes]]（编排层）、[[01-Wiki/summaries/Docker与K8s对比]]
- [[01-Wiki/summaries/Docker超详细教程]]（全流程实操）
