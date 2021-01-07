#!/bin/bash

docker stop redmine
docker system prune --volumes -f

docker run -d --name redmine \
    --network=dockervlan \
    --ip=192.168.10.9 \
    --dns=8.8.8.8 \
    --restart always \
    --link mariadb \
    -v /share/Docker_data/redmine_data:/usr/src/redmine/files \
    -e TZ="Asia/Taipei" \
    -e REDMINE_DB_MYSQL=mariadb \
    -e REDMINE_DB_USERNAME=root \
    -e REDMINE_DB_PASSWORD=Minnotec2025 \
    -e REDMINE_DB_NAME=redmine \
    redmine_mit


    -e SMTP_HOST=smtp.gmail.com \
    -e SMTP_PORT=587 \
    -e SMTP_USER=minnotec.aiom@gmail.com \
    -e SMTP_PASSWORD=Mit82589155 \