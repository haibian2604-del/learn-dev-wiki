---
type: summary
domain: tech
tags: [agent, llm]
created: 2026-08-27
updated: 2026-08-27
sources: ["[[00-Raw/agent-training/Agent 训练环境工程：从仿真沙箱到数据回流闭环]]"]
status: mature
---

# Agent 训练环境工程：从仿真沙箱到数据回流闭环（learn-agent-training 07）

> 训练沙箱、评估门禁与轨迹回流的完整工程闭环——算法决定"怎样更新参数"，训练环境决定"模型能从什么经验里学习"。训练代码往往不是最先卡住的地方，沙箱太慢/状态不可重置/hidden test 泄露/失败轨迹不回流才是。

## 全链路：四个平面

| 平面 | 解决的问题 | 事实源 |
|---|---|---|
| 任务与数据策略 | 抽什么任务、难度、seed、数据版本 | Task Registry、Dataset Manifest、Sampling Policy |
| 环境与沙箱 | 隔离、可重置、可执行的 episode | Environment Descriptor、Artifact Digest、Sandbox Lifecycle |
| Rollout 与验证 | 模型做了什么、结果是否正确、Reward 是否可信 | Action Trace、Isolated Verifier、Reward Contract |
| 评估与回流 | 哪些轨迹进 SFT/RL、回归集、事故集或丢弃 | Eval Gate、Curation Policy、Versioned Dataset |

两个方向相反的流：**在线执行流**（任务策略→环境解析→沙箱 episode→rollout→verifier）与**离线学习流**（轨迹+reward→评估门禁→数据筛选→版本化数据集→新 checkpoint）。只有在线流只能产生日志；只有离线数据模型学到的是不可复现甚至被污染的经验。

## 1. 用环境契约描述 episode，不每题建镜像

任务差异拆层：交互协议→Environment Contract；运行依赖→Base Image+Dependency Lock；任务数据→Content-addressed Payload；初始状态→Reset Recipe/Snapshot；验证逻辑→独立 Verifier；安全策略→Policy+Runtime Class。只有语言运行时/系统依赖/隔离等级/工具契约变化才值得新环境类别。

两个稳定标识：`environment_class_id`（缓存/Warm Pool/容量规划）与 `episode_id`（幂等/追踪/Reward 提交/结果回放）。关键：同一 descriptor 和 seed 能重建相同初始可观察状态。

## 2. 仿真交互沙箱：真实性 vs 可控性

分层：确定性 Mock（快便宜可复现，覆盖不了探索路径和真实故障）/ 状态机模拟器（可注入边界状态和长轨迹）/ 容器化真实工具（代码/数据库，结果可测试验证，成本高）/ 浏览器/GUI 环境（接近真实，非确定性强）/ 受控真实服务（上线前 shadow/canary，必须限副作用）。

**四条硬规则**：
1. **Ready ≠ Pod Running**：更可信口径是第一条受控任务命令成功
2. **reset 不能暴露给被训练 Agent**（编排面，否则 Agent 可规避失败/试探答案）
3. **Verifier 必须和 Agent 隔离**（hidden tests/solution/Reward 代码不能挂进 Agent 文件系统）
4. **Episode 用完销毁不回池复用**（Warm Pool 预热干净环境类别，不是擦一擦再给下一个任务）；无法证明进程/文件/网络/secret/缓存/verifier 状态已清空就不复用

## 3. 数据策略：去哪里采经验

**任务池四类**：训练池（可采样变异生成 hard case）/ 开发评估池（频繁调参可反复看失败）/ 冻结回归池（checkpoint gate，不随训练更新）/ **Blind Final**（只在关键里程碑运行，防长期过拟合评测）。四类需独立 manifest/权限/provenance；开发池失败样本进训练池后原样本不能冒充独立评测证据。

**Sampling Policy 动态更新**：均匀抽样浪费 rollout（稳定通过的简单任务反复跑）。综合：任务难度+历史成功率、工具/语言/业务域覆盖、最近失败原因+不确定性、稀缺场景配额、冷启动成本、与训练/开发/blind 集相似度。成功率近 100% 降采样；30%-70% 不稳定任务最有学习价值；始终 0% 先判断是模型不会/环境坏/verifier 错。

**故障注入也是数据策略**：把故障变成显式可版本化策略（faultPolicy：timeoutRate/malformedResponseRate），而非临时 random()——才能区分"模型在相同故障下变强了"和"这次运气好"。

## 4. Verifier 决定 Reward 是否值得学习

多层信号：Outcome（最终目标完成，主 Reward/Pass@k）/ Process（工具选择参数步骤合理，过程监督/错误归因）/ Safety（越权泄密危险动作，**硬门禁不参与加权抵消**）/ Efficiency（步骤/Token/延迟/成本，约束无效探索）/ Stability（不同 seed/措辞/故障稳定，防一次成功掩盖高方差）。

**不要揉成一个总分丢明细**（完成率高但越权的 checkpoint 不应被低延迟"平均掉"）。门禁顺序：安全权限硬门禁 → 完成率/Pass@1 → 多 seed 稳定性与错误恢复 → 效率成本预算 → 通用能力与分布外回归 → 才允许进下一轮或灰度。

