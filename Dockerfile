# 第一個階段: 拉取node鏡像來打包React項目
FROM node:14 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY public public/
COPY src src/
RUN npm run build

# 第二個階段: 創建並運行Ngnix服務器，並且將打包好的文件複製粘貼到服務器文件夾中
FROM nginx:alpine
COPY --from=build /app/build/ /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# 第三階段: 終端機指令
# 鏡像構建指令
# docker build -t react-web .

# 確認鏡像是否存在
# docker images

# 容器化React Web (可任意調整為其它端口) 將項目佈署在Docker中
# docker run -d -p 12231:80 react-web

# 查驗docker內容
# docker ps

# 查驗網站是否佈署成功
# 開啟瀏覽器前往localhost:12231