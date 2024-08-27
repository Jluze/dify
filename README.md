# docker-pull-proxy

有一些海外镜像（gcr.io docker.io）很难拉取，可以通过此仓库自动把指定 docker 镜像上传到我们的私有仓库

## 使用方式

**一定要看看**
**一定要看看**
**一定要看看**

当需要将某个镜像如 nginx:alpine 上传到私有仓库 registry.cn-beijing.aliyuncs.com/ijx-public/nginx:alpine    

docker hub 镜像是支持多 cpu 架构的，默认 github action 拉取是宿主机相同 cpu 架构，应该都是x86 .
如果需要拉取别的 cpu 架构支持，可以按照修改修改 pull.sh 文件

### 第一步
修改 `trigger.txt` 内容, 内容分为两部分，中间使用空格隔开， 目前每次代码提交都会触发镜像同步，需要注意

* 前面是需要同步的镜像
* 后面是上传到阿里云地址的镜像
    * 第一部分是阿里云容器镜像仓库地址
    * 第二部分是我们自己的命名空间地址
    * 最后就是镜像名称和版本
```
nginx:alpine registry.cn-beijing.aliyuncs.com/ijx-public/nginx:alpine
```
并提交

### 第二步
提交 github 后，会触发 actions，等待 actions build 成功

### 第三步
若 build 成功，可以在本地拉取私有仓库的镜像


如果阿里云在控制台没有登录，就需要登录下，在**阿里云个人凭证那里有登录命令**， 如果用户名被脱敏了，那注意修改下。   
使用 docker 命令获取阿里云同步完的镜像，地址格式和 `trigger.txt` 后半部分内容一致的

```bash
# 下载镜像
docker pull registry.cn-beijing.aliyuncs.com/ijx-public/nginx:alpine

# 如果需要把镜像名称改回去，可以这样
docker tag  registry.cn-beijing.aliyuncs.com/ijx-public/nginx:alpine nginx:alpine
```

## 自建 docker 镜像加速


### 使用 cf worker 创建

[worker 怎么用可以参考这里](https://github.com/yaming116/npm-registry-worker)

[docker registry worker 脚本在这里](./worker.js)

### 有海外服务器的，使用 nginx 

[教程链接地址](https://blog.lty520.faith/%E5%8D%9A%E6%96%87/%E8%87%AA%E5%BB%BAdocker-hub%E5%8A%A0%E9%80%9F%E9%95%9C%E5%83%8F/#%e6%96%b9%e6%a1%88%e4%b8%80%e4%ba%8c%e6%95%b4%e5%90%88)
