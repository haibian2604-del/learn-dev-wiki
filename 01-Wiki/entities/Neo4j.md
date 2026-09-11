---
type: entity
domain: tech
tags: [graphrag]
created: 2026-08-01
updated: 2026-08-01
sources: ["[[01-Wiki/summaries/图数据建模与准备]]", "[[01-Wiki/summaries/图RAG架构设计]]"]
status: seedling
---

# Neo4j

> 原生图数据库，用作 [[01-Wiki/concepts/GraphRAG]] 的知识图谱存储与图遍历后端，查询语言为 Cypher。

## 是什么

Neo4j 是属性图（Property Graph）数据库：节点带标签与属性，关系（边）可带类型与属性。在图 RAG 系统中承担知识图谱的落地存储与多跳查询。

## 关键事实

- **部署**：Docker Compose 一键启动（`docker-compose up -d`），Web 界面 `http://localhost:7474`，Bolt 协议端口 7687（→ [[01-Wiki/summaries/图RAG架构设计]]）
- **查询语言 Cypher**：`MATCH (r:Recipe)-[:REQUIRES]->(i:Ingredient) WHERE i.name CONTAINS "虾" RETURN ...`；支持全文索引 `db.index.fulltext.queryNodes`
- **数据导入**：`nodes.csv` + `relationships.csv` 经 `neo4j_import.cypher` 脚本导入（→ [[01-Wiki/summaries/图数据建模与准备]]）
- **连接**：Python 用 `neo4j.GraphDatabase.driver(uri, auth=...)`；`.env` 配置 `NEO4J_URI/NEO4J_USER/NEO4J_PASSWORD`
- **图检索角色**：在 GraphRAG 中负责实体定位、邻域扩展、路径发现、约束过滤（限定关系类型/跳数/时间/置信度）

## 时间线（本项目）

- 2026-08-01：作为图 RAG 系统（all-in-rag 第 9 章）的图谱存储引入，承载菜谱/食材/步骤节点与四类关系

## 相关

- 相关实体：[[01-Wiki/entities/Milvus]]（同系统的向量索引后端）
- 相关概念：[[01-Wiki/concepts/知识图谱]]、[[01-Wiki/concepts/GraphRAG]]、[[01-Wiki/concepts/实体关系抽取]]
