#!/bin/bash

docker stop drone
docker system prune --volumes -f

docker run --name drone \
  --network=dockervlan \
  --ip=192.168.10.236 \
  --restart always \
  -v /docker_data/drone:/data \
  -e DRONE_GITEA_SERVER=http://192.168.10.8/ \
  -e DRONE_GITEA_CLIENT_ID=614223ea-564a-4ee8-b174-eb456c84453e \
  -e DRONE_GITEA_CLIENT_SECRET=-eelbfVUEo61-wFnJePi-2300W9DF3a4rpb5hstoySs= \
  -e DRONE_RPC_SECRET=f6b2b9931bdcc2dee834cbaf3d8aced2 \
  -e DRONE_SERVER_HOST=192.168.10.236 \
  -e DRONE_SERVER_PROTO=http \
  -e DRONE_GIT_ALWAYS_AUTH=true \
  --detach=true \
  drone/drone:1
