#!/bin/bash

docker stop registry_ui
docker system prune --volumes -f

docker run -d \
  --network tocvlan \
  --ip=172.20.10.71 \
  --restart always \
  --name registry_ui \
  --link registry \
  -e DELETE_IMAGES=true \
  -e NGINX_PROXY_HEADER_Access-Control-Allow-Origin= "*" \
  joxit/docker-registry-ui:latest