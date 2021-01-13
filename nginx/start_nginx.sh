#!/bin/bash

docker stop nginx
docker system prune --volumes -f

docker run --name nginx -d \
  --network tocvlan \
  --ip=172.20.10.220 \
  --restart always \
  --link gitea \
  -v $pwd/nginx.conf:/etc/nginx/nginx.conf:ro \
  nginx