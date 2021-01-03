#!/bin/bash

docker stop registry_ui
docker system prune --volumes -f

docker run -d \
  --network tocvlan \
  --ip=172.20.10.71 \
  --restart always \
  --name registry_ui \
  -e DELETE_IMAGES=true \
  -e REGISTRY_URL="http://172.20.10.70:5000" \
  joxit/docker-registry-ui:latest