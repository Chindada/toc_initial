#!/bin/bash

docker stop s5system
docker stop s5data
docker stop s5edge
docker stop c5system
docker system prune --volumes -f

