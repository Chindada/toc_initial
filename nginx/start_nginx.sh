#!/bin/bash

docker stop nginx
docker system prune --volumes -f

docker run --name nginx -d \
  --network tocvlan \
  --ip=172.20.10.220 \
  --restart always \
  -v ./nginx.conf:/etc/nginx/nginx.conf:ro \
  nginx