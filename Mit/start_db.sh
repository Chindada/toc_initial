#!/bin/bash

docker stop mariadb
docker system prune --volumes -f

docker volume create mariadb-vol
docker run --name mariadb \
    --network=dockervlan \
    --ip=192.168.10.240 \
    --restart always \
    -v mariadb-vol:/var/lib/mysql \
    -e MYSQL_ROOT_PASSWORD=Minnotec2025 \
    -e MYSQL_ROOT_HOST="%" \
    -e TZ="Asia/Taipei" \
    -d mariadb:10.5.2
