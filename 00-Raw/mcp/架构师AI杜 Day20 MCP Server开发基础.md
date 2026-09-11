---
title: "架构师AI杜技术文档"
source: "https://www.weekr.net/ai/day-20.html"
author:
  - "[[架构师AI杜]]"
published: 2026-03-19
created: 2026-09-03
description: "第20天：MCP Server开发基础 - 架构师AI杜技术文档"
tags:
  - "clippings"
---
## 第20天：MCP Server开发基础

## 学习目标

本节的学习目标包括掌握MCP Server的架构设计、学会定义MCP资源、学会定义MCP工具、能够开发简单的MCP Server等方面。

## 核心内容

### 1\. MCP Server架构设计

**MCP Server的基本架构** ：

```
┌────────────────┐     ┌────────────────┐     ┌────────────────┐
│   MCP Client   │────>│   MCP Server   │────>│   Tool/        │
│   (AI Model)   │<────│                │<────│   Resource     │
└────────────────┘     └────────────────┘     │   Manager      │
                                              └────────────────┘
```

**Server核心组件** ：

Server核心组件包括请求处理器（接收和解析MCP请求）、工具管理器（管理工具的注册和执行）、资源管理器（管理资源的定义和访问）、认证授权器（处理用户认证和权限验证）、响应生成器（生成MCP响应）、错误处理器（处理异常和错误）等方面。

### 2\. 开发环境准备

#### 2.1 技术栈选择

**推荐技术栈** ：

推荐技术栈包括语言（Python 3.8+）、框架（FastAPI）、依赖管理（pip + requirements.txt）、认证（JWT + API Key）、CORS（FastAPI CORS）等方面。

#### 2.2 环境搭建

**安装依赖** ：

```bash
# 创建虚拟环境
python3 -m venv venv

# 激活虚拟环境
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate  # Windows

# 安装依赖
pip install fastapi uvicorn pydantic python-jose[cryptography] passlib[bcrypt] python-multipart
```

**项目结构** ：

```
mcp-server/
├── app/
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes.py
│   │   └── dependencies.py
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   └── security.py
│   ├── managers/
│   │   ├── __init__.py
│   │   ├── tool_manager.py
│   │   └── resource_manager.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── tool.py
│   │   └── resource.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── request.py
│   │   └── response.py
│   ├── tools/
│   │   ├── __init__.py
│   │   ├── base.py
│   │   └── file_tools.py
│   └── __init__.py
├── main.py
├── requirements.txt
└── README.md
```

### 3\. 资源定义（Resource Definition）

#### 3.1 资源模型设计

**资源基类** ：

```python
from pydantic import BaseModel
from typing import Optional, Dict, Any
from enum import Enum

class ResourceType(str, Enum):
    FILE = "file"
    NETWORK = "network"
    DATABASE = "database"
    COMPUTE = "compute"
    SERVICE = "service"

class Resource(BaseModel):
    id: str
    name: str
    type: ResourceType
    description: Optional[str] = None
    properties: Dict[str, Any] = {}
    metadata: Dict[str, Any] = {}
    created_at: str
    updated_at: str

class ResourceCreate(BaseModel):
    name: str
    type: ResourceType
    description: Optional[str] = None
    properties: Dict[str, Any] = {}
    metadata: Dict[str, Any] = {}

class ResourceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    properties: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None
```

#### 3.2 资源管理器实现

**资源管理器** ：

```python
from typing import Dict, List, Optional
from datetime import datetime
from app.models.resource import Resource, ResourceCreate, ResourceUpdate

class ResourceManager:
    def __init__(self):
        self.resources: Dict[str, Resource] = {}
    
    def create(self, resource_data: ResourceCreate) -> Resource:
        """创建资源"""
        resource_id = f"{resource_data.type.value}_{len(self.resources) + 1}"
        now = datetime.utcnow().isoformat()
        
        resource = Resource(
            id=resource_id,
            name=resource_data.name,
            type=resource_data.type,
            description=resource_data.description,
            properties=resource_data.properties,
            metadata=resource_data.metadata,
            created_at=now,
            updated_at=now
        )
        
        self.resources[resource_id] = resource
        return resource
    
    def get(self, resource_id: str) -> Optional[Resource]:
        """获取资源"""
        return self.resources.get(resource_id)
    
    def list(self) -> List[Resource]:
        """获取资源列表"""
        return list(self.resources.values())
    
    def update(self, resource_id: str, resource_data: ResourceUpdate) -> Optional[Resource]:
        """更新资源"""
        if resource_id not in self.resources:
            return None
        
        resource = self.resources[resource_id]
        update_data = resource_data.dict(exclude_unset=True)
        
        for field, value in update_data.items():
            if hasattr(resource, field):
                setattr(resource, field, value)
        
        resource.updated_at = datetime.utcnow().isoformat()
        self.resources[resource_id] = resource
        return resource
    
    def delete(self, resource_id: str) -> bool:
        """删除资源"""
        if resource_id in self.resources:
            del self.resources[resource_id]
            return True
        return False
```

