#!/bin/bash

docker stop registry
docker system prune --volumes -f

docker run -d \
  --network tocvlan \
  --ip=172.20.10.70 \
  --restart always \
  --name registry \
  -v /registry-data:/var/lib/registry \
  -e /home/toc/drone/toc_initial/System/credentials.yml:/etc/docker/registry/config.yml \
  registry:2
