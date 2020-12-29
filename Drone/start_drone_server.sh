#!/bin/bash

docker volume create drone-vol
docker run --name=drone \
  --network=tocvlan \
  --link=gitea \
  --ip=172.20.10.99 \
  --env-file ./drone.env \
  -v drone-vol:/data \
  -e DRONE_GITEA_SERVER=${DRONE_GITEA_SERVER} \
  -e DRONE_GITEA_CLIENT_ID=${DRONE_GITEA_CLIENT_ID} \
  -e DRONE_GITEA_CLIENT_SECRET=${DRONE_GITEA_CLIENT_SECRET} \
  -e DRONE_RPC_SECRET=${DRONE_RPC_SECRET} \
  -e DRONE_SERVER_HOST=${DRONE_SERVER_HOST} \
  -e DRONE_SERVER_PROTO=${DRONE_SERVER_PROTO} \
  --detach=true \
  drone/drone:1