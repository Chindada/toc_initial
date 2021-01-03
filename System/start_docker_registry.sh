#!/bin/bash

docker stop registry
docker system prune --volumes -f

docker run -d \
  --network tocvlan \
  --ip=172.20.10.70 \
  --restart always \
  --name registry \
  -e REGISTRY_HTTP_HEADERS_Access-Control-Allow-Origin="*" \
  registry:2
