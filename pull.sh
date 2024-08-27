# docker pull
# 如果需要特定架构镜像可以手动指定  --platform linux/arm64 , linux/amd64 , linux/arm/v7 等信息
# 查看当前镜像架构信息
# docker image inspect homeassistant/home-assistant:2024.6  | grep Architectur
# "Architecture": "arm64",

# 不指定 cpu 架构
cat trigger.txt |awk '{print "docker pull " $1} '
cat trigger.txt |awk '{print "docker pull " $1} '| sh

#指定 cpu 架构
# cat trigger.txt |awk '{print "docker pull --platform linux/arm64 " $1} '
# cat trigger.txt |awk '{print "docker pull --platform linux/arm64 " $1} '| sh

# inspect Architectur
# cat trigger.txt |awk '{print "docker image inspect  " $1 "| grep Architectur" } '
# cat trigger.txt |awk '{print "docker image inspect  " $1 "| grep Architectur" } '| sh

# docker tag
cat trigger.txt |awk '{print "docker tag "$1 " " $2} '
cat trigger.txt |awk '{print "docker tag "$1 " " $2} '| sh

# docker push
cat trigger.txt |awk '{print "docker push " $2} '
cat trigger.txt |awk '{print "docker push " $2} '| sh