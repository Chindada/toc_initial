#!/bin/bash

docker system prune --volumes -f
docker network create -d macvlan \
  --subnet=172.20.10.0/24 \
  --gateway=172.20.10.1 \
  -o parent=eth1 \
  tocvlan

docker volume create tocsql-vol
docker run --name tocsql \
    --network=tocvlan \
    --ip=172.20.10.10 \
    --restart always \
    -v tocsql-vol:/var/lib/mysql \
    -e MYSQL_ROOT_PASSWORD=asdf0000 \
    -e MYSQL_ROOT_HOST="%" \
    -e TZ="Asia/Taipei" \
    -d mariadb:10.5.2

docker run --name ftp \
    --network=tocvlan \
    --ip=172.20.10.60 \
    --restart always \
    -v /backup/ftp_data:/home/vsftpd \
    -v /backup/ftp_log:/var/log/vsftpd \
    -e TZ="Asia/Taipei" \
    -e FTP_USER="toc" \
    -e FTP_PASS="asdf0000" \
    -e PASV_ADDRESS="172.20.10.14" \
    -d fauria/vsftpd

# echo "0 2 * * * root /toc/toc_initial/Tasks/daily_backup.sh" >> /etc/crontab

