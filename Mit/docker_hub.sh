#!/bin/bash

docker stop registry
docker system prune --volumes -f

rm -rf /share/Docker_data/registry-data

docker run -d \
  --network dockervlan \
  --ip=192.168.10.238 \
  --restart always \
  --name registry \
  -e REGISTRY_STORAGE_DELETE_ENABLED=true \
  -v /share/Docker_data/registry-data:/var/lib/registry \
  -e /share/Docker_data/registry-setting/credentials.yml:/etc/docker/registry/config.yml \
  registry:2
