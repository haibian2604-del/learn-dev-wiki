---
title: "架构师AI杜技术文档"
source: "https://www.weekr.net/ai/day-21.html"
author:
  - "[[架构师AI杜]]"
published: 2026-03-19
created: 2026-09-04
description: "第21天：MCP工具开发 - 架构师AI杜技术文档"
tags:
  - "clippings"
---
## 第21天：MCP工具开发

## 学习目标

本节的学习目标包括掌握MCP工具的设计原则、学会工具参数验证、学会错误处理、能够开发实用的MCP工具等方面。

## 核心内容

### 1\. MCP工具设计原则

#### 1.1 设计理念

**MCP工具设计的核心原则** ：

MCP工具设计的核心原则包括单一职责（每个工具只负责一个特定功能）、明确接口（参数和返回值定义清晰）、错误处理（完善的错误处理机制）、安全优先（考虑安全性和权限控制）、性能优化（高效执行，避免阻塞）、可测试性（易于测试和调试）、可扩展性（便于后续功能扩展）、用户友好（提供清晰的文档和错误信息）等方面。

#### 1.2 工具分类

**MCP工具分类** ：

MCP工具分类包括文件工具（文件读写、搜索、管理等）、网络工具（HTTP请求、API调用、网页抓取等）、数据工具（数据处理、转换、分析等）、计算工具（数学计算、统计分析等）、系统工具（系统信息、进程管理等）、AI工具（模型调用、文本处理等）、多媒体工具（图像处理、音频处理等）、其他工具（根据特定需求定制）等。

### 2\. 工具参数设计

#### 2.1 参数定义

**参数设计要点** ：

参数设计要点包括参数名称（清晰、语义化）、参数类型（明确的类型定义）、必填性（明确哪些参数是必填的）、默认值（为可选参数提供默认值）、描述（详细的参数说明）、验证规则（参数验证规则）等方面。

**参数类型支持** ：

参数类型支持包括基本类型（string、number、boolean、integer）、复合类型（object、array）、特殊类型（file、url、email等）等。

#### 2.2 参数验证

**参数验证方法** ：

参数验证方法包括类型验证（检查参数类型是否正确）、范围验证（检查参数值是否在有效范围内）、格式验证（检查参数格式是否符合要求）、依赖验证（检查参数之间的依赖关系）、安全验证（检查参数是否包含恶意内容）等方面。

**参数验证实现** ：

```python
from pydantic import BaseModel, Field, validator
from typing import Optional, List

class FileReadArgs(BaseModel):
    """文件读取参数"""
    file_path: str = Field(..., description="文件路径", example="/tmp/test.txt")
    encoding: Optional[str] = Field(default="utf-8", description="文件编码")
    max_size: Optional[int] = Field(default=1024 * 1024, description="最大读取大小（字节）")
    
    @validator('file_path')
    def validate_file_path(cls, v):
        """验证文件路径"""
        if not v:
            raise ValueError("文件路径不能为空")
        if len(v) > 1024:
            raise ValueError("文件路径过长")
        # 安全检查：防止路径遍历攻击
        if "../" in v or "..\\" in v:
            raise ValueError("文件路径不允许包含上级目录")
        return v
    
    @validator('encoding')
    def validate_encoding(cls, v):
        """验证编码"""
        valid_encodings = ["utf-8", "gbk", "ascii"]
        if v not in valid_encodings:
            raise ValueError(f"不支持的编码，支持的编码：{valid_encodings}")
        return v
    
    @validator('max_size')
    def validate_max_size(cls, v):
        """验证最大大小"""
        if v <= 0:
            raise ValueError("最大读取大小必须大于0")
        if v > 10 * 1024 * 1024:
            raise ValueError("最大读取大小不能超过10MB")
        return v
```

### 3\. 错误处理机制

#### 3.1 错误类型

**MCP工具常见错误** ：

MCP工具常见错误包括参数错误（参数格式不正确或缺少必填参数）、权限错误（没有权限执行操作）、资源错误（资源不存在或不可访问）、执行错误（执行过程中出现异常）、超时错误（操作超时）、安全错误（安全检查失败）、系统错误（系统级别的错误）等。

#### 3.2 错误处理策略

**错误处理的最佳实践** ：

