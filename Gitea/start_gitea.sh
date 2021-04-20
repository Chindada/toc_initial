#!/bin/bash

docker stop gitea
docker system prune --volumes -f

rm -rf $HOME/gitea_data
echo 'DROP DATABASE gitea;
CREATE DATABASE gitea CHARACTER SET utf8 COLLATE utf8_general_ci;' >> tmp.sql
mysql -u root -pasdf0000 -h 172.20.10.10 -P 3306 --force < tmp.sql
rm tmp.sql

docker run --name gitea \
  --network=tocvlan \
  --ip=172.20.10.50 \
  --dns=8.8.8.8 \
  --restart always \
  --link tocsql \
  -e APP_NAME="ToC Gitea" \
  -e RUN_MODE="prod" \
  -e DOMAIN="172.20.10.50" \
  -e SSH_DOMAIN="172.20.10.50" \
  -e SSH_LISTEN_PORT=22 \
  -e SSH_PORT=22 \
  -e DISABLE_SSH="false" \
  -e HTTP_PORT=80 \
  -e DB_TYPE="mysql" \
  -e DB_HOST="tocsql:3306" \
  -e DB_NAME="gitea" \
  -e DB_USER="root" \
  -e DB_PASSWD="asdf0000" \
  -e REQUIRE_SIGNIN_VIEW="true" \
  -e USER_UID=1500 \
  -e USER_GID=1500 \
  -v $HOME/gitea_data:/data \
  -v $HOME/.ssh/:/data/git/.ssh \
  -v /etc/localtime:/etc/localtime:ro \
  -d gitea/gitea:1.14.1

# rm $HOME/.ssh/authorized_keys
echo "$(cat $HOME/.ssh/id_ed25519.pub)" >> $HOME/.ssh/authorized_keys

rm -rf /app
mkdir /app
mkdir /app/gitea
echo 'ssh -o StrictHostKeyChecking=no git@172.20.10.50 "SSH_ORIGINAL_COMMAND=\"$SSH_ORIGINAL_COMMAND\" $0 $@"' >> /app/gitea/gitea
chmod +x /app/gitea/gitea
# chown -R git:git /app
