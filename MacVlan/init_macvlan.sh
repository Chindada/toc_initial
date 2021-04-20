#!/bin/bash

docker system prune --volumes -f
docker network create -d macvlan \
  --subnet=172.20.10.0/24 \
  --gateway=172.20.10.1 \
  -o parent=eth0 \
  tocvlan
