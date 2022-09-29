# 輸入指令一鍵佈署 .\deploy.sh

# 發生錯誤時執行終止指令
set -e

# 打包編譯
npm run build

git add .
git commit -m "update `date +'%Y-%m-%d %H:%M:%S'`";
git push origin main