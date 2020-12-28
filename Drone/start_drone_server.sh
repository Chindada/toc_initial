#!/bin/bash


docker volume create s5system-vol
docker run --name gitea \
    --network=tocvlan \
    --ip=172.20.10.50 \
    --restart always \
    -e APP_NAME="Gitea" \
    -e RUN_MODE="prod" \
    -e DOMAIN="172.20.10.50" \
    -e SSH_DOMAIN="172.20.10.50" \
    -e SSH_LISTEN_PORT=22 \
    -e SSH_PORT=22 \
    -e DISABLE_SSH="false" \
    -e HTTP_PORT=80 \
    -e DB_TYPE="mysql" \
    -e DB_HOST="172.20.10.100:3306" \
    -e DB_NAME="gitea" \
    -e DB_USER="root" \
    -e DB_PASSWD="asdf0000" \
    -e REQUIRE_SIGNIN_VIEW="true" \
    -e USER_UID=1500 \
    -e USER_GID=1500 \
    -v s5system-vol:/data \
    -d drone/drone:1