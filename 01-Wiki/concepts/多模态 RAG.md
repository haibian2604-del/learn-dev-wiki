---
type: concept
domain: tech
tags: [rag, multimodal-rag]
created: 2026-08-19
updated: 2026-08-19
sources: ["[[01-Wiki/summaries/10.1 多模态 RAG 概述与场景分析]]"]
status: seedling
---

# 多模态 RAG（Multi-modal RAG）

> 让 RAG 系统同时理解和检索文本、图片、表格、图表等多种模态信息，并基于多模态上下文生成准确回答。

## 定义
在经典 RAG（单文本模态）基础上，把输入与检索扩展到图像、表格、图表、公式等非文本模态，生成阶段也由支持视觉输入的模型（GPT-4V 等）参与。

## 机制/原理
- **三层面扩展**：
  - 数据层：接受图片/表格/图表/公式，每种模态需专门解析（图片不能直接塞文本 embedding）。
  - 检索层：跨模态融合——文本↔图片对齐、表格结构化、图表语义化；判断问题需哪种模态。
  - 生成层：用多模态模型"看到"图片，或将图转文本描述后给纯文本模型。
- **跨模态语义对齐**：用 CLIP 把文本与图片映射到同一共享嵌入空间，使语义相近者向量距离近；LlamaIndex 用 CLIPImageEmbedding + VectorStoreIndex 统一索引文本与图片 Node。
- **图片理解**：GPT-4V/Claude 3.5/Gemini 1.5 视觉理解；成本骤降（单图 ~0.01-0.03 美元）。

## 例子
- 技术文档助手：用户问"认证流程"→ 找到时序图 + 文字说明一并交给 GPT-4V。
- 区域感知多模态 Node：每个图片/表格/图表独立 MultiModalNode，metadata 记录页码/坐标/上下文，检索可单独匹配或取更大上下文。

## 边界与常见误区
- 范围边界：覆盖文本/图片/表格/图表/混合 PDF；暂不含视频/音频/3D/DICOM/实时摄像头。
- 挑战：跨模态对齐、图片理解准确性（低分辨率/密集表格/计数/空间推理易错）、成本（缓存一切、智能路由）、检索粒度。
- 图片存储独立化：原图存对象存储（MinIO/S3），库只存 URL/引用 ID。

## 相关概念
- [[01-Wiki/concepts/RAG]]（模态扩展分支）、[[01-Wiki/concepts/嵌入模型]]（CLIP 图文对齐嵌入）
- 实体：[[01-Wiki/entities/LlamaIndex]]（MultiModalNode/ImageDocument/ImageRetriever 原生支持）
