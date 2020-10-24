#!/bin/bash

IOMVERSION='R5012RC3'

docker stop s5system
docker stop s5data
docker stop s5edge
docker stop c5system

docker system prune --volumes -f
docker rmi ioms5system:R5012
docker rmi ioms5data:R5012
docker rmi ioms5edge:R5012
docker rmi iomc5system:R5012

s5systemid="e3fcb4c0624e458e55b12bc5aea6f36baaa4d7fa"
s5dataid="eb6446150afb1b06198a6b82343ba27bf421c0eb"
s5edgeid="54b47b9b972904136ad58a9b0d079d3c14426cdb"
c5systemid="3022c196ffbdeb2d24192cb882ead01440d23698"

docker stop s5system
docker system prune --volumes -f
docker rmi ioms5system:R5012
docker build --rm -f "../Dockerfile/S5System" \
             --build-arg COMMITID=$s5systemid \
             -t ioms5system:R5012 .

docker stop s5data
docker system prune --volumes -f
docker rmi ioms5data:R5012
docker build --rm -f "../Dockerfile/S5Data" \
             --build-arg COMMITID=$s5dataid \
             -t ioms5data:R5012 .

docker stop s5edge
docker system prune --volumes -f
docker rmi ioms5edge:R5012
docker build --rm -f "../Dockerfile/S5Edge" \
             --build-arg COMMITID=$s5edgeid \
             -t ioms5edge:R5012 .

docker stop c5system
docker system prune --volumes -f
docker rmi iomc5system:R5012
docker build --rm -f "../Dockerfile/C5System" \
             --build-arg COMMITID=$c5systemid \
             -t iomc5system:R5012 .

# rm -rf ../Images
# mkdir ../Images

# docker save --output ../Images/ioms5system_image.tar ioms5system:R5012
# docker save --output ../Images/ioms5data_image.tar ioms5data:R5012
# docker save --output ../Images/ioms5edge_image.tar ioms5edge:R5012
# docker save --output ../Images/iomc5system_image.tar iomc5system:R5012
# docker system prune --volumes -f

# cd ../Images
# now=$(date +"%y%m%d%H%M")
# echo $now >> ./$now.txt

# HOST='192.168.10.20'
# USER='admin'
# PASSWD='Minnotec2025'

# ftp -i -n -v $HOST << END_FTP
# quote USER $USER
# quote PASS $PASSWD
# passive
# binary
# cd "Public/IoM RC"
# mkdir $IOMVERSION
# cd $IOMVERSION
# mkdir Docker_images
# cd Docker_images
# delete ioms5system_image.tar
# delete ioms5data_image.tar
# delete ioms5edge_image.tar
# delete iomc5system_image.tar
# mput *.tar
# put $now.txt
# quit
# END_FTP

