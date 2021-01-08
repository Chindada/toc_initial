#!/bin/bash

docker stop redmine
docker system prune --volumes -f
rm -rf /home/toc/redmine_files

docker run -d --name redmine \
    --network=tocvlan \
    --ip=172.20.10.210 \
    --restart always \
    --link tocsql \
    -v /home/toc/redmine_files:/usr/src/redmine/files \
    -e TZ="Asia/Taipei" \
    -e REDMINE_DB_MYSQL=tocsql \
    -e REDMINE_DB_ENCODING=utf8 \
    -e REDMINE_DB_NAME=redmine \
    -e REDMINE_DB_USERNAME=root \
    -e REDMINE_DB_PASSWORD=asdf0000 \
    toc-redmine