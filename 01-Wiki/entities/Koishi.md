---
type: entity
domain: tech
tags: [agent]
created: 2026-08-15
updated: 2026-08-15
sources: ["[[01-Wiki/summaries/时空可组合性编程范式]]"]
status: seedling
---

# Koishi

## 是什么

构建在 Cordis 之上的开源聊天机器人应用框架（→ [[01-Wiki/entities/Cordis]]）：所有功能都以插件形式实现于 Cordis context 原语，框架本身只提供聊天机器人领域词汇。

## 关键事实

- **规模**：运行 4 年，4000+ 社区贡献插件（IM 适配器、数据库驱动、管理控制台、终端用户功能）
- **表达性**：单一原语模型支撑完整生产系统——服务端 bot 与 web console（浏览器 UI）是两个独立 Cordis 应用，证明模型既表达充分又通用
- **时间可组合性实证**：编排器从控制台禁用插件，其效应就地回收（无需重启、无需作者写 uninstall）；开发期 HMR 保存时重应用编辑的插件，保留缓存与活跃连接
- **空间可组合性实证**：生态有真实依赖拓扑——功能插件把"存储后端/消息平台适配器"声明为余效应依赖；运行时切换存储后端只重新激活受影响的依赖者，依赖不可用则保持不激活不报错
- **术语**：Koishi 用 "plugin"，论文形式化中称 "component"
- **威胁有效性**：单生态单语言（TypeScript）观测性证据，非受控对比

## 相关

- 相关概念：[[01-Wiki/concepts/时空可组合性]]、[[01-Wiki/concepts/Harness Engineering]]
- 相关实体：[[01-Wiki/entities/Cordis]]（底层元框架）
