#!/bin/bash

docker volume create drone-vol
docker run --name=drone \
  --network=tocvlan \
  --ip=172.20.10.99 \
  --volume=drone-vol:/data \
  --env-file=./drone.env \
  --env=DRONE_GITEA_SERVER=${DRONE_GITEA_SERVER} \
  --env=DRONE_GITEA_CLIENT_ID=${DRONE_GITEA_CLIENT_ID} \
  --env=DRONE_GITEA_CLIENT_SECRET=${DRONE_GITEA_CLIENT_SECRET} \
  --env=DRONE_RPC_SECRET=${DRONE_RPC_SECRET} \
  --env=DRONE_SERVER_HOST=${DRONE_SERVER_HOST} \
  --env=DRONE_SERVER_PROTO=${DRONE_SERVER_PROTO} \
  --detach=true \
  drone/drone:1