### 4\. 工具定义（Tool Definition）

#### 4.1 工具模型设计

**工具基类** ：

```python
from pydantic import BaseModel
from typing import Optional, Dict, Any, List

class ToolParameter(BaseModel):
    name: str
    type: str
    description: Optional[str] = None
    required: bool = True
    default: Optional[Any] = None

class Tool(BaseModel):
    name: str
    description: str
    parameters: List[ToolParameter]
    return_type: str
    return_description: Optional[str] = None
    resource_ids: List[str] = []

class ToolCall(BaseModel):
    tool_name: str
    arguments: Dict[str, Any]

class ToolResult(BaseModel):
    tool_name: str
    output: Any
    status: str
    error: Optional[str] = None
```

#### 4.2 工具管理器实现

**工具管理器** ：

```python
from typing import Dict, List, Optional, Callable
from app.models.tool import Tool, ToolCall, ToolResult

class ToolManager:
    def __init__(self):
        self.tools: Dict[str, Tool] = {}
        self.tool_functions: Dict[str, Callable] = {}
    
    def register(self, tool: Tool, func: Callable) -> None:
        """注册工具"""
        self.tools[tool.name] = tool
        self.tool_functions[tool.name] = func
    
    def get(self, tool_name: str) -> Optional[Tool]:
        """获取工具"""
        return self.tools.get(tool_name)
    
    def list(self) -> List[Tool]:
        """获取工具列表"""
        return list(self.tools.values())
    
    def execute(self, tool_call: ToolCall) -> ToolResult:
        """执行工具"""
        if tool_call.tool_name not in self.tools:
            return ToolResult(
                tool_name=tool_call.tool_name,
                output=None,
                status="error",
                error="Tool not found"
            )
        
        try:
            func = self.tool_functions[tool_call.tool_name]
            output = func(**tool_call.arguments)
            
            return ToolResult(
                tool_name=tool_call.tool_name,
                output=output,
                status="success",
                error=None
            )
        except Exception as e:
            return ToolResult(
                tool_name=tool_call.tool_name,
                output=None,
                status="error",
                error=str(e)
            )
```

### 5\. 请求处理流程

#### 5.1 MCP请求模型

**请求模型** ：

```python
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.models.tool import ToolCall

class MCPRequest(BaseModel):
    jsonrpc: str = "2.0"
    method: str
    params: Dict[str, Any]
    id: Optional[int] = None

class ListToolsRequest(BaseModel):
    pass

class CallToolRequest(BaseModel):
    tool_name: str
    arguments: Dict[str, Any]

class ListResourcesRequest(BaseModel):
    pass

class GetResourceRequest(BaseModel):
    resource_id: str
```

#### 5.2 请求处理器实现

**请求处理器** ：

