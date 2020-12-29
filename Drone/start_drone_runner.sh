#!/bin/bash

docker stop runner
docker system prune --volumes -f

docker volume create drone-runner-vol
docker run -d --name runner \
  --network tocvlan \
  --ip=172.20.10.98 \
  --dns 8.8.8.8 \
  --restart always \
  -v drone-runner-vol:/var/run/docker.sock \
  -e DRONE_RPC_PROTO=http \
  -e DRONE_RPC_HOST=chintoc.asuscomm.com:9000 \
  -e DRONE_RPC_SECRET=f6b2b9931bdcc2dee834cbaf3d8aced2 \
  -e DRONE_RUNNER_CAPACITY=2 \
  -e DRONE_RUNNER_NAME=runner \
  drone/drone-runner-docker:1