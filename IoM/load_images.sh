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

rm -rf ../Images
mkdir ../Images
cd ../Images

HOST='172.20.10.20'
USER='admin'
PASSWD='Minnotec2025'

ftp -i -n -v $HOST << END_FTP
quote USER $USER
quote PASS $PASSWD
passive
binary
cd "Public/IoM RC"
mkdir $IOMVERSION
cd $IOMVERSION
mkdir Docker_images
cd Docker_images
mget *.tar
quit
END_FTP

docker load --input ioms5system_image.tar
docker load --input ioms5data_image.tar
docker load --input ioms5edge_image.tar
docker load --input iomc5system_image.tar
docker load --input iomdatabase_image.tar
docker load --input iomftp_image.tar

