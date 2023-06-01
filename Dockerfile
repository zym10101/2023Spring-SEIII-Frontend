# 基于 Node.js 的镜像
FROM node:14 as build-stage

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 文件到工作目录
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制所有文件到工作目录
COPY . .

# 构建 Vue 项目
RUN npm run build

# 使用 Nginx 作为服务器
FROM nginx:stable-alpine as production-stage

# 拷贝构建结果到 Nginx 默认目录
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
