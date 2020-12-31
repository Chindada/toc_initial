#!/bin/bash

IOMVERSION='R5012RC3'

rm -rf ../Images
mkdir ../Images

docker pull mariadb:10.5.2
docker pull fauria/vsftpd

docker save --output ../Images/iomdatabase_image.tar mariadb:10.5.2
docker save --output ../Images/iomftp_image.tar fauria/vsftpd
docker system prune --volumes -f

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
delete iomdatabase_image.tar
delete iomftp_image.tar
mput *.tar
quit
END_FTP
