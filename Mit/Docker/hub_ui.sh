#!/bin/bash

docker stop registry-ui
docker system prune --volumes -f

docker run -d \
  --network dockervlan \
  --ip=192.168.10.237 \
  --restart always \
  --name registry-ui \
  --link registry \
  -e DELETE_IMAGES=true \
  -e REGISTRY_URL=http://registry:5000 \
  -e REGISTRY_TITLE="Minnotec Docker Registry" \
  joxit/docker-registry-ui:static
  