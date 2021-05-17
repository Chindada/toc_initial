#!/bin/bash

docker stop drone
docker system prune --volumes -f

docker run --name drone \
  --network=tocvlan \
  --ip=172.20.10.99 \
  --restart always \
  -v /var/lib/drone:/data \
  -e DRONE_GITEA_SERVER=http://172.20.10.50/ \
  -e DRONE_GITEA_CLIENT_ID=e0693cdb-8621-45fa-abae-786cb1decac0 \
  -e DRONE_GITEA_CLIENT_SECRET=xxVrtoHdQidU8iynUEq7nEkcyK6E2iBeb7wLYJfMLno= \
  -e DRONE_RPC_SECRET=f6b2b9931bdcc2dee834cbaf3d8aced2 \
  -e DRONE_RPC_HOST=172.20.10.99 \
  -e DRONE_RPC_PROTO=http \
  -e DRONE_SERVER_HOST=172.20.10.99 \
  -e DRONE_SERVER_PROTO=http \
  -e DRONE_GIT_ALWAYS_AUTH=true \
  --detach=true \
  drone/drone:1
  