错误处理的最佳实践包括捕获异常（使用try-except捕获可能的异常）、分类错误（根据错误类型返回不同的错误码）、详细信息（提供详细的错误信息）、用户友好（错误信息应该清晰易懂）、日志记录（记录详细的错误日志）、错误传递（正确传递错误信息给调用方）、恢复策略（考虑错误后的恢复策略）等方面。

**错误处理实现** ：

```python
def safe_file_read(file_path: str, encoding: str = "utf-8", max_size: int = 1024 * 1024) -> str:
    """安全读取文件"""
    try:
        # 检查文件是否存在
        if not os.path.exists(file_path):
            return f"错误：文件不存在 - {file_path}"
        
        # 检查文件大小
        file_size = os.path.getsize(file_path)
        if file_size > max_size:
            return f"错误：文件大小超过限制 - {file_size} > {max_size}"
        
        # 检查文件是否为普通文件
        if not os.path.isfile(file_path):
            return f"错误：路径不是文件 - {file_path}"
        
        # 检查读取权限
        if not os.access(file_path, os.R_OK):
            return f"错误：没有读取权限 - {file_path}"
        
        # 读取文件
        with open(file_path, 'r', encoding=encoding) as f:
            content = f.read(max_size)
        
        return content
        
    except UnicodeDecodeError:
        return f"错误：文件编码错误，尝试使用其他编码"
    except PermissionError:
        return f"错误：权限不足 - {file_path}"
    except TimeoutError:
        return f"错误：读取超时 - {file_path}"
    except Exception as e:
        return f"错误：{str(e)}"
```

### 4\. 工具执行流程

#### 4.1 执行流程设计

**MCP工具执行的标准流程** ：

MCP工具执行的标准流程包括参数验证（验证输入参数的有效性）、权限检查（检查是否有权限执行操作）、资源检查（检查所需资源是否可用）、执行准备（准备执行环境和资源）、核心执行（执行工具的核心逻辑）、结果处理（处理执行结果）、错误处理（处理执行过程中的错误）、结果返回（返回处理后的结果）等步骤。

**工具执行模式** ：

工具执行模式包括同步执行（阻塞式执行，等待执行完成）、异步执行（非阻塞式执行，通过回调或事件通知结果）、批量执行（批量处理多个请求）、流式执行（流式返回执行结果）等。

**异步执行实现** ：

```python
import asyncio

async def async_file_read(file_path: str) -> str:
    """异步读取文件"""
    try:
        # 模拟异步操作
        await asyncio.sleep(0.1)
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        return content
    except Exception as e:
        return f"错误：{str(e)}"

async def execute_async_tool(tool_name: str, **kwargs) -> str:
    """执行异步工具"""
    if tool_name == "file.read.async":
        return await async_file_read(**kwargs)
    else:
        return f"错误：未知工具 - {tool_name}"
```

### 5\. 工具结果格式化

#### 5.1 结果类型

**工具返回结果类型** ：

工具返回结果类型包括基本类型（字符串、数字、布尔值）、复合类型（对象、数组）、特殊类型（文件、二进制数据、错误信息）等。

#### 5.2 结果格式设计

**结果格式设计要点** ：

结果格式设计要点包括一致性（返回格式保持一致）、可读性（结果易于理解和使用）、完整性（包含所有必要的信息）、结构化（使用结构化的数据格式）、错误信息（错误情况下返回详细的错误信息）等方面。

**结果格式化实现** ：

```python
def format_tool_result(success: bool, data: any = None, error: str = None) -> dict:
    """格式化工具执行结果"""
    result = {
        "success": success,
        "timestamp": datetime.utcnow().isoformat()
    }
    
    if success and data is not None:
        result["data"] = data
    elif not success and error is not None:
        result["error"] = error
    
    return result

# 使用示例
def file_read_tool(file_path: str) -> dict:
    """文件读取工具"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        return format_tool_result(
            success=True,
            data={
                "file_path": file_path,
                "content": content,
                "size": len(content)
            }
        )
    except Exception as e:
        return format_tool_result(
            success=False,
            error=str(e)
        )
```

### 6\. 工具注册与管理

#### 6.1 工具注册

**工具注册流程** ：

