#!/bin/bash

docker stop registry-ui
docker system prune --volumes -f

docker run -d \
  --network tocvlan \
  --ip=172.20.10.71 \
  --restart always \
  --name registry-ui \
  --link registry \
  -e DELETE_IMAGES=true \
  -e REGISTRY_URL=http://registry:5000 \
  -e REGISTRY_TITLE=ToC Docker Registry \
  joxit/docker-registry-ui:static