# Raw Sources（原始资料）

> **内容不可变（immutable）**：源文件正文一经入库即冻结，LLM 绝不修改。这是知识库的 source of truth。
> **唯一例外**：允许在 `00-Raw/` **内部移动文件**（分类整理），移动 ≠ 修改内容。

## 目录结构（按知识点分文件夹）

源文件**按知识点分类**存放在子文件夹中。不同知识点放入不同文件夹；出现全新知识点时**新建文件夹**。

```
00-Raw/
├── inbox/               # 暂存区：新源先放这里，等待 LLM ingest
├── agent-basics/        # Agent 入门与架构
├── agent-engineering/   # Agent 工程化（Infra/评估/Coding/多模态/自进化/异步）
├── agent-training/      # Agent 训练与评测（SFT/RL/数据/部署）
├── agent-frameworks/    # Agent 框架全景与选型（含 LangChain）
├── agent-interview/     # Agent 面试题库与考点（跨子域）
├── context-engineering/ # 上下文工程
├── harness/             # Harness Engineering
├── loop-engineering/    # Loop Engineering
├── mcp/                 # MCP 协议与 Server 开发
├── agent-skills/        # Agent Skills 与 Skill 编写
├── rag/                 # RAG 与检索（含 GraphRAG/多模态/查询路由）
├── vector-db/           # 向量数据库选型与索引
├── llamaindex/          # LlamaIndex 框架
├── java-backend/        # Java 后端（Spring/MyBatis/IoC/AOP/事务/设计模式）
├── system-design/       # 系统设计与高可用（限流/容灾/幂等）
├── devops/              # 容器与运维（Docker/K8s）
├── coding-habits/       # 工程素养与编码习惯
├── academic/            # 学术论文（PDF 等）
└── README.md            # 本文件
```

> 完整知识点清单与归档规则见 [[02-Rules/分类体系]] §9。

## 用法

1. 把新资料（文章、论文、PDF、网页剪藏 markdown、笔记）放入 `inbox/`
2. 对 LLM 说"处理这个"（或"ingest"），LLM 会：
   - 读取并讨论要点
   - 在 `01-Wiki/summaries/` 写摘要页（`sources:` 链回本文件的**完整路径**），更新 entities/concepts 页和 `index.md`
   - 在 `01-Wiki/log.md` 记日志
   - 判定知识点，把文件从 `inbox/` 归档到对应的**知识点文件夹**（无匹配则新建）
   - 同步更新所有指向该源的 `[[00-Raw/...]]` 链接

## 建议

- 用 **Obsidian Web Clipper** 浏览器插件把网页转成 markdown，快速获取源
- 图片类附件建议放 `00-Raw/assets/`（设置中指定 Attachment folder path），本地化保存
- 知识点拿不准时，宁可先放 `inbox/` 并在 ingest 时一起判定，不要随手塞进不相关的夹