工具注册流程包括定义工具（创建工具类或函数）、配置工具（设置工具的元数据）、注册工具（将工具注册到ToolManager）、验证工具（验证工具配置是否正确）、测试工具（测试工具是否正常工作）等方面。

**工具注册实现** ：

```python
from app.managers.tool_manager import ToolManager
from app.models.tool import Tool, ToolParameter

# 初始化工具管理器
tool_manager = ToolManager()

# 定义文件读取工具
def read_file(file_path: str, encoding: str = "utf-8") -> str:
    """读取文件内容"""
    try:
        with open(file_path, 'r', encoding=encoding) as f:
            return f.read()
    except Exception as e:
        return f"错误：{str(e)}"

# 注册文件读取工具
read_file_tool = Tool(
    name="file.read",
    description="读取文件内容",
    parameters=[
        ToolParameter(
            name="file_path",
            type="string",
            description="文件路径",
            required=True,
            example="/tmp/test.txt"
        ),
        ToolParameter(
            name="encoding",
            type="string",
            description="文件编码",
            required=False,
            default="utf-8",
            example="utf-8"
        )
    ],
    return_type="string",
    return_description="文件内容"
)
tool_manager.register(read_file_tool, read_file)

# 定义文件写入工具
def write_file(file_path: str, content: str, encoding: str = "utf-8") -> str:
    """写入文件内容"""
    try:
        # 确保目录存在
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        with open(file_path, 'w', encoding=encoding) as f:
            f.write(content)
        
        return "文件写入成功"
    except Exception as e:
        return f"错误：{str(e)}"

# 注册文件写入工具
write_file_tool = Tool(
    name="file.write",
    description="写入文件内容",
    parameters=[
        ToolParameter(
            name="file_path",
            type="string",
            description="文件路径",
            required=True,
            example="/tmp/test.txt"
        ),
        ToolParameter(
            name="content",
            type="string",
            description="文件内容",
            required=True,
            example="Hello, World!"
        ),
        ToolParameter(
            name="encoding",
            type="string",
            description="文件编码",
            required=False,
            default="utf-8",
            example="utf-8"
        )
    ],
    return_type="string",
    return_description="操作结果"
)
tool_manager.register(write_file_tool, write_file)
```

#### 6.2 工具管理

**工具管理功能** ：

工具管理功能包括工具列表（获取所有注册的工具）、工具查询（根据名称查询工具）、工具更新（更新工具配置）、工具删除（删除不再需要的工具）、工具测试（测试工具功能）、工具监控（监控工具执行情况）等方面。

**工具管理实现** ：

```python
class EnhancedToolManager(ToolManager):
    def __init__(self):
        super().__init__()
        self.execution_stats = {}
    
    def execute(self, tool_call):
        """执行工具并记录统计信息"""
        start_time = time.time()
        
        try:
            result = super().execute(tool_call)
            execution_time = time.time() - start_time
            
            # 更新统计信息
            if tool_call.tool_name not in self.execution_stats:
                self.execution_stats[tool_call.tool_name] = {
                    "total_calls": 0,
                    "successful_calls": 0,
                    "failed_calls": 0,
                    "total_execution_time": 0,
                    "last_called": None
                }
            
            stats = self.execution_stats[tool_call.tool_name]
            stats["total_calls"] += 1
            stats["total_execution_time"] += execution_time
            stats["last_called"] = datetime.utcnow().isoformat()
            
            if result.status == "success":
                stats["successful_calls"] += 1
            else:
                stats["failed_calls"] += 1
            
            return result
        except Exception as e:
            execution_time = time.time() - start_time
            # 记录错误统计
            # ...
            raise
    
    def get_stats(self, tool_name=None):
        """获取工具执行统计信息"""
        if tool_name:
            return self.execution_stats.get(tool_name, {})
        return self.execution_stats
    
    def get_tool_by_category(self, category):
        """根据分类获取工具"""
        category_tools = []
        for tool in self.tools.values():
            if tool.name.startswith(f"{category}."):
                category_tools.append(tool)
        return category_tools
```

### 7\. 实战：开发实用的MCP工具

#### 7.1 文件操作工具集

**文件操作工具** ：