```python
from typing import Dict, Any
from app.models.request import MCPRequest
from app.managers.tool_manager import ToolManager
from app.managers.resource_manager import ResourceManager

class RequestHandler:
    def __init__(self, tool_manager: ToolManager, resource_manager: ResourceManager):
        self.tool_manager = tool_manager
        self.resource_manager = resource_manager
    
    def handle(self, request: MCPRequest) -> Dict[str, Any]:
        """处理MCP请求"""
        method = request.method
        params = request.params
        request_id = request.id
        
        try:
            if method == "mcp.list_tools":
                result = self._handle_list_tools()
            elif method == "mcp.call_tool":
                result = self._handle_call_tool(params)
            elif method == "mcp.list_resources":
                result = self._handle_list_resources()
            elif method == "mcp.get_resource":
                result = self._handle_get_resource(params)
            else:
                return self._create_error_response(request_id, 404, "Method not found")
            
            return self._create_success_response(request_id, result)
        except Exception as e:
            return self._create_error_response(request_id, 500, str(e))
    
    def _handle_list_tools(self) -> Dict[str, Any]:
        """处理获取工具列表请求"""
        tools = self.tool_manager.list()
        tool_list = []
        
        for tool in tools:
            tool_info = {
                "name": tool.name,
                "description": tool.description,
                "parameters": [p.dict() for p in tool.parameters],
                "return_type": tool.return_type,
                "return_description": tool.return_description
            }
            tool_list.append(tool_info)
        
        return {"tools": tool_list}
    
    def _handle_call_tool(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """处理调用工具请求"""
        from app.models.tool import ToolCall
        
        tool_call = ToolCall(
            tool_name=params.get("tool_name"),
            arguments=params.get("arguments", {})
        )
        
        result = self.tool_manager.execute(tool_call)
        return result.dict()
    
    def _handle_list_resources(self) -> Dict[str, Any]:
        """处理获取资源列表请求"""
        resources = self.resource_manager.list()
        resource_list = [r.dict() for r in resources]
        return {"resources": resource_list}
    
    def _handle_get_resource(self, params: Dict[str, Any]) -> Dict[str, Any]:
        """处理获取资源请求"""
        resource_id = params.get("resource_id")
        resource = self.resource_manager.get(resource_id)
        
        if resource:
            return resource.dict()
        else:
            raise ValueError("Resource not found")
    
    def _create_success_response(self, request_id: int, result: Any) -> Dict[str, Any]:
        """创建成功响应"""
        return {
            "jsonrpc": "2.0",
            "result": result,
            "id": request_id
        }
    
    def _create_error_response(self, request_id: int, code: int, message: str) -> Dict[str, Any]:
        """创建错误响应"""
        return {
            "jsonrpc": "2.0",
            "error": {
                "code": code,
                "message": message
            },
            "id": request_id
        }
```

### 6\. 响应格式设计

**MCP响应格式** ：

#### 6.1 成功响应

```json
{
  "jsonrpc": "2.0",
  "result": {
    "tool_name": "file.read",
    "output": "文件内容...",
    "status": "success"
  },
  "id": 1
}
```

#### 6.2 错误响应

```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": 400,
    "message": "参数错误"
  },
  "id": 1
}
```

### 7\. 错误处理机制

**错误类型** ：

1. **参数错误** （400）：请求参数格式不正确
2. **认证失败** （401）：认证信息无效
3. **授权失败** （403）：没有权限执行操作
4. **资源不存在** （404）：请求的资源不存在
5. **服务器错误** （500）：服务器内部错误
6. **服务不可用** （503）：服务暂时不可用

**错误处理中间件** ：

```python
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
import traceback

app = FastAPI()

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """全局异常处理"""
    error_code = 500
    error_message = str(exc)
    
    if isinstance(exc, HTTPException):
        error_code = exc.status_code
        error_message = exc.detail
    
    return JSONResponse(
        status_code=error_code,
        content={
            "jsonrpc": "2.0",
            "error": {
                "code": error_code,
                "message": error_message,
                "data": {
                    "traceback": traceback.format_exc() if error_code == 500 else None
                }
            },
            "id": None
        }
    )
```

### 8\. 实战：开发简单的MCP Server

#### 8.1 完整的MCP Server实现

**main.py** ：

```python
from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import json
from app.managers.tool_manager import ToolManager
from app.managers.resource_manager import ResourceManager
from app.models.tool import Tool, ToolParameter
from app.models.resource import ResourceCreate, ResourceType
from app.models.request import MCPRequest
from app.api.dependencies import get_api_key

app = FastAPI(title="MCP Server", version="1.0.0")

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该设置具体的域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 初始化管理器
tool_manager = ToolManager()
resource_manager = ResourceManager()

# 注册文件资源
file_resource = ResourceCreate(
    name="Local File System",
    type=ResourceType.FILE,
    description="本地文件系统资源",
    properties={"base_path": "/tmp"}
)
resource_manager.create(file_resource)

# 注册示例工具
def read_file(file_path: str) -> str:
    """读取文件内容"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        return f"Error: {str(e)}"

read_file_tool = Tool(
    name="file.read",
    description="读取文件内容",
    parameters=[
        ToolParameter(
            name="file_path",
            type="string",
            description="文件路径",
            required=True
        )
    ],
    return_type="string",
    return_description="文件内容"
)
tool_manager.register(read_file_tool, read_file)

# MCP请求处理端点
@app.post("/mcp")
async def handle_mcp_request(request: Request, api_key: str = Depends(get_api_key)):
    """处理MCP请求"""
    try:
        body = await request.body()
        request_data = json.loads(body)
        mcp_request = MCPRequest(**request_data)
        
        # 处理请求
        from app.api.routes import handle_mcp_request
        response = handle_mcp_request(mcp_request, tool_manager, resource_manager)
        return response
    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={
                "jsonrpc": "2.0",
                "error": {
                    "code": 400,
                    "message": str(e)
                },
                "id": None
            }
        )

# 健康检查端点
@app.get("/health")
async def health_check():
    """健康检查"""
    return {"status": "healthy", "message": "MCP Server is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

**app/api/dependencies.py** ：

```python
from fastapi import HTTPException, Header

