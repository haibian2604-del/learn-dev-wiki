---
type: concept
domain: tech
tags: [agent, llm]
created: 2026-08-27
updated: 2026-08-27
sources: ["[[01-Wiki/summaries/从 SFT 到部署：Agent 模型上线全流程]]"]
status: growing
---

# Agent 模型部署（Agent Model Deployment）

## 定义

从"训练好的模型权重"到"线上稳定运行的 Agent 服务"的工程全流程：模型选择、压缩、推理优化、服务架构、工具编排、安全层、灰度发布与监控。部署阶段踩的坑往往比训练更多。

## 全流程七环节

1. **模型选择**：不一定是最后一个 checkpoint（RL 后期可能过拟合训练分布）。五维考量（完成率/通用 benchmark/格式正确率/安全/效率）+ 策略（综合最优/安全优先/效率优先/集成路由）
2. **模型压缩**：量化（**INT8 默认**，tool call JSON 对 token 精度敏感——量化后必须跑完整 Agent 评测，格式正确率下降 >2% 警惕；INT4 GPTQ/AWQ 显存紧张；FP8 H100+）；蒸馏（Teacher 70B 生成轨迹 → Student 7B-13B SFT/RL，达 70-85% 能力）
3. **推理优化**：**端到端延迟 = 推理延迟 × 步骤数 + 工具延迟 × 步骤数**。KV Cache 优化（上下文单调递增命中率高但显存压力大）；工具调用并行化（串行 6s→并行 2s）；推理框架（vLLM 默认/TensorRT-LLM 极致性能/**SGLang 结构化生成对 tool call 友好**/Ollama 小模型）；**Agent 特殊需求：Structured Output/JSON Mode**
4. **服务架构（Agent Runtime）**：对话管理/工具调度/循环控制/错误处理/并发/日志。请求链路：Gateway → Runtime（拼上下文→推理→解析→tool_call 执行回灌/文本返回）→ 异步日志。**循环控制硬限制必设**（最大步骤 15-20、最大 token 窗口 80%、单步超时 30-60s、总超时 2-5min、重复检测）
5. **工具层**：注册（名称/schema/端点/鉴权/限流/版本）、版本管理（接口变更直接改 Agent 行为，安全升级=并行+灰度+监控+下线）、参数校验补全（类型转换/默认值/格式修复/越界/注入防护）
6. **安全层**：输入过滤（Prompt 注入/PII/频率/内容分类）、输出过滤（工具合法性与参数安全检查/内容过滤/脱敏）、操作确认（黑名单绝对拦截/需确认/白名单直接执行）
7. **灰度与监控**：内部→1%→5-10% A/B→30-50%→100%（旧模型留 1 周回滚）；P0 严格告警（成功率 <95%/格式 <98%/循环终止率 >5%/P99 超 SLA/安全拦截突变）；回滚 5 分钟内完成

## 上线前 Checklist

模型层（checkpoint 有依据/量化降 <3%/格式 >98%/安全拒绝 >95%/8K+ 通过）→ 推理层（压力测试/结构化输出/KV Cache/扩缩容）→ 服务层（Runtime/循环限制/工具注册鉴权/参数校验）→ 安全层（输入输出过滤/高危确认/安全日志）→ 发布层（灰度/监控/回滚/值班）。

## 关联

- 上游：[[01-Wiki/concepts/Agent SFT]]、[[01-Wiki/concepts/Agent 强化学习]]、[[01-Wiki/concepts/Agent 评估]]
- 生产底座：[[01-Wiki/concepts/Harness Engineering]]、[[01-Wiki/concepts/异步 Agent 与事件驱动架构]]
- 实战来源：[[01-Wiki/summaries/从 SFT 到部署：Agent 模型上线全流程]]