文件操作工具包括file.read（读取文件内容）、file.write（写入文件内容）、file.list（列出目录文件）、file.delete（删除文件）、file.copy（复制文件）、file.move（移动文件）、file.exists（检查文件是否存在）、file.size（获取文件大小）等。

**文件操作工具实现** ：

```python
import os
import shutil
from typing import List, Dict, Any

# 文件读取工具
def file_read(file_path: str, encoding: str = "utf-8") -> Dict[str, Any]:
    """读取文件内容"""
    try:
        if not os.path.exists(file_path):
            return {"success": False, "error": f"文件不存在: {file_path}"}
        
        if not os.path.isfile(file_path):
            return {"success": False, "error": f"路径不是文件: {file_path}"}
        
        with open(file_path, 'r', encoding=encoding) as f:
            content = f.read()
        
        return {
            "success": True,
            "data": {
                "file_path": file_path,
                "content": content,
                "size": len(content),
                "encoding": encoding
            }
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

# 文件写入工具
def file_write(file_path: str, content: str, encoding: str = "utf-8", overwrite: bool = True) -> Dict[str, Any]:
    """写入文件内容"""
    try:
        if os.path.exists(file_path) and not overwrite:
            return {"success": False, "error": f"文件已存在: {file_path}"}
        
        # 确保目录存在
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        with open(file_path, 'w', encoding=encoding) as f:
            f.write(content)
        
        return {
            "success": True,
            "data": {
                "file_path": file_path,
                "size": len(content),
                "encoding": encoding,
                "overwrite": overwrite
            }
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

# 文件列表工具
def file_list(directory: str, pattern: str = "*", recursive: bool = False) -> Dict[str, Any]:
    """列出目录文件"""
    try:
        if not os.path.exists(directory):
            return {"success": False, "error": f"目录不存在: {directory}"}
        
        if not os.path.isdir(directory):
            return {"success": False, "error": f"路径不是目录: {directory}"}
        
        files = []
        if recursive:
            for root, _, filenames in os.walk(directory):
                for filename in filenames:
                    if fnmatch.fnmatch(filename, pattern):
                        file_path = os.path.join(root, filename)
                        files.append({
                            "path": file_path,
                            "name": filename,
                            "size": os.path.getsize(file_path),
                            "mtime": os.path.getmtime(file_path)
                        })
        else:
            for filename in os.listdir(directory):
                file_path = os.path.join(directory, filename)
                if os.path.isfile(file_path) and fnmatch.fnmatch(filename, pattern):
                    files.append({
                        "path": file_path,
                        "name": filename,
                        "size": os.path.getsize(file_path),
                        "mtime": os.path.getmtime(file_path)
                    })
        
        return {
            "success": True,
            "data": {
                "directory": directory,
                "pattern": pattern,
                "recursive": recursive,
                "files": files,
                "count": len(files)
            }
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
```

#### 7.2 网络请求工具集

**网络请求工具** ：

网络请求工具包括http.get（发送HTTP GET请求）、http.post（发送HTTP POST请求）、http.put（发送HTTP PUT请求）、http.delete（发送HTTP DELETE请求）、url.fetch（获取URL内容）、api.call（调用API）等。

**网络请求工具实现** ：

```python
import requests
from typing import Dict, Any, Optional

# HTTP GET请求工具
def http_get(url: str, params: Optional[Dict[str, Any]] = None, headers: Optional[Dict[str, str]] = None, timeout: int = 30) -> Dict[str, Any]:
    """发送HTTP GET请求"""
    try:
        response = requests.get(
            url=url,
            params=params,
            headers=headers,
            timeout=timeout,
            verify=True
        )
        
        return {
            "success": True,
            "data": {
                "url": url,
                "status_code": response.status_code,
                "headers": dict(response.headers),
                "content": response.text,
                "encoding": response.encoding
            }
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

# HTTP POST请求工具
def http_post(url: str, data: Optional[Any] = None, json: Optional[Dict[str, Any]] = None, headers: Optional[Dict[str, str]] = None, timeout: int = 30) -> Dict[str, Any]:
    """发送HTTP POST请求"""
    try:
        response = requests.post(
            url=url,
            data=data,
            json=json,
            headers=headers,
            timeout=timeout,
            verify=True
        )
        
        return {
            "success": True,
            "data": {
                "url": url,
                "status_code": response.status_code,
                "headers": dict(response.headers),
                "content": response.text,
                "encoding": response.encoding
            }
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
```

