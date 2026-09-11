---
type: summary
domain: tech
tags: [docker, container, devops]
created: 2026-07-31
updated: 2026-07-31
sources: ["[[00-Raw/devops/Docker超详细教程-CSDN笔记]]"]
status: growing
---

# Docker 超详细教程（CSDN 笔记）

> B 站狂神 Docker 学习笔记整理：Docker 概述、安装、常用命令、镜像/容器原理、Dockerfile、数据卷、网络、Docker Compose 等全流程。

## 核心观点

- **为什么需要 Docker**：环境一致性问题（"在我机器上是好的"）——一次构建，到处运行；DevOps 利器（→ [[01-Wiki/concepts/Docker]]）
- **虚拟机 vs 容器**：VM 虚拟化硬件（重、慢、隔离完整）；容器共享宿主机内核（轻、秒级启动、进程级隔离）
- **基本组成**：镜像（只读模板）→ 容器（镜像的运行实例）→ 仓库（镜像分发中心，Docker Hub）
- **Run 流程**：Docker run 时本地无镜像 → 从仓库拉取 → 解压为只读层 + 可写容器层 → 启动进程
- **核心命令**：镜像（images/pull/rmi）、容器（run/ps/exec/rm/stop）、构建（build）、编排（compose up）
- **Dockerfile**：FROM/RUN/COPY/CMD/EXPOSE 等指令定义镜像构建过程
- **数据卷与网络**：volume 持久化数据；bridge/host/none 网络模式

## 亮点与不足

- 亮点：学习笔记风格、命令带注释，适合速查；虚拟机/容器对比直观
- 亮点：DevOps 视角（开发环境一致性、CI/CD 基础）
- 不足：未深入镜像分层原理、多阶段构建、Dockerfile 最佳实践（生产级优化缺失）

## 相关概念

→ [[01-Wiki/concepts/Docker]]、[[01-Wiki/summaries/Docker与K8s对比]]、[[01-Wiki/concepts/Kubernetes]]