API_KEY = "your-secret-api-key"  # 在生产环境中应该从环境变量获取

def get_api_key(x_api_key: str = Header(None)):
    """获取API密钥"""
    if not x_api_key:
        raise HTTPException(status_code=401, detail="API key required")
    if x_api_key != API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API key")
    return x_api_key
```

**app/api/routes.py** ：

```python
from typing import Dict, Any
from app.models.request import MCPRequest
from app.managers.tool_manager import ToolManager
from app.managers.resource_manager import ResourceManager
from app.models.tool import ToolCall
from app.models.resource import Resource

def handle_mcp_request(
    request: MCPRequest,
    tool_manager: ToolManager,
    resource_manager: ResourceManager
) -> Dict[str, Any]:
    """处理MCP请求"""
    method = request.method
    params = request.params
    request_id = request.id
    
    try:
        if method == "mcp.list_tools":
            result = _handle_list_tools(tool_manager)
        elif method == "mcp.call_tool":
            result = _handle_call_tool(tool_manager, params)
        elif method == "mcp.list_resources":
            result = _handle_list_resources(resource_manager)
        elif method == "mcp.get_resource":
            result = _handle_get_resource(resource_manager, params)
        else:
            return _create_error_response(request_id, 404, "Method not found")
        
        return _create_success_response(request_id, result)
    except Exception as e:
        return _create_error_response(request_id, 500, str(e))

def _handle_list_tools(tool_manager: ToolManager) -> Dict[str, Any]:
    """处理获取工具列表请求"""
    tools = tool_manager.list()
    tool_list = []
    
    for tool in tools:
        tool_info = {
            "name": tool.name,
            "description": tool.description,
            "parameters": [p.dict() for p in tool.parameters],
            "return_type": tool.return_type,
            "return_description": tool.return_description
        }
        tool_list.append(tool_info)
    
    return {"tools": tool_list}

def _handle_call_tool(tool_manager: ToolManager, params: Dict[str, Any]) -> Dict[str, Any]:
    """处理调用工具请求"""
    tool_call = ToolCall(
        tool_name=params.get("tool_name"),
        arguments=params.get("arguments", {})
    )
    
    result = tool_manager.execute(tool_call)
    return result.dict()

def _handle_list_resources(resource_manager: ResourceManager) -> Dict[str, Any]:
    """处理获取资源列表请求"""
    resources = resource_manager.list()
    resource_list = [r.dict() for r in resources]
    return {"resources": resource_list}

def _handle_get_resource(resource_manager: ResourceManager, params: Dict[str, Any]) -> Dict[str, Any]:
    """处理获取资源请求"""
    resource_id = params.get("resource_id")
    resource = resource_manager.get(resource_id)
    
    if resource:
        return resource.dict()
    else:
        raise ValueError("Resource not found")

def _create_success_response(request_id: int, result: Any) -> Dict[str, Any]:
    """创建成功响应"""
    return {
        "jsonrpc": "2.0",
        "result": result,
        "id": request_id
    }

def _create_error_response(request_id: int, code: int, message: str) -> Dict[str, Any]:
    """创建错误响应"""
    return {
        "jsonrpc": "2.0",
        "error": {
            "code": code,
            "message": message
        },
        "id": request_id
    }
```

#### 8.2 测试MCP Server

**启动Server** ：

```bash
# 启动MCP Server
uvicorn main:app --host 0.0.0.0 --port 8000
```

**测试工具发现** ：

```bash
# 使用curl测试工具发现
curl -X POST http://localhost:8000/mcp \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-api-key" \
  -d '{
    "jsonrpc": "2.0",
    "method": "mcp.list_tools",
    "params": {},
    "id": 1
  }'