#### 7.3 数据处理工具集

**数据处理工具** ：

数据处理工具包括data.json.parse（解析JSON字符串）、data.json.stringify（将对象转换为JSON字符串）、data.csv.read（读取CSV文件）、data.csv.write（写入CSV文件）、data.text.process（文本处理）、data.number.calculate（数学计算）等。

**数据处理工具实现** ：

```python
import json
import csv
from typing import Dict, Any, List

# JSON解析工具
def json_parse(json_string: str) -> Dict[str, Any]:
    """解析JSON字符串"""
    try:
        data = json.loads(json_string)
        return {"success": True, "data": data}
    except Exception as e:
        return {"success": False, "error": str(e)}

# JSON序列化工具
def json_stringify(data: Any, indent: int = 2) -> Dict[str, Any]:
    """将对象转换为JSON字符串"""
    try:
        json_string = json.dumps(data, indent=indent, ensure_ascii=False)
        return {"success": True, "data": json_string}
    except Exception as e:
        return {"success": False, "error": str(e)}

# 文本处理工具
def text_process(text: str, operation: str, **kwargs) -> Dict[str, Any]:
    """文本处理"""
    try:
        if operation == "uppercase":
            result = text.upper()
        elif operation == "lowercase":
            result = text.lower()
        elif operation == "trim":
            result = text.strip()
        elif operation == "split":
            separator = kwargs.get("separator", " ")
            result = text.split(separator)
        elif operation == "replace":
            old = kwargs.get("old", "")
            new = kwargs.get("new", "")
            result = text.replace(old, new)
        elif operation == "length":
            result = len(text)
        else:
            return {"success": False, "error": f"未知操作: {operation}"}
        
        return {
            "success": True,
            "data": {
                "original": text,
                "operation": operation,
                "result": result,
                "kwargs": kwargs
            }
        }
    except Exception as e:
        return {"success": False, "error": str(e)}
```

### 8\. 工具测试与调试

#### 8.1 测试方法

**MCP工具测试策略** ：

测试类型包括单元测试（测试工具的各个功能单元）、集成测试（测试工具与Server的集成）、端到端测试（测试完整的工具调用流程）、性能测试（测试工具的性能表现）、安全测试（测试工具的安全性）等。

**单元测试实现** ：

```python
import unittest
from app.tools.file_tools import file_read, file_write

class TestFileTools(unittest.TestCase):
    def setUp(self):
        """设置测试环境"""
        self.test_file = "/tmp/test_file.txt"
        self.test_content = "Hello, MCP!"
        
        # 创建测试文件
        with open(self.test_file, 'w', encoding='utf-8') as f:
            f.write(self.test_content)
    
    def tearDown(self):
        """清理测试环境"""
        if os.path.exists(self.test_file):
            os.remove(self.test_file)
    
    def test_file_read_success(self):
        """测试文件读取成功"""
        result = file_read(self.test_file)
        self.assertTrue(result["success"])
        self.assertEqual(result["data"]["content"], self.test_content)
    
    def test_file_read_nonexistent(self):
        """测试读取不存在的文件"""
        result = file_read("/tmp/nonexistent_file.txt")
        self.assertFalse(result["success"])
        self.assertIn("错误", result["error"])
    
    def test_file_write_success(self):
        """测试文件写入成功"""
        new_content = "Updated content"
        result = file_write(self.test_file, new_content, overwrite=True)
        self.assertTrue(result["success"])
        
        # 验证文件内容已更新
        read_result = file_read(self.test_file)
        self.assertEqual(read_result["data"]["content"], new_content)
    
    def test_file_write_no_overwrite(self):
        """测试文件写入（不覆盖）"""
        result = file_write(self.test_file, "New content", overwrite=False)
        self.assertFalse(result["success"])
        self.assertIn("文件已存在", result["error"])

if __name__ == '__main__':
    unittest.main()
```

#### 8.2 调试技巧

**MCP工具调试技巧** ：

