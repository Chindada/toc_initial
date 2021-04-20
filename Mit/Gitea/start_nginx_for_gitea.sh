#!/bin/bash

docker stop nginx
docker system prune --volumes -f

docker run --name nginx -d \
  --network dockervlan \
  --ip=192.168.10.8 \
  --restart always \
  --link gitea \
  -v /share/Docker_data/nginx_data/nginx.conf:/etc/nginx/nginx.conf:ro \
  nginx