```

**测试工具调用** ：

```bash
# 使用curl测试工具调用
curl -X POST http://localhost:8000/mcp \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-api-key" \
  -d '{
    "jsonrpc": "2.0",
    "method": "mcp.call_tool",
    "params": {
      "tool_name": "file.read",
      "arguments": {
        "file_path": "/tmp/test.txt"
      }
    },
    "id": 2
  }'
```

### 9\. 技术选型建议

#### 9.1 Server框架选择

**FastAPI vs Flask vs Django** ：

| 特性 | FastAPI | Flask | Django |
| --- | --- | --- | --- |
| 性能 | 高（异步） | 中 | 低 |
| 类型提示 | 支持 | 有限 | 有限 |
| 文档 | 自动生成 | 手动 | 手动 |
| 学习曲线 | 中等 | 低 | 高 |
| 适用场景 | 高性能API | 小型应用 | 大型应用 |

**推荐** ：FastAPI - 性能高，自动生成API文档，支持类型提示

#### 9.2 部署方案

**部署选项** ：

部署选项包括本地部署（适合开发和测试）、Docker部署（适合容器化环境）、云服务部署（适合生产环境）等。

**Docker部署示例** ：

```dockerfile
FROM python:3.9

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 10\. 常见问题与解决方案

#### 10.1 启动问题

**问题** ：MCP Server启动失败。

**解决方案** ：

解决方案包括检查端口是否被占用、检查依赖是否安装、检查配置文件是否正确、检查环境变量是否设置等方面。

#### 10.2 工具调用问题

**问题** ：工具调用返回错误。

**解决方案** ：

解决方案包括检查工具参数是否正确、检查工具函数是否正常、检查资源访问权限、查看Server日志等方面。

#### 10.3 性能问题

**问题** ：MCP Server响应缓慢。

**解决方案** ：

解决方案包括使用异步处理、优化工具执行逻辑、增加Server资源、启用缓存机制等方面。

### 11\. 学习资源

#### 11.1 官方文档

官方文档包括FastAPI Documentation（ [https://fastapi.tiangolo.com/）、Python](https://fastapi.tiangolo.com/%EF%BC%89%E3%80%81Python) Documentation（ [https://docs.python.org/）、MCP](https://docs.python.org/%EF%BC%89%E3%80%81MCP) Protocol Specification（ [https://docs.anthropic.com/claude/docs/mcp-protocol）等。](https://docs.anthropic.com/claude/docs/mcp-protocol%EF%BC%89%E7%AD%89%E3%80%82)

#### 11.2 在线资源

在线资源包括FastAPI Tutorial（ [https://fastapi.tiangolo.com/tutorial/）、Python](https://fastapi.tiangolo.com/tutorial/%EF%BC%89%E3%80%81Python) Async IO（ [https://docs.python.org/3/library/asyncio.html）、RESTful](https://docs.python.org/3/library/asyncio.html%EF%BC%89%E3%80%81RESTful) API Design（ [https://restfulapi.net/）等。](https://restfulapi.net/%EF%BC%89%E7%AD%89%E3%80%82)

### 12\. 总结

本课程深入介绍了MCP Server的开发基础，包括架构设计、资源定义、工具定义、请求处理和错误处理等核心内容。通过本课程的学习，你应该能够理解MCP Server的基本架构、开发简单的MCP Server、定义和管理MCP资源、定义和执行MCP工具、处理MCP请求和响应、实现错误处理机制。

在后续课程中，我们将深入学习MCP工具开发、资源管理、Client开发和Claude Desktop集成等高级内容，进一步提升你的MCP开发技能。

---

## 课后作业

1. **实践题** ：
	- 开发一个简单的MCP Server
		- 实现至少2个工具（文件读取和文件写入）
		- 测试工具调用功能
		- 编写部署文档
2. **思考题** ：
	- 如何优化MCP Server的性能？
		- 如何增强MCP Server的安全性？
		- 如何扩展MCP Server的功能？
		- 如何监控MCP Server的运行状态？

---

![架构师AI杜公众号二维码](https://www.weekr.net/mp.png)

扫描二维码关注"架构师AI杜"公众号，获取更多技术内容和最新动态