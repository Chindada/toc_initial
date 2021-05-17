#!/bin/bash

docker volume create tocsql-vol
docker run --name tocsql \
    --network=tocvlan \
    --ip=172.20.10.10 \
    --restart always \
    -v tocsql-vol:/var/lib/mysql \
    -e MYSQL_ROOT_PASSWORD=asdf0000 \
    -e MYSQL_ROOT_HOST="%" \
    -e TZ="Asia/Taipei" \
    -d mariadb:10.5.9
