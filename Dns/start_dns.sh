#!/bin/bash

docker stop dns
docker system prune --volumes -f

docker run --name dns -d \
    --network=tocvlan \
    --ip=172.20.10.254 \
    --dns=8.8.8.8 \
    --restart=always \
    --volume /srv/docker/bind:/data \
    sameersbn/bind:9.16.1-20200524