调试技巧包括日志记录（添加详细的日志）、断点调试（使用IDE的断点功能）、参数打印（打印输入参数）、结果打印（打印执行结果）、错误捕获（捕获并记录错误）、模拟测试（使用模拟数据测试）、逐步执行（逐步执行代码）、性能分析（分析执行性能）等方面。

**调试工具实现** ：

```python
import logging
import traceback

# 配置日志
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('mcp.tools')

def debug_tool_execution(func):
    """工具执行调试装饰器"""
    def wrapper(*args, **kwargs):
        tool_name = func.__name__
        logger.debug(f"开始执行工具: {tool_name}")
        logger.debug(f"参数: args={args}, kwargs={kwargs}")
        
        try:
            start_time = time.time()
            result = func(*args, **kwargs)
            execution_time = time.time() - start_time
            
            logger.debug(f"工具执行成功: {tool_name}")
            logger.debug(f"执行时间: {execution_time:.4f}秒")
            logger.debug(f"结果: {result}")
            
            return result
        except Exception as e:
            logger.error(f"工具执行失败: {tool_name}")
            logger.error(f"错误: {str(e)}")
            logger.error(f"堆栈: {traceback.format_exc()}")
            raise
    
    return wrapper

# 使用装饰器
@debug_tool_execution
def debug_file_read(file_path: str):
    """带调试的文件读取工具"""
    return file_read(file_path)
```

### 9\. 工具安全与权限

#### 9.1 安全考虑

**MCP工具的安全风险** ：

MCP工具的安全风险包括路径遍历（通过文件路径访问不应访问的文件）、命令注入（执行恶意命令）、网络攻击（通过网络工具发起攻击）、数据泄露（泄露敏感信息）、资源耗尽（消耗过多系统资源）、权限提升（获取更高权限）等。

#### 9.2 安全措施

**安全措施** ：

安全措施包括输入验证（严格验证所有输入参数）、路径限制（限制文件操作的路径范围）、网络限制（限制网络请求的目标和频率）、资源限制（限制工具可以使用的资源）、权限检查（检查用户权限）、加密传输（使用HTTPS传输）、审计日志（记录工具执行日志）、沙箱隔离（在沙箱中执行危险操作）等方面。

**安全实现** ：

```python
def secure_file_operation(file_path: str, operation: str, **kwargs) -> Dict[str, Any]:
    """安全的文件操作"""
    # 安全检查
    if not is_safe_path(file_path):
        return {"success": False, "error": "不安全的文件路径"}
    
    if not has_permission(file_path, operation):
        return {"success": False, "error": "权限不足"}
    
    if is_too_large(file_path):
        return {"success": False, "error": "文件过大"}
    
    # 执行操作
    try:
        if operation == "read":
            return file_read(file_path, **kwargs)
        elif operation == "write":
            return file_write(file_path, **kwargs)
        else:
            return {"success": False, "error": f"未知操作: {operation}"}
    except Exception as e:
        return {"success": False, "error": str(e)}

def is_safe_path(file_path: str) -> bool:
    """检查文件路径是否安全"""
    # 规范化路径
    normalized_path = os.path.normpath(file_path)
    
    # 允许的基本路径
    allowed_bases = ["/tmp", "/var/tmp", os.path.expanduser("~/.mcp")]
    
    # 检查路径是否在允许的范围内
    for base in allowed_bases:
        if normalized_path.startswith(base):
            return True
    
    return False

def has_permission(file_path: str, operation: str) -> bool:
    """检查是否有操作权限"""
    # 检查文件是否存在
    if os.path.exists(file_path):
        if operation == "read":
            return os.access(file_path, os.R_OK)
        elif operation == "write":
            return os.access(file_path, os.W_OK)
    else:
        # 检查目录权限
        dir_path = os.path.dirname(file_path)
        if os.path.exists(dir_path):
            return os.access(dir_path, os.W_OK)
    
    return False

def is_too_large(file_path: str, max_size: int = 10 * 1024 * 1024) -> bool:
    """检查文件是否过大"""
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return os.path.getsize(file_path) > max_size
    return False
```

### 10\. 技术选型建议

#### 10.1 工具开发技术栈

**推荐技术栈** ：

