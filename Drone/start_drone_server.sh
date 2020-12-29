#!/bin/bash

docker stop drone
docker system prune --volumes -f

docker volume create drone-vol
docker run --name=drone \
  --network=tocvlan \
  --link gitea \
  --ip=172.20.10.99 \
  -v drone-vol:/data \
  -e DRONE_GITEA_SERVER=http://gitea:80 \
  -e DRONE_GITEA_CLIENT_ID=614223ea-564a-4ee8-b174-eb456c84453e \
  -e DRONE_GITEA_CLIENT_SECRET=iyQnme5ksGju5zxJhdDaYAXvmywt6pmpqcts9VjKVeE=\
  -e DRONE_RPC_SECRET=f6b2b9931bdcc2dee834cbaf3d8aced2 \
  -e DRONE_SERVER_HOST=drone:80 \
  -e DRONE_SERVER_PROTO=http://drone:80 \
  --detach=true \
  drone/drone:1