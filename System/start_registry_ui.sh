#!/bin/bash

docker stop registry_ui
docker system prune --volumes -f

docker run -d \
  --network tocvlan \
  --ip=172.20.10.71 \
  --restart always \
  --name registry_ui \
  --link registry \
  -e REGISTRY_URL=http://registry:5000 \
  -e DELETE_IMAGES=true \
  -e REGISTRY_TITLE="ToC Registry" \
  joxit/docker-registry-ui:latest