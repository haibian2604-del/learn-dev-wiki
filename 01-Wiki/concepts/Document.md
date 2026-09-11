---
type: concept
domain: tech
tags: [langchain, rag, document]
created: 2026-07-31
updated: 2026-07-31
sources: ["[[01-Wiki/summaries/第 19 章 RAG 检索增强生成]]"]
status: seedling
---

# Document（LangChain 文档对象）

> LangChain 中统一的文档数据结构：所有数据源（TXT/PDF/Word/Markdown/JSON/CSV）经加载器转换后的标准形态。

## 定义

`Document` 是 LangChain 在 RAG 里的基础数据结构，通常含两个核心字段：

- **`page_content`**：正文内容——**真正参与向量化的部分**
- **`metadata`**：附加信息（source 路径、页码、标题、作者、日期、分类）——用于**来源展示、过滤条件、结果解释**，不参与向量化

部分实现/版本还有可选 `id` 字段用于标识文档或片段。

## 机制/原理

统一的 `Document` 让下游组件（分割器、向量库、检索器）**不需要关心内容最初来自 PDF 还是 CSV**：

```
原始文件 → Loader → List[Document] → TextSplitter → VectorStore
```

- 文档加载器两个统一接口：`load()`（一次性全量）、`lazy_load()`（按需流式，适合大文件）
- 加载器选择原则：先按文件类型选（TextLoader/PyPDFLoader/Docx2txtLoader/JSONLoader/CSVLoader 等），再按解析精度与成本选（是否需要标题层级、表格信息，复杂场景引入 OCR/版面分析）

## 边界与常见误区

- "能加载"≠"适合直接检索"：加载后通常仍需切块再向量化
- PDF 是最麻烦的解析类型：读得出来 ≠ 结构适合 RAG，常需清洗与更强解析工具
- metadata 与 page_content 的分工要分清：检索时只向量化正文，metadata 用于过滤与展示

## 相关概念

- [[01-Wiki/concepts/RAG]]、[[01-Wiki/concepts/文本分块]]
- [[01-Wiki/entities/LangChain]]（Document 的加载器体系）
