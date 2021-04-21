#!/bin/bash

docker stop registry
docker system prune --volumes -f

docker run -d \
  --network tocvlan \
  --ip=172.20.10.70 \
  --restart always \
  --name registry \
  -v /registry-data:/var/lib/registry \
  -e REGISTRY_STORAGE_DELETE_ENABLED=true \
  -e $pwd/credentials.yml:/etc/docker/registry/config.yml \
  registry:2
