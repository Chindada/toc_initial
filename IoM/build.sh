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

s5systemid="52b668bfb72b46d4daa4829ce66c70ae150599be"
s5dataid="a8207bcba5d741a21736ab21108aadb6608a9a03"
s5edgeid="24c1ff87e85d3a96c2f578f4fddbb8fe08c37ec6"
c5systemid="54938544158cdcf67163f011517858877d4773ee"

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

# HOST='172.20.10.20'
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

