#!/bin/bash

docker system prune --volumes -f
docker network create -d macvlan \
  --subnet=192.168.10.0/24 \
  --gateway=192.168.10.1 \
  -o parent=eth1 \
  dockervlan
  