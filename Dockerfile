# 基于 Node.js 的镜像
FROM node:14 as build-stage

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 文件到工作目录
COPY package*.json ./

# 安装依赖
RUN npm install

# 这里说明我们的基础镜像是nginx
# 如同上面所说，不懂的可以简单理解为我们下面的所有任务是在一个有nginx环境的虚拟机里完成的
FROM nginx
# nginx的默认访问目录是/usr/share/nginx/html
# 所以我们只要把打包好的dist复制到对应目录下就可以
COPY dist /usr/share/nginx/html