**Reward 提交必须幂等**：`episode_id + verifier_digest` 唯一标识一次评分，重试/重复投递/verifier 重启不能计分两次。

## 5. 数据回流：保存"证据"不只 Reward

可回放 episode 记录：episode_id/model_digest/environment_class_id/task_digest/dataset_manifest/verifier_digest/policy_digest/seed/terminal_reason/actions/observations/reward{outcome,safety,efficiency}/timestamps。

管道：Sandbox/Rollout Worker → 本地缓冲批量上传 → Event Bus/Ingestion API → 不可变轨迹与 Artifact 存储 → 在线质量成本指标 → 离线校验/去重/脱敏/失败归因 → Versioned Dataset/Replay Buffer/Regression Set → SFT 或 RL 更新。要处理：背压（存储变慢 rollout 不能无限占沙箱 GPU）、部分失败（trace 上传失败可补传）、去重（重试消息不生成多份样本）、Schema 演进、隐私脱敏、高基数治理。

**不同轨迹流向不同目的地**：高质量成功→SFT 候选；成功但冗余→效率优化集/偏好对；可恢复失败→RL/错误恢复专项；环境/基础设施失败→平台回归与事故集（**不给模型负 Reward**）；安全违规→安全训练红队回归；Verifier 不确定→人工复核；与评测集高度相似→隔离丢弃。

**关键判断：失败不一定是模型失败**（DNS/镜像拉取/工具超时/沙箱污染/任务描述错/verifier bug 都可能 0 Reward）。没有 producer-to-impact 因果链就把失败轨迹喂 RL，会训练模型适应平台故障而非任务本身。

## 6. 容量、Artifact 与调度

分阶段测量（accepted→queued→scheduled→image resolved→bytes pulled→runtime created→network ready→task injected→**first command succeeded (TTFI)**→episode finished→verifier finished→cleanup confirmed），只报"Pod 启动耗时"掩盖真瓶颈。

- **Warm Pool 只按头部环境类别建立**：有限 environment class + 公共 base/dependency layer + 领取后注入 task payload + fresh COW 可写层 + episode 结束销毁（每题独有镜像会退化成"每道题常驻一份环境"）
- **Artifact 平面与任务数据解耦**：基础镜像/dependency lock/task payload/dataset shard/verifier/policy 分别按 digest 保存；OCI/CAS、lazy pull、chunk 去重、P2P 减少重复搬运
- **Kubernetes 只管慢状态**：quota/admission/placement/gang/topology；每步 action/observation/trace 走沙箱数据面（全写 K8s API 会放大成 API Server 和 etcd 压力）；GPU 角色拆开（rollout inference 独立模型服务/环境内 GPU simulator 按任务申请/trainer update 走训练队列）

## 7. 安全边界：直接影响训练数据可信度

风险矩阵：跨 episode 污染（fresh COW/用完销毁/污染探针）、Verifier 泄漏（独立镜像/身份/文件系统）、凭据泄漏（短期身份/tmpfs/入库前脱敏）、网络越权（default-deny egress/禁用默认 SA token）、资源耗尽（cgroup/pids/存储配额/timeout）、Reward hacking（外部 verifier/hidden final/幂等 Reward）。

Runtime 按风险选择：可信短任务受限容器；不可信代码 gVisor；高风险多租户 Kata/MicroVM。隔离增强有兼容性/启动/运维成本，必须经目标 workload 验证。

## 8. 务实落地路线（勿第一天全上）

- **P0 本地合同闭环**：20 个任务 4 类环境差异，跑通 descriptor/reset/step/trace/verifier/Reward/destroy + 污染测试 + 证明同 descriptor/seed 可重建
- **P1 任务策略与评估门禁**：分离四类 manifest、难度/失败原因/覆盖度驱动 sampler、分层指标、环境失败不进模型 Reward
- **P2 Kubernetes 生命周期对照**：任务和 descriptor 不变只换 provider，测 cold/cached cold/warm claim/payload 注入、cancel/timeout/restart/orphan cleanup
- **P3 Artifact 与训练回流**：先拆 base/lock/payload/verifier 再逐项引入 cache/lazy pull/P2P、版本化 trajectory store/curation/replay buffer、最后接 trainer 测重启/重复 Reward/轨迹丢失/背压

## 9. 组件选型（按职责拼装，不按品牌站队）

OpenEnv（环境交互协议）/ Verifiers（任务与 verifier authoring）/ OpenSandbox（沙箱执行 API）/ Kubernetes Agent Sandbox（沙箱生命周期）/ OCI-CAS、Nydus、Dragonfly（Artifact 优化）/ Kueue、Volcano（批任务 GPU admission）。第一期选"最少组件也能证明合同正确"的组合，只有 benchmark 证明启动/分发/队列/隔离是瓶颈才增加系统。

## 关联

- 概念：[[01-Wiki/concepts/Agent 训练环境]]、[[01-Wiki/concepts/Agent 评估]]、[[01-Wiki/concepts/Agent 强化学习]]
- 系列：[[01-Wiki/entities/zero2Agent]]（learn-agent-training）
