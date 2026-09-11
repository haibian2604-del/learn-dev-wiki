---
title: "【学习笔记】学习Docker，看完这篇超详细的教程就足够了_docker学习笔记-CSDN博客"
source: "https://blog.csdn.net/weixin_43246215/article/details/108934216"
author:
  - "[[成就一亿技术人!]]"
  - "[[hope_wisdom 发出的红包]]"
published:
created: 2026-07-31
description: "文章浏览阅读3.7w次，点赞126次，收藏360次。本文为观看B站狂神的视频学习Docker时所整理的笔记，中间加了一些自己的理解，如果对大家有所帮助，还希望点赞支持一下，后续我会继续将自己遇到的Docker问题以及学习的新的知识全部整理添加到本文后面或者整理发布新的文章，如果感兴趣可以关注一波。目录Docker的概述为什么需要Docker？简述虚拟机和Docker容器的区别Docker中的DevOps（开发、运维）Docker的基本组成Docker的安装前期准备（看看即可）开始安装如何卸载Docker（了解即可）配置阿里云镜像加速Run的流程以及.._docker学习笔记"
tags:
  - "clippings"
---
> > 本文为观看B站狂神的视频学习Docker时所整理的笔记，中间加了一些自己的理解，如果对大家有所帮助，还希望点赞支持一下，后续我会继续将自己遇到的Docker问题以及学习的新的知识全部整理添加到本文后面或者整理发布新的文章，如果感兴趣可以关注一波。

