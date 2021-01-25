#!/bin/bash

docker stop drone
docker system prune --volumes -f

docker run --name drone \
  --network=dockervlan \
  --ip=192.168.10.236 \
  --restart always \
  -v /docker_data/drone:/data \
  -e DRONE_GITEA_SERVER=http://192.168.10.8/ \
  -e DRONE_GITEA_CLIENT_ID=d805d516-a0ef-4f41-81e3-dce919fd36ba \
  -e DRONE_GITEA_CLIENT_SECRET=-BkkDIy_jrCBQCd7Ad0ObIR7gvK18kr1N9wfF0s2DwzM= \
  -e DRONE_RPC_SECRET=f6b2b9931bdcc2dee834cbaf3d8aced2 \
  -e DRONE_SERVER_HOST=192.168.10.236 \
  -e DRONE_SERVER_PROTO=http \
  -e DRONE_GIT_ALWAYS_AUTH=true \
  --detach=true \
  drone/drone:1
