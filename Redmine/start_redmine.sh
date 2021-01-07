#!/bin/bash

docker stop redmine
docker system prune --volumes -f

docker run -d --name redmine \
    --network=tocvlan \
    --ip=172.20.10.210 \
    --restart always \
    --link tocsql \
    -v /home/toc/redmine_files:/usr/src/redmine/files \
    -e TZ="Asia/Taipei" \
    -e REDMINE_DB_MYSQL=tocsql \
    -e REDMINE_DB_USERNAME=root \
    -e REDMINE_DB_PASSWORD=asdf0000 \
    -e REDMINE_DB_NAME=redmine \
    -e REDMINE_USERNAME=admin \
    -e REDMINE_PASSWORD=admin \
    -e SMTP_HOST=smtp.gmail.com \
    -e SMTP_PORT=587 \
    -e SMTP_USER=minnotec.aiom@gmail.com \
    -e SMTP_PASSWORD=Mit82589155 \
    toc-redmine