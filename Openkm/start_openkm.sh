#!/bin/bash

docker stop openkm
docker system prune --volumes -f

docker run -d --name openkm \
    --network=tocvlan \
    --ip=172.20.10.220 \
    --restart always \
	-e TZ="Asia/Taipei" \
    openkm/openkm-ce