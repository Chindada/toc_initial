#!/bin/bash

docker stop s5system
docker stop s5data
docker stop s5edge
docker stop c5system
docker system prune --volumes -f

docker volume create s5system-vol
docker run --name s5system \
    --network=tocvlan \
    --ip=172.20.10.11 \
    --link tocsql \
    --restart always \
    -v s5system-vol:/go/src/app/IoMS5System \
    -e TZ="Asia/Taipei" \
    -d ioms5system:R5012

docker volume create s5data-vol
docker run --name s5data \
    --network=tocvlan \
    --ip=172.20.10.12 \
    --link tocsql \
    --restart always \
    -v s5data-vol:/go/src/app/IoMS5Data \
    -e TZ="Asia/Taipei" \
    -d ioms5data:R5012

docker volume create s5edge-vol
docker run --name s5edge \
    --network=tocvlan \
    --ip=172.20.10.13 \
    --link s5data \
    --restart always \
    -v s5edge-vol:/go/src/app/IoMS5Edge \
    -e TZ="Asia/Taipei" \
    -d ioms5edge:R5012

docker volume create c5system-vol
docker run --name c5system \
    --network=tocvlan \
    --ip=172.20.10.99 \
    --link s5system \
    --link s5data \
    --link s5edge \
    --restart always \
    -v c5system-vol:/usr/share/nginx/html \
    -e TZ="Asia/Taipei" \
    -d iomc5system:R5012