## Docker的概述

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/9868da052e20a942ad33861ee83ac5e3.png#pic_center)  
Docker 是一个开源的应用容器引擎，基于 Go 语言 并遵从 Apache2.0 协议开源。  
**Docker的官网地址** ： [https://www.docker.com/](https://www.docker.com/)  
**文档地址** ： [https://docs.docker.com/](https://docs.docker.com/)  
**仓库地址** ： [https://hub.docker.com/](https://hub.docker.com/)

### 为什么需要Docker？

**传统的开发问题** ：

- **环境（切换/配置）麻烦**  
	在开发一个产品的途中，时常会出现的问题就是：“在我的电脑上可以运行，而到了另外一个开发人员的电脑上就不能使用的问题”，或者是因为版本更新导致服务不可用等等，这对于运维人员来说，压力十分大，而环境配置是一个非常头疼的问题，每一个机器都需要部署环境（Redis集群、ES…）十分麻烦且费时费力，并且配置的环境不能跨平台，非常不方便。
- **应用之间的冲突（隔离性）**  
	假如我们将开发的两个应用部署到同一个服务器上，如果一个应用出了问题，导致CPU出问题上升到了100%，那么第二个应用也会受到关联；并且如果两个应用分别使用不同的语言或者技术栈，当安装在同一个服务器上的时候可能就会造成 ==各种冲突/无法兼容== ，到时候调试就非常头疼。如下图所示：

**Docker的出现解决以上问题**

- **关于环境问题解决方案**  
	Docker可以让开发者打包他们的应用以及依赖包到一个轻量级、可移植的容器中，然后发布到任何流行的 Linux 机器上，也可以实现虚拟化。将环境构建打包成一个 **镜像** 发布到网上，想要用这个环境的时候就直接拉取一份就OK了。
- **解决应用之间隔离问题**  
	Docker核心思想就是使用容器化技术， 打包装箱 ，每个箱子是互相隔离的。容器是完全使用沙箱机制，相互之间不会有任何接口（类似 iPhone 的 app）,更重要的是容器性能开销极低。如下图所示：  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/576b90295f6bd1cf0cfb69b512b54630.png#pic_center)

### 简述虚拟机和Docker容器的区别

这里引用知乎上大佬的说法： [https://www.zhihu.com/question/48174633](https://www.zhihu.com/question/48174633)  
**服务器虚拟化解决的核心问题是资源调配，而容器解决的核心问题是应用开发、测试和部署。**

- 使用Docker容器和使用虚拟机在运行多个相互隔离的应用时对比，Docker要简洁很多；
- Docker守护进程可以直接与主操作系统进行通信，为各个Docker容器分配资源；它还可以将容器与主操作系统隔离，并将各个容器互相隔离。
- 虚拟机启动需要数分钟，而Docker容器可以在数毫秒内启动。由于没有臃肿的从操作系统，Docker可以节省大量的磁盘空间以及其他系统资源。
- 虚拟机更擅长于彻底隔离整个运行环境。例如，云服务提供商通常采用虚拟机技术隔离不同的用户。而Docker通常用于隔离不同的应用，例如前端，后端以及数据库。
- 传统的虚拟机，首先是虚拟出一条硬件，运行一个完整的操作系统，然后在这个系统上安装和运行软件；
- Docker容器内的应用直接运行在宿主机的内容，容器是没有自己的内核的，也没有虚拟我们的硬件，所以就轻巧了很多；

### Docker中的DevOps（开发、运维）

（1） **应用更快速的交付和部署** ：

- 传统：一堆的帮助文档和安装程序
- Docker：打包镜像发布测试，一键运行

（2） **更快捷的升级和扩缩容**

- 使用了Docker以后我们部署应用就像搭积木一样；
- 项目打包成一个镜像

（3） **更简单的系统运维**

- 在容器话之后我们的开发、测试环境都是高度一致的

（4） **更高效的计算资源利用**

- Docker是内核级别的虚拟化，可以再一个物理机上可以运行很多的容器实例!服务器的性能可以被压榨到极致。

### Docker的基本组成

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/fbc92860be68e62f8e33e9efbd3c5140.png#pic_center)

- **镜像（image）** ：docker镜像就好比是一个模板，可以通过这个模板来创建容器服务，tomcat镜像—>run---->tomcat01容器（提供服务），通过这个镜像可以创建多个容器（最终服务运行或者项目运行就是在容器中运行的）。
- **容器（container）** ：docker利用容器技术，独立运行一个或者一组应用，通过镜像来创建的，启动、停止、删除、基本命令，目前就可以把这个容器理解为就是一个简易的Linux系统。
- **仓库（repository）** ：仓库就是存放镜像的地方，仓库分为公有仓库和私有仓库，Docker Hub（默认是国外的）、阿里云…都有容器服务器（配置镜像加速）

## Docker的安装

### 前期准备（看看即可）

不一样的话也行，主要是看Centos的版本  
**运行环境** ： 阿里云 服务器 Centos 7  
**连接工具** ：XShell 5  
**需要掌握** ： [Linux的基本命令](https://blog.csdn.net/weixin_43246215/article/details/107433456)  
由于这里的运行环境是Centos 7，与Centos 6的命令还是有一些区别的，但是区别不大，后面我会将命令详细的介绍。

**查看环境** ：

- 系统内核是3.10以上的
```
[root@oldou ~]#  uname -r
3.10.0-957.21.3.el7.x86_64
12
```
- 查看系统的版本：  
	`cat /etc/os-release`  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/4c66c9895f95040d5e4d06712bda6719.png#pic_center)

### 开始安装

这里可以参考官网的帮助文档进行安装  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/90f73a9aa6d15e78041cb4885f8080cc.png#pic_center)  
  
地址： [https://docs.docker.com/engine/install/centos/](https://docs.docker.com/engine/install/centos/)

**第一步：卸载旧版本（运行以下代码即可）**

```
yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
12345678
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/743b50af54abffcb24c3476c605dc460.png#pic_center)  
**第二步：安装yum工具包**  
**命令：** `yum install -y yum-utils`

**第三步：设置镜像仓库**

```
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo   
    # 这里默认是国外的，十分的慢，我们用以下阿里云的地址
1234
```
```
yum-config-manager \
    --add-repo \
    http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo   
    # 这是阿里云的docker镜像地址，建议使用这个 
1234
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/cc21475649e04662680d67865cb83af8.png#pic_center)  
**更新一下yum索引：**  
**命令：** `yum makecache fast`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/1a80569b6eaefb8a25df5518850e3729.png#pic_center)  
**第四步：安装Docker**  
docker-ce：社区版 ee：企业版  
**命令：** `yum install docker-ce docker-ce-cli containerd.io`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/ea4b11b084352a24b854d7eded175973.png#pic_center)  
**注意** ：以上是安装Docker最新的版本，如果想要安装指定的版本，就需要进行以下命令：  
`yum install docker-ce-<VERSION_STRING> docker-ce-cli-<VERSION_STRING> containerd.io`  
这里的 `<VERSION_STRING>` 表示版本。  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/a7d0ab286d77688e3bdd0e0423ddd712.png#pic_center)  
**第五步：启动Docker**  
**命令：** `systemctl start docker`  
**注意** ：Centos6使用的是 `service` ，而Centos7使用的都变成了 `systemctl` 。

**第六步：查看Docker是否安装成功**  
**命令：** `docker version`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/f847b2f2d6087050b81c74f8dc5388fb.png#pic_center)  
**查看Docker的状态：** `systemctl status docker`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/26bf5c11c6380485a69b1bd5317324a5.png#pic_center)  
**第七步：测试hello-word**  
**命令：** `docker run hello-world`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/436674bd19f53a694cbeedb02bd06c86.png#pic_center)  
**第八步：查看一下刚刚下载的hello-word的这个镜像**  
**命令：** `docker images`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/1639f1c8112dfa6373c28d9c68480c71.png#pic_center)

### 如何卸载Docker（了解即可）

官网中有介绍，下面我给出来：  
**第一步：卸载依赖**  
**命令：** `yum remove docker-ce docker-ce-cli containerd.io`

**第二步：删除资源 安装的资源都在/var/lib/docker目录下**  
**命令：** `rm -rf /var/lib/docker`

这样就OK了。

### 配置阿里云镜像加速

由于我们拉取镜像的时候，使用国外的下载太慢了，当然我们这里是使用国内阿里云的，所以肯定比国外的访问和下载快，这个时候再配个加速器就美滋滋。

**第一步：登录我们的阿里云控制台，然后找到容器镜像服务**  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/8a80a20b0f038de86642b7a4c22d45da.png#pic_center)  
**第二步：找到镜像加速器---->镜像加速地址**  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/5dc6d0f461ac60c7829b996f3d60ffae.png#pic_center)  
**第三步：配置使用（直接复制命令运行即可）**

（1） **在服务器中创建一个目录** ： `sudo mkdir -p /etc/docker`

（2） **编辑配置文件**

```
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://7ih0bv9h.mirror.aliyuncs.com"]
}
EOF
12345
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/f2f1e9420cf0d01b88698f1de4471d40.png#pic_center)  
（3） **将服务重启：** `sudo systemctl daemon-reload`

（4） **启动docker：** `sudo systemctl restart docker`

这样就配置完成了。

### Run的流程以及Docker原理

**回顾hello-word的流程**  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/6caa1d641bd17f26c4bb10de670e674c.png#pic_center)  
就拿我们运行hello-word来说，一开始我们运行hello-word的时候，Docker会在本机中寻找镜像，而本机中没有这个镜像，所以就回去我们配置的Hub上去下载镜像，如果找到了就将镜像下载到本地运行，如果没有就返回错误。如下所示：  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/e3d5fb50d978d8802d24c6ab244e6689.png#pic_center)  
**底层原理**

（1）Docker是怎么工作的？

- Docker是一个Client-Server结构的系统，Docker的守护进程运行在本机上（运行在后台，和mysql一样），通过Socket从客户端访问。
- DockerServer接收到Docker-Client的指令，就会执行这个命令。  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/abfbe2beb479db755f2c4c0ad0e5d575.png#pic_center)  
	（2）Docker为什么比虚拟机（VM）快？  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/27f2b7902b835040429c5c76c485dbc3.png#pic_center)
- Docker利用的是宿主机的内核，VM需要的是Guest OS  
	所以说，新建一个容器的时候，Docker不需要像虚拟机那样重新加载一个操作系统内核，避免引导，虚拟机是加载Guest OS，是分钟级别的，而Docker利用的是宿主机的操作系统，省略了这个复杂的过程。  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/f977572b30d8a434c43477dd3eeea51c.png#pic_center)

## Docker的常用命令

官方帮助文档： [https://docs.docker.com/engine/reference/run/](https://docs.docker.com/engine/reference/run/)

### 查看信息和帮助命令

**命令：** `docker version` # 查看docker的版本信息  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/2ae6a2553d1304a0e814e8458f2ab353.png#pic_center)  
**命令：** `docker info` # 显示Docker的系统信息，包括镜像和容器的数量

**命令：** `docker xxx --help` #帮助命令，可以显示docker的所有命令

### 镜像命令

**查看镜像**  
**命令：** `docker images` # 查看所有本地的主机上的镜像  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/882378505de50b7abc4c33e2e0eaa002.png#pic_center)

```
REPOSITORY  ：镜像的仓库源
TAG                     ：镜像的标签
IMAGE ID         ：镜像的ID
CERATED         ：镜像的创建时间
SIZE                 ：镜像的大小

docker  images  [可选项]
-a    ， --all        # 列出所有镜像
-q       ， --quiet    # 只显示镜像的ID
123456789
```

**搜索镜像**  
**命令：** `docker search 镜像名` # 搜索镜像

```
可选项，通过搜过过滤
 --filter-STARS=3000   #搜索出来的镜像修饰STARS大于3000的
12
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/063236ef24f6031c56859e33d74168a1.png#pic_center)  
**下载镜像**  
**命令：** `docker pull 镜像名 [:tag]` # 下载镜像，默认是下载最新版 latest 。  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/bc2e9d0d8a6aec3b802882ebb69b63c1.png#pic_center)  
如果是下载指定版本的镜像，那么就需要指定`:版本号` ，如下所示：  
`docker pull mysql:5.7` # 指定版本下载 下载mysql5.7

**删除镜像**

```
# 删除镜像  -f就是全部删除，后面的条件是根据什么来删除，这里是根据容器的id进行删除
docker  rmi -f  容器id   

# 删除多个镜像
docker  rmi -f  容器id  容器id 容器id    

# 删除所有的镜像 
docker  rmi -f $(docker images -aq)  
12345678
```

### 容器命令

**说明** ：我们有了镜像才可以去创建容器， Linux ，下载一个centos镜像来进行学习。

**下载centos镜像**  
**命令：** `docker pull centos`

**新建容器并启动**  
**命令：** `docker run [可选参数] image`

```
参数说明：
--name="Name" ： 容器名字 ，tomcat01、tomcat02，用来区分容器
-d ：后台方式运行                                
-it：使用交互方式运行，进入容器查看内容
-p ：指定容器的端口   -p  8080:8080  
        -p     ip:主机端口:容器端口                                
        -p     主机端口：容器端口（常用方式）
        -p     容器端口                                                     
        容器端口                                                             
-p： 随机指定端口     
12345678910
```

**测试，启动并进入容器**  
**命令：** `docker run -it centos /bin/bash` #启动容器  
**命令：** `ls` # 查看容器内的centos，基础版本，很多命令都是不完善的  
**命令：** `exit` # 从容器中退回到主机

**列出所有运行中的容器**  
**命令：** `docker ps [可选参数]` # 列出当前正在运行的程序

```
-a             #列出当前正在运行的容器+带出历史运行过的容器
-n=？      #显示最近创建的容器  
-p            #只显示容器的编号
123
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/4a89e55da5166b083f13bea2519130e6.png#pic_center)

**退出容器**  
**命令：**

```
exit                     # 直接停止容器并退出
Ctrl + P + Q             # 容器不停止退出
12
```

**删除容器**

```
docker rm  容器id        # 删除指定的容器，不能删除正在运行的容器
docker rm -f $(docker ps -aq)       # 删除所有的容器   
docker ps -a -q|xargs docker rm     # 删除所有的容器
123
```

**启动和容器的操作**

```
docker start 容器id                  # 启动容器
docker restart 容器id                # 重启容器
docker stop 容器id                   # 停止正在运行的容器
docker kill 容器id                   # 强制停止当前正在运行的容器 
1234
```

### 常用的其他命令

#### 后台启动容器

**命令：** `docker run -d 镜像名`

```
docker run -d centos            # 后台启动centos
1
```
- 问题：使用 `docker ps` 查看，发现 centos停止了
- 常见的坑：docker容器使用后台运行的时候就必须要一个前台线程，不然docker发现没有应用就会自动停止
- 例如：nginx容器启动后，发现自己没有提供服务就会立刻停止，就是没有程序了。

#### 查看系统CPU状态

**命令：** `docker stats [容器id]`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/65a49921ed56a2bc4b1611d1070c98ab.png#pic_center)

#### 查看日志

**命令：** `docker logs -tf --tail 容器` ，没有日志

- 编写一段shell脚本
```
docker run -d centos /bin/sh -c "while true; do echo oldouTest;sleep 1;done"
1
```
- 使用 `docker ps` 去查看
- 显示日志 ： `docker logs -tf --tail number 容器id`
```
-tf                  #显示日志
--tail number        #要显示日志条数 

例如：docker logs -tf --tail 10 容器id
1234
```

#### 查看容器中进程信息

**命令：** `docker top 容器id`

#### 查看镜像中的元数据

**命令：** `docker inspect 容器id`

#### 进入当前正在运行的容器

我们的容器通常都是使用后台方式运行的，需要进入容器，修改一些配置  
**方式一：**  
**命令：** `docker exec -it 容器id bashShell`  
例如：docker exec -it bb6ddb943ea5 /bin/bash  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/5838e5032f3b08125e0f9c12fb690ce9.png#pic_center)  
**方式二：**  
**命令：** `docker attach 容器id`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/0727640e3c0ce9026fc10228c42e9db0.png#pic_center)  
**两种方式的对比** ：

- `docker exec` ： 进入容器后开启一个新的终端，可以在里面操作（常用）
- `docker attach` ：进入容器正在执行的终端，不会启动新的进程

#### 从容器中拷贝文件到主机上

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/b6dddeb2c52779de9cf954ed3bfc0747.png#pic_center)

```
# 进入到容器内：
[root@oldou home]# docker exec -it bb6ddb943ea5 /bin/bash  
[root@bb6ddb943ea5 /]# cd home
[root@bb6ddb943ea5 home]# ls

# 创建一个java文件
[root@bb6ddb943ea5 home]# touch Test.java 
[root@bb6ddb943ea5 home]# ls
Test.java

# 退出容器回到主机
[root@bb6ddb943ea5 home]# exit
exit

#查看当前运行的容器
[root@oldou home]# docker ps

# 将容器内/home目录下的Test.java文件拷贝到主机的home目录下
[root@oldou home]# docker cp bb6ddb943ea5:/home/Test.java /home
[root@oldou home]# ls
Test.java
123456789101112131415161718192021
```

拷贝只是一个手动的过程，后面学习了 -v 卷的技术时，可以实现同步数据

## 常用命令小结

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/20462e0cef186c518ef32552ee9528ae.png#pic_center)

| 命令 | 英文描述 | 中文意思 |
| --- | --- | --- |
| `attach` | Attach to a running container | 当前shell下attach连接指定运行镜像 |
| `build` | Build an image from a Dockerfile | 通过Dockerfile定制镜像 |
| `commit` | Create a new image from a container changes | 提交当前容器为新的境像 |
| `cp` | copy files/folders from the containers filesystem to the host path | 从容器中拷贝指定文件或者目录到宿主机中 |
| `create` | Create a new container | 创建一个新的容器，同run.但不启动容器 |
| `diff` | Inspect changes on a container’s filesystem | 查看docker容器变化 |
| `events` | Get real time events from the server | 从docker服务中获取容器实时事件 |
| `export` | Stream the contents of a container as a tar archive | 导出容器的内容流作为一个 tar归档文件\[对应import\] |
| `history` | Show the history of an image | 展示一个境像形成历史 |
| `images` | List images | 列出系统当前所有镜像 |
| `import` | Create a new filesystem image from the contents of a tarball | 从tar包中的内容创建一个新的文件系统映像\[对应export\] |
| `info` | Display system-wide information | 显示系统相关信息 |
| `inspect` | Return low-level information on a container | 查看容器详细信息 |
| `kill` | Kill a running container | kill指定docker容器 |
| `load` | Load an image from a tar archive | 从—个 tar包中加载一个镜像\[对应save\] |
| `login` | Register or Login to the docker registry server | 注册或者登陆一个docker源服务器 |
| `logout` | Log out from a Docker registry server | 从当前Docker registry退出 |
| `logs` | Fetch the logs of a container | 输出当前容器日志信息 |
| `port` | Lookup the public-facing port which is NAT-ed to PRIVATE\_PORT | 查看映射端口对应的容器内部源端 |
| `pause` | Pause all processes within a container | 暂停容器 |
| `ps` | List containers | 列出容器列表 |
| `pull` | Pull an image or a repository from the docker registry server | 从docker镜像服务器中拉取指定镜像或者库镜像 |
| `push` | push an image or a repository to the docker registry server | 推送指定镜像或者库镜像至docker源服务器 |
| `restart` | Restart a running container | 重启运行的容器 |
| `rm` | Remove one or more containers | 移除—个或者多个容器 |
| `rmi` | Remove one or more images | 移除一个或多个境像\[无容器使用该镜像才可删除，否则需删除相关容器才可能继续或者 -f 强制删除 |
| `run` | Run a command in a new container | 创建—个新的容器并运行一个命令 |
| `save` | Save an image to a tar arehive | 保存一个镜像为—个tar包「对应load\] |
| `search` | Search for an image on the Docker Hub | 在docker hub中搜索镜像 |
| `start` | start a stopped containers | 启动容器 |
| `stop` | stop a stopped containers | 停止容器 |
| `tag` | Tag an image into a repository | 给源中镜像打标签 |
| `top` | Lookup the running processes of a container | 查看容器中运行的进程信息 |
| `unpause` | Unpause a paused container | 取消暂停容器 |
| `version` | show the docker version information | 查看docker版本号 |
| `wait` | Block until a container stops，then print its exit code | 截取容器停止时的退出状态值 |

## 练习

### 练习一：使用Docker安装Nginx

官网： [https://hub.docker.com/\_/nginx](https://hub.docker.com/_/nginx)

**第一步：搜索镜像（这里建议去docker Hub上查找一下版本信息，上面还有帮助文档介绍）**  
**命令：** `docker search nginx`

**第二步：下载镜像**  
**命令：** `docker pull nginx`

**第三步：查看镜像并且启动**  
**命令：** `docker images # 查看所有镜像`

\*\* **命令：** `docker run -d --name nginx01 -p 3344:80 nginx`

```
-d 表示后台运行，--name 表示给容器起名字，而nginx01表示起的名字，
-p 宿主机端口 ：容器内部端口

后面的3344表示主机开发的3344端口，80表示容器内部的端口，这里表示将80端口映射到外部的3344，
可以通过公网的3344访问到docker里面的80端口，后面的nginx表示的是镜像名字。
12345
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/de7d8bbf9c47aa941227c35026634789.png#pic_center)  
**第四步：查看容器并且运行测试**  
**命令：** `docker ps` #查看是否启动  
**命令：** `curl localhost:3344`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/ebb5cd9ccf482a36a7b05e924335f137.png#pic_center)  
**关闭防火墙** ： `systemctl stop firewalld`

到这一步的时候我们就可以使用 公网ip:3344 在浏览器访问了  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/849199f399e1f3cf9783f87acdb7a527.png#pic_center)  
**第五步：进入Nginx容器**  
**命令：** `docker exec -it nginx01 /bin/bash` #进入容器

**命令：** `whereis nginx`

**命令：** `cd /etc/nginx`

**命令：** `ls查看`

**命令：** `exit #退出`

**命令：** `docker stop 容器id` #停止Nginx容器  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/89cbaaaf096d1ebcd25775d3e15461df.png#pic_center)  
**端口暴露的概念：**  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/37b09d3c4cd2015d4026bc1172930585.png#pic_center)  
**思考问题** ：我们每次改动nginx配置文件，都需要进入容器内部？十分的麻烦，我要是可以在容器外部提供一个映射路径，达到在容器修改文件名，容器内部就可以自动修改？  
使用 -v数据卷。

### 练习二：使用Docker部署Tomcat

官网： [https://hub.docker.com/\_/tomcat](https://hub.docker.com/_/tomcat)

**方式一：**

- **官方给出的命令：**  
	`docker run -it --rm tomcat:9.0` # 下载并启动  
	上面介绍Nginx的启动都是后台启动，停止了容器以后，容器还是可以查到，并且占用着配置的端口。  
	**使用官方给出的 `docker run -it --rm tomcat:9.0` ，一般用于测试，用完停止就删除** 。

**方式二：**  
还是使用之前的方式。

- **第一步：搜索镜像（这里建议去docker Hub上查找一下版本信息，上面还有帮助文档介绍）**  
	**命令：** `docker search tomcat`
- **第二步：下载镜像**  
	**命令：** `docker pull tomcat` # 这是下载最新版的tomcat  
	**命令：** `docker pull tomcat:7.0` # 指定版本号
- **第三步：查看镜像并且启动**  
	**命令：** `docker images` # 查看所有镜像  
	**命令：** `docker run -d --name tomcat01 -p 3355:8080 tomcat:7.0`
```
-d 表示后台运行，--name 表示给容器起名字，而tomcat01表示起的名字，
-p 宿主机端口 ：容器内部端口

后面的3355表示主机开发的3355端口，8080表示容器内部的端口，这里表示将8080端口映射到外部的3355，
可以通过公网的3355访问到docker里面的8080端口，后面的tomcat表示的是镜像名字。
12345
```

我们这个时候去浏览器访问发现，报了404异常，那我们进入到tomcat容器内部查看一下原因.

- **第四步：进入容器查看原因**  
	**命令：** `docker exec -it tomcat01 /bin/bash`  
	当我们使用 `ll` 命令时竟然不能使用，只能使用 `ls` 命令查看，同时进入到webapps目录下发现这个目录竟然是空的。

**发现问题：**  
1、Linux的命令少了；  
2、webapps目录下没有文件；

**原因：**  
阿里云的镜像默认是最小的镜像，它把所有不必要的都剔除掉了。保证最小可运行的环境。

**解决办法：**  
在tomcat目录下有一个 `webapps.dist` 目录，这个目录下有我们所需要的文件，也就是webapps目录所需要的文件，我们将这个文件中的内容全部拷贝到webapps下。

- **第五步：拷贝资源**  
	**命令：** `cp -r webapps.dist/* webapps`

这样我们再去浏览器中去访问就可以访问到了。

**思考问题** ：我们以后要部署项目，如果每次都要进入容器是不是十分麻烦？要是可以在容器外部提供一个映射路径，webapps,我们在外部放置项目，就自动同步到内部就好了!

### 练习三：使用Docker部署Elasticsearch、Kibana

由于暂时没有学过Elasticsearch，所以暂时没有做这个部分的笔记，只是暂时看了一遍，后续补上…

【2020.10.06 02:52更新】

## Docker镜像原理

### 镜像是什么？

镜像是一种轻量级的、可执行的独立软件包，用来打包软件运行环境和基于运行环境开发的软件，它包含运行某个软件所需要的所有内容，包括代码、运行时、库、环境变量和配置文件等等。

### 如何得到镜像？

- 从远程仓库下载镜像
- 从朋友那里拷贝镜像
- 自己制作一个镜像

### Docker镜像加载原理

**（1）UnionFS（联合文件系统）**  
UnionFS（联合文件系统）：Union文件系统是一种分层、轻量级并且高性能的文件系统，它支持对文件系统的修改作为一次提交来一层层的叠加，同时可以讲不同目录挂载到同一个虚拟文件系统下（unite several directories into a single virtual filesystem）。 Union文件系统是Docker镜像的基础 。镜像可以通过分层来进行集成，基于基础镜像（没有父镜像），可以制作各种具体的应用镜像。

（2） **Docker镜像加载原理**

- docker的镜像实际上由一层一层的文件系统组成，这种层级的文件系统叫做 `UnionFS`.
- `bootfs(boot file system)` 主要包含bootloader和kernel，bootloader主要是引导加载kernel，Linux刚启动时会加载bootfs文件系统，在Docker镜像的最底层是bootfs。这一层与我们典型的Linux/Unix系统是一样的，包含boot加载器和内核。当boot加载完成之后整个内核就都在内存中了，此时内存的使用权已由bootfs转交给内核，此时系统也会卸载bootfs。
- `rootfs (root file system)` ，在bootfs之上。包含的就是典型Linux系统中的/dev，/proc， /bin，letc等标准目录和文件。rootfs就是各种不同的操作系统发行版，比如Ubuntu，Centos等等。|  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/5cc8b2c25478ada3cbdb64512f7a708c.png#pic_center)  
	**提问** ：平时我们安装虚拟机的Centos都是好几个G的，为什么Docker里面的Centos镜像只有200M左右呢？  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/e9d07f9fac6c8d87ca552b2974d2e010.png#pic_center)  
	**回答** ：对于一个精简的OS， rootfs 可以很小，只需要包含最基本的命令，工具和程序库就可以了，因为底层直接用Host的kernel，自己只需要提供rootfs就可以了。由此可见对于不同的linux发行版, bootfs基本是一致的, rootfs会有差别，因此不同的发行版可以公用bootfs.

**虚拟机是分钟级别的，而容器是秒级别的，区别就是因为以上解释。**

### 镜像原理之分层理解

**（1）分层的镜像**  
当我们去下载一个镜像的时候，注意观察下载的日志输出，可以看到的是镜像是一层一层的下载的，如下所示：  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/0bfd9c9fe1d435edfc98a916a50eaf64.png#pic_center)  
**思考** ：为什么Docker镜像要采用这种分层的结构呢？

- 最大的好处就是资源共享，例如多个镜像都是从相同的Base镜像构建而来的，那么 ==宿主机只需要在磁盘上保留一份base镜像，同时内存中也只需要加载一份base镜像，这样就可以为所有的容器服务卡，而且每一层都可以被共享== 。就像上图中的第一项，就是base镜像，说明已经存在该镜像了，所以就不需要下载了。

而查看镜像分层的方式我们可以通过 `docker image inspect` 命令去查看

**理解：**  
**所有的Docker镜像都起始于一个基础镜像层，当进行修改或增加新的内容时，就会在当前镜像层之上，创建新的镜像层。**

举一个简单的例子，假如基于Ubuntu Linux 16.04创建一个新的镜像，这就是新镜像的第一层；如果在该镜像中添加Python包，就会在基础镜像层之上创建第二个镜像层；如果继续添加一个安全补丁，就会创建第三个镜像层。  
该镜像当前已经包含3个镜像层，如下图所示(这只是一个用于演示的很简单的例子）。  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/e7abb3236d27664c427d5014c6c00a1e.png#pic_center)  
在添加额外的镜像层的同时，镜像始终保持是当前所有镜像的组合，理解这一点非常重要。下图中举了一个简单的例子，每个镜像层包含3个文件，而镜像包含了来自两个镜像层的6个文件。  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/f4c9f2fc732970e382ee23b41a40f19b.png#pic_center)  
下图中展示了一个稍微复杂的三层镜像，在外部看来整个镜像只有6个文件，这是因为最上层中的文件7是文件5的一个更新版本。  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/7c0d01afe8b52a7ea9470ec9896d7c88.png#pic_center)

- 这种情况下，上层镜像层中的文件覆盖了底层镜像层中的文件。这样就使得文件的更新版本作为一个新镜像层添加到镜像当中。
- Docker通过存储引擎（新版本采用快照机制)的方式来实现镜像层堆栈，并保证多镜像层对外展示为统一的文件系统。
- Linux上可用的存储引擎有AUFS、Overlay2、Device Mapper、Btrfs以及ZFS。顾名思义，每种存储引擎都基于Linux中对应的文件系统或者块设备技术，并且每种存储引擎都有其独有的性能特点。
- Docker在Windows上仅支持windowsfilter一种存储引擎，该引擎基于NTFS文件系统之上实现了分层和CoW\[1\]。

下图展示了与系统显示相同的三层镜像。所有镜像层堆叠并合并，对外提供统一的视图。  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/be73fdcc4451fe722c1173ea24183ff5.png#pic_center)

**特点**  
Docker镜像都是只读的，当容器启动时，一个新的可写层被加载到镜像的顶部，这一次就是我们通常说的容器层，容器之下的都叫镜像层。  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/7b75ffb9d131175115bd18e0a2dcd1b3.png#pic_center)

## Commit镜像（如何提交一个自己的镜像）

**命令：** `docker commit` #提交一个新的副本  
**命令和git原理类似**  
格式为： `docker commit -m="提交的描述信息" -a="作者" 容器id 目标镜像名:[TAG版本号]`

**练习** ：封装一个Tomcat镜像

```
# 1、启动一个默认的tomcat；
# 2、发现这个默认的tomcat是没有webapps应用，镜像的原因，官方的镜像默认webapps下面是没有文件的；
# 3、我自己拷贝进去了基本的文件；

注意：前面三步不熟悉的话可以看上面的tomcat练习。

# 4、将我们操作过的容器通过commit提交为一个镜像!我们以后就使用我们修改过的镜像即可，这就是我们自己的一个修改的镜像
命令：docker commit -a="oldou" -m="add webapps app" 容器的ID tomcat02:版本号
12345678
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/8a66a128e41c2010a45a8c67b37a107b.png#pic_center)  
如果想要保存当前容器的状态，那么就可以通过 `commit` 来进行提交，获取一个镜像，这就好比VM的快照。

## 注意

**学到这里的时候，才算入门Docker，接下来想要对Docker了解更深，就继续往后学吧。**

---

## Docker容器数据卷的使用

### 什么是容器数据卷？

**Docker的理念回顾** ：将应用和环境打包成一个镜像，如果数据都在容器中，那么当我们容器被删除的时候，数据就会丢失。【 需求：数据可以持久化 】。假如MYSQL数据库，如果容器被删除了，那么数据库内的数据就会丢失，因此我们希望： MySQL数据库中的数据可以存储在本地 。

容器之间可以有一个数据共享的技术，Docker容器中产生的数据可以同步到本地。这就是卷技术，目录的挂载：就是将容器内的目录挂载到Linux上面。  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/f0e3fefe1ce1968eae95550d1e4a82d0.png#pic_center)  
**总结：容器的持久化和同步操作，容器间也是数据共享的。**

### 如何使用数据卷？

**方式一：直接使用命令来挂载 -v**  
**命令格式：** `docker run -it -v 主机目录 : 容器内目录`

**测试**

- 第一步：我们使用以下命令连接容器，并且将Linux的/home/ceshi目录和容器内的/home目录连接起来，如果没有ceshi目录就会自动创建一个。  
	**命令：** `docker run -it -v /home/ceshi:/home centos /bin/bash`  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/afe842db0c8ae8d9acb1752e62778e09.png#pic_center)  
	做完以上的操作，这个时候我们在容器内对 `/home` 目录下的操作会被同步到Linux的 `/home/ceshi` 目录下
- 第二步：当容器启动起来的时候，我们在Linux的操作命令窗口处通过 `docker inspect 容器id` 去查看卷的挂载信息  
	**命令：** `docker inspect centos容器的id`  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/f9184f5e4c99e6bb3cd13f866157fdf8.png#pic_center)  
	以上两个目录的数据会进行同步，例如我在主机内的ceshi目录下做一些操作【增、删、改等等】会同步到docker容器内的home目录下。

**注意** ：如果没有上图中的这个挂载项，就说明挂载失败了，重新再挂载一下。下面我们进行数据同步测试。

### 测试文件同步

**1、测试容器中的数据会不会同步到主机中**  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/88d70760614bca209b9a283758b4a116.png#pic_center)  
**测试内容** ：我们在容器内的home目录下创建一个test.java文件，然后我们在主机内的/home/ceshi目录下查看是否有这个文件。  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/6d0e83349555bd5eca35d85f4f0f4b91.png#pic_center)  
**结果证明** ，我们在容器中做了一个添加test.java文件的操作，数据会被同步到主机的对应目录下，这就是双向绑定。

**2、测试主机中的数据会不会同步到容器中**

- 我们先停止容器  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/c4915d0cf4c73367a84bf4a8a250bb54.png#pic_center)
- 在主机上修改test.java文件内容【vim test.java】  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/7269817c691cfe0b94fcacb6c6eeb119.png#pic_center)
- 启动容器  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/16c9fbf50d4d41d09a6c731ffd2351ac.png#pic_center)  
	**结果证明了，容器内的数据依旧是同步的。**

好处：我们以后修改只需要在本地修改即可，容器内会自动同步!【2020.10.07 15:54更新】

### 实战：MySQL同步数据

我们来实现一下将MySQL容器中的数据同步到我们的Linux中，同时实现用Windows电脑上的Navicat连接上Linux上的MySQL容器。

官网： [https://hub.docker.com/\_/mysql](https://hub.docker.com/_/mysql)

思考：Mysql的数据持久化的问题

- **第一步：获取镜像，这里以mysql5.7为例**  
	**命令：** `docker pull mysql:5.7`  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/9da2170ba9c0794679903085edc7b817.png#pic_center)  
	然后开两个窗口：  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/dd2134ca2010338dce960f65aad25cbe.png#pic_center)
- **第二步：运行容器，需要做数据挂载，同时安装MySQL需要配置密码**  
	官方给出的测试代码： `docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:tag` 【参考】

**运行命令：** `docker run -d -p 3310:3306 -v /home/mysql/conf:/etc/mysql/conf.d -v /home/mysql/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 --name mysql01 mysql:5.7`

```
-d           表示后台运行
 -p           表示端口映射
 -v           表示卷挂载
 -e           表示环境配置
 --name       表示容器名字
12345
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/b3b54fb068309d3f50145cdc31c7a385.png#pic_center)  
**另开一个窗口进行查看**  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/564cf9ba833fe4db1aec95911d4b8589.png#pic_center)

- **第三步：启动成功以后我们在本地使用Navicat连接测试一下**  
	【注意：Navicat —> 连接到服务器的3310 ----> 3310 和 容器内的3306映射 ---- > 这个时候就连接成功了】  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/c633c9d05a32cb7002856f6033283895.png#pic_center)  
	【注意】如果连接失败，记得去查看一下是不是防火墙没关【systemctl stop firewalld】或者是服务器的安全组3310端口没配置。
- **第四步：在本地创建一个数据库进行测试，查看一下我们映射的路径是否OK。**  
	原先的主机数据库目录：  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/3f48f475f696449ec99ab291e26a52f2.png#pic_center)  
	然后我在Navicat上创建了这个数据库  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/2de12072b91425a037fdfb9354c93a05.png#pic_center)  
	再次查看：  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/0ac72b134d00a83bcefdfb52018afbd5.png#pic_center)  
	发现数据已经挂载到本地了，测试OK。
- **第五步：假如我们将mysql干掉会怎么样？数据还能不能同步？**  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/fc3122c18b78a4feaa746ee535a7d26b.png#pic_center)  
	我们再去另外一个窗口看看我们的数据  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/8e3d0b03166d24784401d2f59f3af16c.png#pic_center)  
	我们发现挂载到本地的数据卷依旧没有丢失，这就实现了容器数据持久化功能!

## 具名挂载和匿名挂载

### 匿名挂载

通过【 `-v 容器内路径` 】 而没有指定卷名或者指定主机路径的挂载方式  
运行以下命令【注意：需要将本机已下载的nginx镜像删除】  
**命令：** `docker run -d -P --name nginx02 -v /etc/nginx nginx`

同时通过docker volume --help查看一下卷的帮助文档  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/86be7e27641a5f9cf726479c8b6b3adf.png#pic_center)  
分别是：创建卷、查看卷、查看所有的卷、移除卷、移除卷

我们使用以下命令查看一下所有本地的volume【卷】信息：  
**命令：** `docker volume ls`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/f9411d299c1736678f26af6e23b23ca4.png#pic_center)  
通过以上我们发现，我们刚刚创建的匿名卷挂载，就是没有给它起名字，这是因为我们在运行的时候只指定了容器内的路径而没有指定容器外的路径和卷名，这里发现，这种就是匿名挂载，我们在-v只写了容器内的路径，没有写容器外的路径!

### 具名挂载

通过【 `-v 卷名:容器内路径` 】 而没有指定主机路径的挂载方式  
运行以下命令  
**命令：** `docker run -d -P --name nginx03 -v juming-nginx:/etc/nginx nginx`

我们使用以下命令查看一下所有本地的volume【卷】信息：  
**命令：** `docker volume ls`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/6eaa3045c6e150adb749db6ba01bacb5.png#pic_center)  
我们通过【 `docker volume inspect juming-nginx` 】命令查看一下这个卷的详细信息  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/880ef44b39bec2df51183d96c36804b2.png#pic_center)  
我们发现所有的docker容器内的卷，在没有指定目录的情况下都是在 `/var/lib/docker/volumes/xxxx/_data`

**通过具名挂载可以方便的找到我们的一个卷，大多数情况在使用的 具名挂载**

```
# 如何锁定是具名挂载还是匿名挂载，还是指定路径挂载

 -v  容器内路径                    # 匿名挂载
 -v  卷名:容器内路径                # 具名挂载
 -v  /宿主机路径:容器内路径          #指定路径挂载
12345
```

### 扩展

```
# 通过 -v 容器内路径：ro    rw   改变读写权限
ro      readonly         # 只读
rw     readwrite        # 可读可写

# 一旦设置了容器权限，容器对我们挂载出咯哎的内容就会有限定了
docker run -d  -p --name  nginx02  -v  juming-nginx:/etc/nginx:ro  nginx
docker run -d  -p --name  nginx02  -v  juming-nginx:/etc/nginx:rw  nginx 

# ro 只要看到ro就说明这个路径只能通过宿主机来操作，容器内部是无法操作的。
123456789
```

## 数据卷之初识Dockerfile（方式二）

Dockerfile就是用来创建docker镜像的构建文件，是一个命令脚本，下面我们来初步体验一下Dockerfile。

通过这个脚本可以生成镜像，镜像是一层一层的，脚本也是一个一个的命令，每个命令都是一层。

- **第一步：在home目录下创建一个docker-test-volume目录用于存放脚本测试文件**
```
命令：mkdir docker-test-volume     # 创建一个目录
命令：cd docker-test-volume          # 进入该目录

# 创建一个dockerfile文件，名字可以随意，建议Dockerfile
命令：vim Dockerfile01                   # 编写脚本 

# 文件中的内容，指令需要大写
FROM  centos                       # 用什么作为基础

VOLUME  ["volume01","volume02"]    # 挂载卷的目录，这里没有指定

CMD echo "-------end-------"       # 生成完之后发一段消息

CMD /bin/bash                      # 生成完之后默认是走的控制台

# 这里的每个命令就是镜像的一层
12345678910111213141516
```

查看一下文件的内容：【 `cat dockerfile01` 】  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/b197e32ad0e3cdb525b5f15ad9f0b978.png#pic_center)

- **第二步：构建脚本生成镜像**  
	**命令：** `docker build -f /home/docker-test-volume/dockerfile01 -t oldou/centos:1.0 .`
```
-f   通过什么文件来构建，后面接构建文件的地址
-t   生成文件的版本
12
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/20e4cd0bda2504be6794917cc3c253ae.png#pic_center)

- **第三步：启动自己的容器**  
	**命令：** `docker run -it db89686baa5c /bin/bash`  
	命令： `ls -l`  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/84115e4fea01e7cb124e6ce951dc4d31.png#pic_center)  
	我们在编写脚本时什么都没写，所以挂载方式为匿名挂载，而这个卷和外部有一个同步的目录，我们去查看一下。  
	我们现在容器内创建一个文件：  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/a65edc6b270f5ec457e470888326382c.png#pic_center)  
	然后进行后续操作。
- **第四步：查看一下卷挂载的路径**  
	**命令：** `docker ps` # 先查看一下启动的id  
	**命令：** `docker inspect 7a9c7b088444` # 根据容器启动的ID查看信息  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/3640223fb7a876351a4fd9d1eddfcde8.png#pic_center)
- **第五步：进入这个路径查看一下卷信息**  
	**命令：** `cd /var/lib/docker/volumes/642be56674ca60230a61455cdb8b06e8968ea7dd11236129a906c1cafaa7fe73/_data`  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/1ac60e3b6442106c330c54d1e0e169eb.png#pic_center)  
	刚刚在容器内创建的文件已经在主机中同步了。测试OK。

**结论** ： **Dockerfile这种方式的使用非常多见** ，因为我们通常会构建自己的镜像。假如我们构建镜像的时候没有挂载卷，这个时候就需要手动镜像挂载，就需要使用【 `-v 卷名:容器内路径` 】

## 数据卷容器

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/2729a3f449c9b1f32505c27d91914604.png#pic_center)  
这里的 `centos02 --volumes-from centos01` 就相当于 `son extends father`

这里的笔记正在完善中，请稍等…

**结论**:

- 容器之间配置信息的传递，数据卷容器的生命周期一直持续到没有容器使用为止。
- 一旦你持久化到了本地，这个时候，本地的数据是不会删除的!

## DockerFile的学习

### Dockerfile的介绍

Dockerfile是用来构建dokcer镜像的文件，是一个命令参数脚本。  
构建步骤∶

- 1、编写一个dockerfile文件
- 2、docker build构建成为一个镜像
- 3、docker run运行镜像
- 4、docker push发布镜像（DockerHub、阿里云镜像仓库）

例如Centos 7的镜像就是一个 [GitHub地址](https://github.com/CentOS/sig-cloud-instance-images/blob/f2788ce41161326a18420913b0195d1c6cfa1581/docker/Dockerfile) ：  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/3fcc36de3dab8d5c4f28f0fc40d0f6d4.png#pic_center)  
很多官方的镜像都是基础包，很多功能都没有，我们通常会自己搭建自己的镜像。  
官方既然可以制作镜像，那么我们也可以去构建自己的镜像。

### DockerFile 的构建过程

所需知识：

- 每个保留关键字（指令）都必须是大写字母；
- 执行顺序是从上往下依次执行；
- `#` 表示注释；
- 每一个指令都会创建提交一个新的镜像层，并提交。  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/4465d7a64cb0796bc48043090dec0d04.png#pic_center)

Dockerfile是面向开发的，我们以后要发布项目，做镜像，就需要编写dockfile文件，这个文件十分简单。  
Docker镜像逐渐成为企业交付的标准，因此必须要掌握。

**步骤：开发、部署、运维…缺一不可**

- Dockerfile ：构建文件，定义了一切步骤，源代码；
- DockerImages ：通过Dockerfile构建生成的镜像，最终发布和运行的产品；
- Docker容器：容器就是镜像运行起来提供服务器。

### Dockfile的指令

- `FROM` ：指定基础镜像，一切都是从这里开始构建
- `MAINTAINER` ：指定维护者信息【镜像是谁写的，姓名+邮箱】
- `RUN` ：镜像构建的时候需要运行的命令【你想要镜像做一些什么】
- `ADD` ：步骤，添加内容
- `WORKDIR` ：镜像的工作目录
- `VOLUME` ：挂载的目录
- `EXPOSE` ：保留端口配置
- `CMD` ：指定这个容器启动的时候要运行的命令，只有最后一个会生效，可被替代
- `ENTRYPOINT` ：指定这个容器启动的时候要运行的命令，可以追加命令
- `ONBUILD` ：当构建一个被继承，DockerFile 这个时候就会运行 ONBUILD 的指令，触发指令
- `COPY` ：类似ADD，将我们文件拷贝到镜像中
- `ENV` ：构建的时候设置环境变量

以前的话我们都是用的别人的镜像，现在我们知道了这些指令以后就开始自己来制作一个镜像。

### 实战：构建自己的Centos

Docker Hub中99%镜像都是从这个基础镜像过来的【FROM scratch】，然后配置需要的软件和配置来进行的构建。  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/9315d12b46fdb3112bd5da612246631c.png#pic_center)  
**创建一个自己的centos**  
官方给出的centos中是没有pwd、ifconfig、vim这些命令的，下面我们在官方给出的centos镜像中添加这三个功能。  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/ebf300ebeabdc419bfecf430b1439d8a.png#pic_center)  
**第一步：在home目录下创建一个dockerfile，然后进入这个目录，后面我们就在这个目录下进行文件的书写**  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/e7cdefadeb598374fbd1a5bee7ebc9fa.png#pic_center)  
**第二步：书写mydockfile-centos，这里我们是以官网中的centos为基础，再自己追加一些功能**

```
命令：vim mydockerfile-centos

# 书写内容

FROM centos                # 基于本地的centos，如果没有就会去下载
MAINTAINER oldou<itoldou@foxmail.com>   # 写作者，邮件

ENV MYPATH /usr/local        # 设置环境变量
WORKDIR $MYPATH           # 配置登录进行的路径，引用上面配置的

RUN yum -y install vim            # 安装vim
RUN yum -y install net-tools    # 安装网络工具

EXPOSE 80                              # 暴露80端口

# 打印信息
CMD echo $MYPATH
CMD echo "--------END---------"

# 使用bash
CMD /bin/bash
123456789101112131415161718192021
```

**第三步：通过文件构建镜像，命令格式：【 `docker build -f dockerfile文件路径 -t 镜像名:[tag]` 】**

**命令：** `docker build -f mydockerfile-centos -t mycentos:0.1 .`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/8c5af297817d8288f4e667e0ad8be224.png#pic_center)  
**第四步：测试运行**

- 先使用 docker images 查看一下  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/36241326b668fbc972e0c0dcf08b8562.png#pic_center)
- **命令：** `docker run -it mycentos:0.1`  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/440ef074b5fbdbfba7980721596b84c0.png#pic_center)  
	对比之前的，我们添加了扩展以后ifconfig、pwd还有vim都可以使用了。

**第五步：列出本地进行的变更历史**  
**命令格式：** `docker history 镜像id`  
【 **注意** 】这里的镜像id是使用 `docker images` 命令查看出来的  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/8bfa4f03bc1b54e98d4ef1bef5e32591.png#pic_center)  
我们还可以通过【docker history 镜像id】这个命令去查看官方的镜像的信息，例如mysql  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/6c4b14ae48bd003fbf62ee0153d2b21a.png#pic_center)  
上面有别人设置的指令信息。

### CMD 和 ENTRYPOINT区别【了解】

- CMD： 指定这个容器启动的时候要运行的命令，只有最后一个会生效，可被替代
- ENTRYPOINT： 指定这个容器启动的时候要运行的命令，可以追加命令

**测试CMD**  
我们创建一个dockerfile-cmd-test文件  
**命令：** `vim dockerfile-cmd-test`  
【内容】

```
FROM centos
CMD ["ls","-a"]    # 增加一个命令 ls -a
12
```

构建命令： `docker build -f dockerfile-cmd-test -t cmdtest .`  
运行命令： `docker run 6365965c094f`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/21978e46b503e5fad0acc937c51cc3ba.png#pic_center)  
run运行，我们发现【 ls -a 】命令生效

**【测试】我们追加一个命令参数 -l 相当于 ls -al**

```shell
[root@oldou dockerfile]# docker run 6365965c094f -l
docker: Error response from daemon: OCI runtime create failed: container_linux.go:349: 
starting container process caused "exec: \"-l\": executable file not found in $PATH": unknown.
shell123
```

**【结论】cmd的情况下，-l 替换了 CMD \[“ls”,"-a"\] 命令，而-l不是命令所以报错。**

**测试ENTRYPOINT**

```
我们创建一个dockerfile-cmd-entrypoint文件
命令：vim dockerfile-cmd-entrypoint

【内容】

FROM centos
ENTRYPOINT ["ls","-a"]    # 增加一个命令 ls -a

构建文件：
docker build -f dockerfile-cmd-entrypoint -t entoryponit-test  .

运行命令
docker run 2efebf4ae1c6
12345678910111213
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/5d94a8c87c5b38927ab97f13cc1e5a02.png#pic_center)  
【测试】我们追加一个命令参数-l相当于ls -al  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/2bcbd87f0797bd4c273250b39d9e278e.png#pic_center)  
**结论** ：通过以上两个测试，发现CMD后面只有最后一个命令会生效，如果生成镜像后往后面添加命令就会被替代，而ENTRYPOINT就是直接追加，不会被替代。

Dockerfile中很多命令都十分的相似，我们需要了解它们的区别，我们最好的学习就是对比他们然后测试效果。

【更新时间：2020.10.08 01:18】

### 实战：使用DockerFile制作一个Tomcat镜像

**1、需要准备镜像文件，Tomcat压缩包，JDK压缩包【这里我实现传上去了，压缩包来源见 [Linux笔记](https://blog.csdn.net/weixin_43246215/article/details/107430831) 】**  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/5cc58949f630b8fce2d4ec8c218f07d5.png#pic_center)  
**2、编写dockfile文件，官方命令【Dockerfile】，build会自动寻找这个文件，就不需要使用 -f 指定了**  
**命令：** `vim Dockerfile`

```shell
# 以centos镜像为基础
FROM centos
# 维护者信息
MAINTAINER oldou<itoldou@foxmail.com>

# 拷贝到容器内部
COPY readme.txt /usr/local/readme.txt

# 添加压缩包到容器内并自动解压到后面的路径
ADD jdk-8u11-linux-x64.tar.gz /usr/local/
ADD apache-tomcat-7.0.47.tar.gz /usr/local/

# 安装一些工具命令
RUN  yum -y install vim 
RUN  yum -y install net-tools

# 设置工作目录
ENV  MYPATH  /usr/local/
WORKDIR  $MYPATH

# 设置JDK的环境变量
ENV JAVA_HOME /usr/local/jdk1.8.0_11
ENV CLASSPATH $JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
#设置tomcat的环境变量
ENV CATALINA_HOME /usr/local/apache-tomcat-7.0.47
ENV CATALINA_BASE   /usr/local/apache-tomcat-7.0.47
ENV PATH $PATH:$JAVA_HOME/bin:$CATALINA_HOME/lib:$CATALINA_HOME/bin

EXPOSE  8080    # 暴露8080端口

# 启动时到指定目录执行tomcat并且输出日志
CMD /usr/local/apache-tomcat-7.0.47/bin/startup.sh && tail -F /usr/local/apache-tomcat-7.0.47/bin/logs/catalina.out
shell1234567891011121314151617181920212223242526272829303132
```

**3、构建镜像**  
**命令：** `docker build -t diytomcat .`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/86cb5e22029911ffca5b126da4cbf4e1.png#pic_center)  
**4、启动镜像**  
**命令：** `docker images` 查看镜像  
**命令：** `docker run -d -p 9090:8080 --name oldoutomcat -v /home/oldou/build/tomcat/test:/usr/local/apache-tomcat-7.0.47/webapps/test -v /home/oldou/build/tomcat/tomcatlogs/:/usr/local/apache-tomcat-7.0.47/logs diytomcat`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/c49f981230c3699dbc12704b285d4cbd.png#pic_center)  
然后查看一下目录中的文件：  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/2b59f0c9d1e361033d05686a5701b080.png#pic_center)  
**5、访问测试**  
进入tomcat查看目录：  
**命令：** `docker exec -it 02909c085375 /bin/bash`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/59bca8d6e08204ffabc00762b026152c.png#pic_center)  
另起一个窗口执行命令：  
**命令：** `curl localhost:9090`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/c946a70fdbca3bab48a7ca1026c444d5.png#pic_center)  
然后我们在浏览器访问 【 公网IP:9090 】  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/d1cfaa4b1cfcf965a73292862771a6fb.png#pic_center)  
**6、发布项目（由于做了卷挂载，我们直接在本地编写项目就可以发布了。）**  
按照步骤新建WEB-INF和web.xml文件，并且添加以下内容  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/fc971c98b00695a460c306b0e533c98f.png#pic_center)

- **web.xml内容：**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://java.sun.com/xml/ns/javaee" xsi:schemaLocation="http://java.sun.com/xml/ns/javaee 
                             http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd" 
         version="2.5">

</web-app>
xml1234567
```
- **index.jsp内容：**
```
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Test</title>
</head>
<body>
        Hello World!
</body>
</html>
123456789101112
```

保存退出之后，再去浏览器访问 `公网IP:9090/test`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/64c54e698cf8c4f640cb43bbe9da00db.png#pic_center)  
然后我们再去看看日志文件：  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/95e6ccd594afc7d291599cb9d33f15cb.png#pic_center)  
我们发现，项目部署成功，可以直接访问。  
我们以后开发的步骤︰需要掌握Dokcerfile的编写，我们之后的一切都是使用docker镜像来发布运行。

### 发布镜像到DockerHub

DockerHub地址： [https://hub.docker.com/](https://hub.docker.com/) 【需要注册自己的账号】

我们在服务器上登录完毕后，就可以提交自己的镜像了，就是一步，如下所示：  
**查看登录命令** ： `docker login --help`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/d13f2df380354a8ecbd972fe4504b674.png#pic_center)  
这个时候我们在登录一下：  
**命令：** `docker login -u 用户名 回车输出密码`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/6b64774e59567187c8ed2fc98204b03f.png#pic_center)  
登录成功之后就开始push我们的镜像到服务器 上。  
首先我们先给镜像改个名字：  
**命令：** `docker tag 镜像id oldou/diytomcat:1.0`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/7b1362b11af1eaaeba45829bf8ef5037.png#pic_center)  
接下来便开始上传  
格式： `【 docker push 作者名/需要上传的镜像名:版本号 】`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/46bd8a7bf13e51dd2e8d1911db6eb5e9.png#pic_center)  
**登出命令** ： `docker logout`  
【注意】自己发布的镜像尽量带版本号，假如是本地虚拟机的话由于DockerHub是国外的，要翻墙所以发布会被拒绝。  
**然后我们发现发布的时候也是按照镜像的层级来进行提交的** 。

### 发布镜像到阿里云容器服务

1、登录阿里云服务器

2、找到容器镜像服务  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/e82c251b33930053c423df5fa4544ecc.png#pic_center)  
3、创建命名空间  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/609c296b62ed1ee402a7bde69e5ae529.png#pic_center)  
4、创建镜像仓库  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/383d971dcdbc574b71a8e91eb9fd4f5d.png#pic_center)  
5、浏览阿里云命令操作  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/9a8fbecfa5a074fd47397e0329ac8cc8.png#pic_center)  
6、上传镜像到阿里云  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/14fd84dbd58e919326d1388eb38a1a6e.png#pic_center)  
首先退出DockerHub的账号【docker logout】，然后复制自己创建的阿里云镜像仓库中的命令，输入密码登录  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/9947e2dcf5198cc4dec8d4c4a105a6b9.png#pic_center)  
登录成功之后使用【docker push 镜像名:版本号】上传即可

## Docker所有流程小结

- 简略版  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/84e35ca9fe4637575dbe4ceb96fdb36c.png#pic_center)
- 完整版  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/809c2ab3d5f12482cadb85ec0bce6129.png#pic_center)  
	到目前为止，图中的所有步骤基本上都看得明明白白了。  
	【能看图说话就不用多解释了吧，嘿嘿~】

## Docker网络的学习

### Docker0 网络详解

首先我们学习这里得清空所有的环境，为的就是造成干扰啥的，还是清了好，命令如下：

- **移除所有的容器** ： `docker rm -f $(docker ps -aq)`
- **移除所有的镜像** ： `docker rmi -f $(docker images -aq)`

**查看容器内部网络ip地址的命令** ： `ip addr 【或者 ifconfig】`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/bed5f63b9647949d20795478feb10413.png#pic_center)  
从上图可知，我们的ip地址有三个网络，这三个网络分别代表了三个不同的环境。

**问题** ：docker 是如何处理容器网络访问的呢？例如我们在tomcat中运行着一个web项目，同时web项目需要连接一个mysql数据库，那么tomcat和数据库之间该怎么连接呢？  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/27c26dc9f7081402d616cad953ea0ff0.png#pic_center)  
**首先我们去测试一下** ：

**1、启动一个tomcat**  
**命令：** `docker run -d -P --name tomcat01 tomcat`  
然后使用【 `docker exec -it tomcat01 ip addr` 】再去查看一下tomcat的网络地址并进入容器，发现容器启动的时候会得到一个 `vethcdb1d6c@if64` 的ip地址，这个ip地址就是docker分配的。  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/b81e8008c0d648c8c7557499228ab397.png#pic_center)  
**思考** ：Linux能不能ping通容器内部呢？  
我们ping一下刚刚启动的tomcat01，直接ping它的ip地址  
**命令：** `ping 172.17.0.2` Ctrl+C停止  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/fac304d05d6925a1399630f749a3730e.png#pic_center)  
**结论** ：Linux是可以ping通docker容器内部的。

**原理**  
我们每启动一个docker容器，docker就会给容器分配一个ip地址，我们只要安装了docker就会有一个docker0的网卡，使用的是桥接模式【 `bridge` 】，使用的技术就是【 `evth-pair` 】技术。

**再次测试 ip addr**  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/e07b9c4b7617e4c27f2193908856a8f7.png#pic_center)  
**2、我们再启动一个tomcat，然后使用【 ip addr 】再看一下网卡**  
**命令：** `docker run -d -P --name tomcat02 tomcat`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/7378591da01d1b01f8b1f9163a4fac33.png#pic_center)  
然后再使用【 `docker exec -it tomcat02 ip addr` 】查看一下tomcat的ip  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/3cd31f3babe33690a00c5dd2eea53570.png#pic_center)  
我们发现，在启动一个容器测试时，多了一对网卡【上面两个图中的66和67互相对应】  
启动容器带来的网卡都是一对对的，这就是 `evth-pair` ，它就是一对虚拟设备借口，它们都是成对出现的，一端连接着协议，一端彼此相连。正是因为有这个特性，evth-pair才能充当一个桥梁，连接着各种虚拟网络设备。OpenStac，Docker容器之间的连接，OVS的连接，都是使用evth-pair技术。

**3、下面我们来测试一下tomcat01和tomcat02是否能够ping通！**  
**命令：** `docker exec -it tomcat02 ping 172.17.0.2` 【注：这里的172.17.0.2是tomcat01的ip】  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/51f5d0fcae0c66363bb6bcc99ff6f96e.png#pic_center)

**结论：容器与容器之间是可以互相ping通的。**

我们根据以上的测试，绘制一个网络模型图【结合测试输出的容器IP地址】  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/5a26f5ba9d1955ae54bbb1640d86d102.png#pic_center)  
**结论** ：tomcat01和tomcat02是共用的一个路由器docker0，所有容器再不指定网络的情况下，都是docker0路由的，docker会给我们的容器分配一个默认的可用IP地址。

### 小结

Docker使用的是Linux的桥接模式，宿主机中是一个Docker容器的网桥docker0，所有东西都是经过这个docker0的，只要你启动一个容器，不指定一个网络它就会往docker0这里给你分配一个IP，最多能分配65535个【原因链接】。如果是容器之间需要通信，那么就通过Veth-pair给转发连接过去，如下图所示。核心就是利用了Linux的虚拟化网络技术，在容器内和Docker0分别创建了一个虚拟网卡，通过Veth-pair进行一个连接。

**为什么是65535个的原因** ：  
因为docker0分配的ip后面有下图所示16，我们拿255.255.0.1/16为例，因为原有的为00000000.00000000.00000000.00000000，转化为十进制【255.255.255.255】而16表示的是截止到前面的第二个255，也就是【255.255.0.0】，而每位的范围是0~255个数，那么能存储的个数就为后面的位数相乘，也就是255\*255=65535个。假如是255.255.0.1/24，那么就代表255.255.255.0，也就是只有最后的0-255个，也就是可分配255个。而我们的docker0课分配的个数就是65535个【如下所示】。  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/3e807ee5d1b2fbd0bf774e864ac7932c.png#pic_center)

  
**Docker中的所有网络接口都是虚拟的，这是因为虚拟的转发效率高，只要在一个容器内转发是非常快的。**

只要容器删除，对应的网桥一对就没有了。  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/698bbcbe8b9c15390c5ce8dac9531495.png#pic_center)  
**思考：我们编写一个微服务，database url = ip；项目不重启的情况下，当数据库ip换掉了，我们希望可以通过名字来访问容器。这种情况该怎么做？**

### 容器互联 --link 【了解即可】

**【由于这个不常用且有坑，所以不过多介绍】**

我们通过容器的名字是无法ping通的，例如【 `docker exec -it tomcat02 ping tomcat01` 】是没有办法ping通的，

当然我们可以使用 `--link` 可以解决网络连通问题  
使用 `docker run -d -P --name tomcat03 --link tomcat02 tomcat` 运行tomcat03并且连通tomcat02是可以的，并且通过 `docker exec -it tomcat03 ping tomcat02` 可以ping通。

但是反向就不能ping通了【 `docker exec -it tomcat02 ping tomcat03` 】就会ping失败。

而我们通过查看hosts配置，也就是运行【docker exec -it tomcat03 cat /etc/hosts】  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/c24405bc33c497880b357c4f9d36a258.png#pic_center)  
我们发现通过 `--link` 命令就是在hosts的配置中添加了一个tomcat2的映射，而我们现在使用Docker已经不建议使用这个命令了，我们通常会使用自定义网络来实现容器之间的互联，并且这里也不使用docker0，因为docker0不支持通过容器名连接访问。

### 自定义网络【create】

我们先停止所有运行的容器  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/fd7c353264eb269de96d66a969148759.png#pic_center)

然后使用【 `docker network --help` 】命令去查看一下network命令相关。  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/ec06e37199d1fcf6256afed3e4c2b3fd.png#pic_center)  
我们这里会使用上列的一下命令进行操作。

**查看一下所有的docker网络** ： `docker network ls`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/79d582269d61b5a5beae845d468495ac.png#pic_center)  
**上述NAME-网络模式**

- `bridge` ：桥接docker(默认，自己创建也使用bridge模式）；
- `none` ：不配置网络；
- `host` ：和宿主机共享网络；
- `container` ：容器网络连通!（用的少，局限很大）；

**下面我们来测试一下如何自定义网络。**

首先我们先把环境清理一下，保证环境是干净的：

- 移除所有的容器： `docker rm -f $(docker ps -aq)`
- 移除所有的镜像： `docker rmi -f $(docker images -aq)`
- 使用【 ip addr 】时回到了之前只有三个网卡的状态  
	![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/aa692290a92d6f2837d459865561b005.png#pic_center)  
	我们直接启动的命令 【 `--net bridge` 】，而这个就是docker0默认的启动方式
```shell
docker run -d -P --name tomcat01 tomcat
# 以上命令就相当于
docker run -d -P --name tomcat01 --net  bridge tomcat 
shell123
```

docker0的特点就是默认域名不能访问，可以通过 `--link` 打通，但是这里有坑。因此不建议使用，但是我们可以通过常用的自定义一个网络。

**创建命令：** `docker network create --driver bridge --subnet 192.168.0.0/16 --gateway 192.168.0.1 mynet`

```shell
--driver bridge  # 桥接模式
--subnet 192.168.0.0/16  # 配制一个子网，65535个字段  192.168.0.2——192.168.255.255
--gateway 192.168.0.1   # 配制默认的路由网关
mynet    #表示自定义的网络名
shell1234
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/7d8169cbd8174018ce9e3203533a4ead.png#pic_center)  
**查看一下，命令：** `docker network ls`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/c953a536f53aacb61d140fb79b610761.png#pic_center)  
**查看一下mynet的详情，命令：** `docker network inspect mynet`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/e76a3c7aeecddc1b66033655e58d7fd8.png#pic_center)  
**我们自己的网络就创建好了，下面使用我们自定义的网络启动两个tomcat，然后查看一下信息。**  
依次运行：

```shell
# 启动tomcat-net-01
docker run -d -P --name tomcat-net-01 --net mynet tomcat 
# 启动tomcat-net-02
docker run -d -P --name tomcat-net-02 --net mynet tomcat 
# 查看一下
docker network inspect mynet
shell123456
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/35c181fff4ea831e239d1fca8c44f71e.png#pic_center)  
**然后我们测试一下tomcat01和tomcat02之间能不能互相ping通**

```shell
# tomcat01 ping一下02的IP地址
docker exec -it tomcat-net-01 ping 192.168.0.3
# tomcat02 ping一下01的IP地址
docker exec -it tomcat-net-02 ping 192.168.0.2
shell1234
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/2c206c7e15cc9be2e6c8e2bea90225da.png#pic_center)  
测试发现，我们不使用–link也能ping通名字了！

**结论** ：  
**我们自定义的网络docker都已经帮我们维护好了对应的关系，推荐我们平时这样使用网络!**  
**而且这样做的好处** ：

- redis-不同的集群使用不同的网络，保证集群是安全和健康的；
- mysql-不同的集群使用不同的网络，保证集群是安全和健康的；

### 网络连通【connect】

**核心命令** ：【 `docker network connect --help` 】  
假设有下图中的模型，它们之间的网段不一样，这个时候我们想要通过tomcat-01ping通tomcat-net-01，它们之间能不能ping通呢？下面测试一下  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/a02a086f10ac63ee3e7f1d891ccd3bf4.png#pic_center)  
依次执行以下命令：

```shell
# 启动tomcat01，使用的是docker0路由
docker run -d -P --name tomcat01 tomcat

# 启动tomcat02，使用的是docker0路由
docker run -d -P --name tomcat01 tomcat

# 查看一下启动的容器
docker ps

# 测试tomcat01是否能ping通tomcat-net-01
docker exec -it tomcat01 ping tomcat-net-01
shell1234567891011
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/a75768f73c340a06398b0a4e03fdb24a.png#pic_center)  
结果证明，不能！

下面我们使用connect将两个不同网段的容器打通：  
**命令** ： `docker network connect mynet tomcat01`  
然后再去ping一下。  
`docker exec -it tomcat01 ping tomcat-net-01`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/ac9b2be7329b9b594cfbd50c364e7fb6.png#pic_center)  
这下就能ping通了，这里连通之后就是将tomcat01放到了mynet下【注意：tomcat-02依旧是打不通的】，就相当于下图所示。  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/fb9e7a7acab91b53e59f20b819a5ee74.png#pic_center)  
我们使用【docker network inspect mynet 】查看一下：  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/7c9cf7fa8d6efe4225cd4db5f7e2049c.png#pic_center)  
结果证明了，使用connect就是将tomcat01放到了mynet下，如果我们以后想要跨网络操作别人的容器，就需要使用 `docker network connect` 连通。

### 实战：部署Redis集群

启动六个集群，采用 分片 + 高可用 + 负载均衡的方式，三个主节点，三个从节点，实现当一个主节点挂掉以后它的从节点能够替代顶上。如下所示：  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/43dc87df811c121c6aeb39a21971efcf.png#pic_center)  
首先我们先把环境清理一下，保证环境是干净的：

- 移除所有的容器： `docker rm -f $(docker ps -aq)`
- 移除所有的镜像： `docker rmi -f $(docker images -aq)`

**依次执行以下命令** ：

```shell
# 创建Redis网卡
docker network create redis --subnet 172.38.0.0/16

# 查看网卡
docker network ls
docker network inspect redis

# 通过脚本创建六个redis配置，直接粘贴运行以下代码
# redis的shell脚本，需要的可以自行更改目录
for port in $(seq 1 6); \
do \
mkdir -p /home/redis-cluster/redis-${port}/conf
touch /home/redis-cluster/redis-${port}/conf/redis.conf
cat << EOF >>/home/redis-cluster/redis-${port}/conf/redis.conf
port 6379
bind 0.0.0.0
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 5000
cluster-announce-ip 172.38.0.1${port}
cluster-announce-port 6379
cluster-announce-bus-port 16379
appendonly yes
EOF
done

# ------------------------------------
#注释解释   循环六次
for port in $(seq 1 6);\
do \
# 创建redis的配置文件
mkdir -p /home/redis-cluster/redis-${port}/conf
# redis.conf文件的配置
touch /home/redis-cluster/redis-${port}/conf/redis.conf
# 写上配置
cat << EOF >>/home/redis-cluster/redis-${port}/conf/redis.conf
# 容器端口
port 6379
bind 0.0.0.0
# 开启集群
cluster-enable yes
cluster-config-file nodes.conf
cluster-node-timeout 5000
# 连接具体的IP
cluster-announce-ip 172.38.0.1${port}
cluster-announce-port 6379
cluster-announce-bus-port 16379
appendonly yes
EOF
done
# ---------------------------------
shell123456789101112131415161718192021222324252627282930313233343536373839404142434445464748495051
```

**以下是一个一个启动的，依次运行**

```shell
# 启动redis-1
docker run -p 6371:6379 -p 16371:16379 --name redis-1 \
-v /home/redis-cluster/redis-1/data:/data \
-v /home/redis-cluster/redis-1/conf/redis.conf:/etc/redis/redis.conf \
-d --net redis --ip 172.38.0.11 redis:5.0.9-alpine3.11 redis-server /etc/redis/redis.conf

# 启动redis-2
docker run -p 6372:6379 -p 16372:16379 --name redis-2 \
-v /home/redis-cluster/redis-2/data:/data \
-v /home/redis-cluster/redis-2/conf/redis.conf:/etc/redis/redis.conf \
-d --net redis --ip 172.38.0.12 redis:5.0.9-alpine3.11 redis-server /etc/redis/redis.conf

# 启动redis-3
docker run -p 6373:6379 -p 16373:16379 --name redis-3 \
-v /home/redis-cluster/redis-3/data:/data \
-v /home/redis-cluster/redis-3/conf/redis.conf:/etc/redis/redis.conf \
-d --net redis --ip 172.38.0.13 redis:5.0.9-alpine3.11 redis-server /etc/redis/redis.conf

# 启动redis-4
docker run -p 6374:6379 -p 16374:16379 --name redis-4 \
-v /home/redis-cluster/redis-4/data:/data \
-v /home/redis-cluster/redis-4/conf/redis.conf:/etc/redis/redis.conf \
-d --net redis --ip 172.38.0.14 redis:5.0.9-alpine3.11 redis-server /etc/redis/redis.conf

# 启动redis-5
docker run -p 6375:6379 -p 16375:16379 --name redis-5 \
-v /home/redis-cluster/redis-5/data:/data \
-v /home/redis-cluster/redis-5/conf/redis.conf:/etc/redis/redis.conf \
-d --net redis --ip 172.38.0.15 redis:5.0.9-alpine3.11 redis-server /etc/redis/redis.conf

# 启动redis-6
docker run -p 6376:6379 -p 16376:16379 --name redis-6 \
-v /home/redis-cluster/redis-6/data:/data \
-v /home/redis-cluster/redis-6/conf/redis.conf:/etc/redis/redis.conf \
-d --net redis --ip 172.38.0.16 redis:5.0.9-alpine3.11 redis-server /etc/redis/redis.conf

shell12345678910111213141516171819202122232425262728293031323334353637
```

**使用【 `docker ps` 】查看启动**  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/7e7a8adecb7f1bd4398894db50ae51e5.png#pic_center)  
**我们先进入到其中一个redis中：**  
`docker exec -it redis-1 /bin/sh`  
**接下来便是创建集群：**

```shell
redis-cli --cluster create 172.38.0.11:6379 172.38.0.12:6379 172.38.0.13:6379 172.38.0.14:6379 172.38.0.15:6379 172.38.0.16:6379 --cluster-replicas 1
shell1
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/14834cd645305be76f0e8f0d09362112.png#pic_center)  
这样集群就创建成功了。  
**接下来我们连接上这个集群。**  
**命令：** `redis-cli -c`  
查看集群信息： `cluster info`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/adcefc3551798b8072a69c4fed9b0a88.png#pic_center)  
**查看节点** ： `cluster nodes`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/059de463f8a81be087f4cc0d810912c5.png#pic_center)  
**以上节点都是正常运行的，这个时候我们来模拟一下异常。**

首先我们先设置一个值：  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/6d2b478c037f56e741aa534179024087.png#pic_center)  
这个值存在了172.38.0.13这个主节点上，它的从节点为172.38.0.14，这个时候我们将这个主节点挂掉，按道理说主节点中的数据都会被同步到从节点上，如果主节点挂掉以后还能在从节点中查到数据，下面我们来模拟一下。  
另开一个窗口将redis-3停掉  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/dd88da8ae5227eed864b966b320115c7.png#pic_center)  
然后我们再从连接中取值  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/fe86e1943e4d47c32f779880c2258688.png#pic_center)  
发现取出来了，是从172.38.0.14中取出来的，我们再去查看一下节点信息：  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/6752702f1b3e7e667e5877e54152e401.png#pic_center)  
测试OK！  
使用了Docker以后，感觉还是蛮爽的。

## SpringBoot微服务打包成Docker镜像

首先将Docker里面清理一下

- 移除所有的容器： `docker rm -f $(docker ps -aq)`
- 移除所有的镜像： `docker rmi -f $(docker images -aq)`

**1、创建一个SpringBoot项目**  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/fd32ada35033ee990edcd0a85460a76a.png#pic_center)  
然后本地测试一下，测试成功之后进行下一步  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/99ce951b53e837836531b8b8a33c2b44.png#pic_center)

**2、打包应用**  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/9ecf426d7aa3dff0fb78fe0c88dbf426.png#pic_center)

**3、编写dockerfile**  
这个时候我们需要在IDEA中安装Dockerfile【不装也可以】  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/42b0b2c85c4acdf9368baf8a780a902f.png#pic_center)  
在IDEA中新建Dockerfile文件，进行编写：  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/fbdf8caf1546ff6bac7713a7061313f1.png#pic_center)

**4、构建镜像**  
在/home目录下新建一个idea目录，然后将jar包和Dockfile文件上传到这里。  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/d53a1eadf4c5b564de3170bd41b5b7b3.png#pic_center)

构建镜像： `docker build -t testhellojar .`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/cfba81c8e9e6f4778d2324029f95c1ef.png#pic_center)

**5、发布运行**  
运行： `docker run -d -P --name testhellojar-springboot-web testhellojar`

访问： `curl localhost:32777/hello`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/119844ebcc0ebeb0e5e90d6ccb7c82ae.png#pic_center)  
测试OK。以后我们使用Docker之后，就直接给别人交付一个镜像就OK了，如果有很多镜像，那么就需要继续深造学习一下后面的知识了，  
Docker Compose  
Docker Swarm  
CI/CD之Jenkins

【第一阶段更新完毕，更新时间：2020.10.09 05:11】

> > 到此，Docker第一阶段的笔记就整理到这里了，后面有时间我会在另外写一篇文章关于Docker Compose、Docker Swarm、CI/CD之Jenkins的知识，学习来源于 [B站狂神Docker](https://www.bilibili.com/video/BV1og4y1q7M4?p=1) 的学习视频，以上文章内容全部由自己手动测试实现，并且肝了不少时间，现在分享出来，方便自己查找学习的同时也希望能够帮到大家，同时希望从这篇笔记有所收获的伙伴能够点赞支持一下，谢谢大家。