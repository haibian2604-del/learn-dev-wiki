---
type: concept
domain: tech
tags: [agent, llm]
created: 2026-08-27
updated: 2026-08-27
sources: ["[[01-Wiki/summaries/Agent 训练环境工程：从仿真沙箱到数据回流闭环]]"]
status: growing
---

# Agent 训练环境（Agent Training Environment）

## 定义

算法决定"怎样更新参数"，训练环境决定"模型能从什么经验里学习"。训练环境不是容器启动器，而是**任务策略、环境契约、沙箱生命周期、隔离 verifier、评估门禁和数据回流组成的闭环**（在线执行流 + 离线学习流双向）。

## 四个平面

任务与数据策略（Task Registry/Manifest/Sampling Policy）→ 环境与沙箱（Environment Descriptor/Artifact Digest/Lifecycle）→ Rollout 与验证（Action Trace/Isolated Verifier/Reward Contract）→ 评估与回流（Eval Gate/Curation Policy/Versioned Dataset）。

## 核心设计

- **环境契约**：任务差异拆层（协议→Contract；依赖→Base Image；数据→CAS Payload；初始状态→Reset Recipe；验证→独立 Verifier；安全→Policy）。`environment_class_id`（缓存/容量）+ `episode_id`（幂等/回放）。不每题建镜像
- **沙箱四硬规则**：Ready≠Pod Running（口径=首条受控命令成功）；**reset 不暴露给 Agent**；**Verifier 与 Agent 隔离**（hidden tests/Reward 代码不入 Agent 文件系统）；**用完销毁不回池复用**
- **数据策略**：任务池四类（训练/开发评估/冻结回归/**Blind Final** 防长期过拟合评测）；Sampling Policy 动态更新（成功率 30-70% 任务最有学习价值）；**故障注入显式版本化**（faultPolicy 而非 random()）
- **Verifier 多层信号**：Outcome/Process/Safety（硬门禁不参与加权抵消）/Efficiency/Stability；**Reward 提交幂等**（episode_id+verifier_digest 唯一标识）
- **数据回流保证据**：可回放 episode 记录（model_digest/task_digest/verifier_digest/actions/observations/reward 分层）；管道处理背压/部分失败补传/去重/脱敏/高基数；**失败不一定是模型失败**——环境故障轨迹进事故集不给负 Reward
- **容量与调度**：分阶段测量到 TTFI；Warm Pool 只按头部环境类别（有限 class+公共层+注入 payload+fresh COW）；K8s 只管慢状态（每步 action 走沙箱数据面）；GPU 角色拆开

## 安全边界

跨 episode 污染（fresh COW/用完销毁/污染探针）、Verifier 泄漏（独立镜像身份）、凭据泄漏（tmpfs/入库前脱敏）、网络越权（default-deny egress）、资源耗尽（cgroup/timeout）、Reward hacking（外部 verifier/hidden final/幂等）。Runtime 按风险选择：受限容器→gVisor→Kata/MicroVM。

## 落地路线

P0 本地合同闭环（20 任务 4 类差异证明可重建/可归因/可清理）→ P1 任务策略与评估门禁（四类 manifest/分层指标/环境失败不进 Reward）→ P2 Kubernetes 生命周期对照（provider 可替换）→ P3 Artifact 与训练回流（cache/lazy pull/P2P + 版本化 trajectory store）。**勿第一天全上，变量太多无法归因收益**。

## 组件选型（按职责拼装）

OpenEnv（交互协议）/ Verifiers（task/rubric authoring）/ OpenSandbox（沙箱执行 API）/ Kubernetes Agent Sandbox（沙箱生命周期）/ Nydus+Dragonfly（Artifact）/ Kueue+Volcano（GPU admission）。

## 关联

- 上游：[[01-Wiki/concepts/Agent 强化学习]]、[[01-Wiki/concepts/Agent 训练数据]]、[[01-Wiki/concepts/Agent 评估]]
- 实战来源：[[01-Wiki/summaries/Agent 训练环境工程：从仿真沙箱到数据回流闭环]]
