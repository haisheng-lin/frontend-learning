#!/bin/sh

handle=$1;
env=$2;

# 远程部署机 webhook
# 如果用远程机器部署的话就要用到以下方法
# preHandle () {
#     git pull orgin master
#     npm config set registry http://registry.npm.taobao.org/
#     npm install
#     npm run build-prod
# }

if [ $handle == "build" ]
then
  role=""
  ip=""
  distFolderPath=""
  if [ $env == "prod" ]
  then
    echo "[exec] build ==> build production"
    role="root"
    ip="120.79.237.156"
    distFolderPath="/home/work/projects/channel-management/channel-frontend"
    ng build --aot --prod
  elif [ $env == "dev-outer" ]
  then
    echo "[exec] build ==> build development: outer-test"
    role="root"
    ip="47.106.35.176"
    distFolderPath="/home/work/test-projects/channel-management/channel-frontend"
    ng build --aot
  elif [ $env == "dev-inner" ]
  then
    echo "[exec] build ==> build development: inner-test"
    role="work"
    ip="192.168.1.200"
    distFolderPath="/home/work/projects-test/channel-management/channel-frontend"
    ng build --aot
  else
    exit 0
  fi
  # 将打包文件复制至 dist-next，之后会重命名为 dist
  echo "[exec] transfering file to ${ip} server ..."
  tempFolderName="dist-next"
  ssh ${role}@${ip} "mkdir ${distFolderPath}/${tempFolderName}"
  scp -r ./dist/* ${role}@${ip}:${distFolderPath}/${tempFolderName}
  # currentTime 不可以包含 '/'，否则重命名文件会失效
  currentTime="`date +%Y-%m-%d:%H:%M:%S`"
  echo "[exec] renaming current dist folder from ${ip} server ..."
  # 将现有的 dist 重命名，并重命名 dist-next 为 dist
  ssh ${role}@${ip} "cd ${distFolderPath} && mv dist dist-bak-${currentTime} && mv ${tempFolderName} dist"
fi