| 类型 | 技术 | 推荐理由 |
| --- | --- | --- |
| 语言 | Python 3.8+ | 简洁易读，生态丰富 |
| 框架 | FastAPI | 高性能，自动文档 |
| 验证 | Pydantic | 强大的参数验证 |
| 网络 | requests/aiohttp | 成熟的HTTP客户端 |
| 异步 | asyncio | 支持异步操作 |
| 安全 | cryptography | 强大的加密库 |
| 测试 | pytest | 灵活的测试框架 |
| 日志 | structlog | 结构化日志 |

#### 10.2 工具开发最佳实践

**工具开发建议** ：

最佳实践包括模块化设计（将工具功能模块化）、代码复用（复用通用功能）、文档完善（提供详细的文档）、版本控制（使用Git进行版本控制）、依赖管理（使用requirements.txt管理依赖）、容器化（使用Docker容器化部署）、CI/CD（设置持续集成/持续部署）、监控告警（设置监控和告警）等方面。

### 11\. 常见问题与解决方案

#### 11.1 工具执行失败

**问题** ：工具执行失败，返回错误信息。

**解决方案** ：

解决方案包括检查输入参数是否正确、检查工具权限是否足够、检查资源是否可访问、查看详细的错误信息、检查Server日志等方面。

#### 11.2 工具性能问题

**问题** ：工具执行缓慢，响应时间长。

**解决方案** ：

解决方案包括优化工具执行逻辑、使用异步执行、减少网络请求、优化文件操作、增加缓存机制等方面。

#### 11.3 工具安全问题

**问题** ：工具存在安全漏洞。

**解决方案** ：

解决方案包括加强输入验证、限制操作范围、增加权限检查、实施安全审计、更新依赖库等方面。

### 12\. 学习资源

#### 12.1 官方文档

官方文档包括Python Documentation（ [https://docs.python.org/）、FastAPI](https://docs.python.org/%EF%BC%89%E3%80%81FastAPI) Documentation（ [https://fastapi.tiangolo.com/）、Pydantic](https://fastapi.tiangolo.com/%EF%BC%89%E3%80%81Pydantic) Documentation（ [https://pydantic-docs.helpmanual.io/）、Requests](https://pydantic-docs.helpmanual.io/%EF%BC%89%E3%80%81Requests) Documentation（ [https://docs.python-requests.org/）等。](https://docs.python-requests.org/%EF%BC%89%E7%AD%89%E3%80%82)

#### 12.2 在线资源

在线资源包括Real Python（ [https://realpython.com/）、Python.org（https://www.python.org/）、Stack](https://realpython.com/%EF%BC%89%E3%80%81Python.org%EF%BC%88https://www.python.org/%EF%BC%89%E3%80%81Stack) Overflow（ [https://stackoverflow.com/）、GitHub（https://github.com/）等。](https://stackoverflow.com/%EF%BC%89%E3%80%81GitHub%EF%BC%88https://github.com/%EF%BC%89%E7%AD%89%E3%80%82)

#### 12.3 推荐书籍

推荐书籍包括Python Cookbook（by David Beazley & Brian K. Jones）、Fluent Python（by Luciano Ramalho）、Effective Python（by Brett Slatkin）、Python Testing with pytest（by Brian Okken）等。

### 13\. 总结

本课程深入介绍了MCP工具开发的核心内容，包括工具设计原则、参数验证、错误处理、执行流程、结果格式化、工具注册与管理、实战开发、测试调试、安全与权限等方面。通过本课程的学习，你应该能够设计和实现MCP工具、处理工具参数和错误、优化工具执行性能、确保工具安全性、测试和调试工具、管理和监控工具。

在后续课程中，我们将学习MCP资源管理、Client开发和Claude Desktop集成等内容，进一步完善你的MCP开发技能。

---

## 课后作业

1. **实践题** ：

实践题包括开发一个完整的文件操作工具集（至少5个工具）、实现网络请求工具集（至少3个工具）、编写工具测试用例、实现工具执行统计和监控等方面。

**思考题** ：

思考题包括如何设计一个安全的MCP工具、如何优化MCP工具的性能、如何处理工具执行超时的情况、如何实现工具的版本管理等方面。

---

![架构师AI杜公众号二维码](https://www.weekr.net/mp.png)

扫描二维码关注"架构师AI杜"公众号，获取更多技术内容和最新动态