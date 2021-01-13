#!/bin/bash

docker stop gitea
docker system prune --volumes -f
rm -rf /share/Docker_data/gitea_data/gitea
rm -rf /share/Docker_data/gitea_data/ssh
docker run --name gitea \
    --network=dockervlan \
    --ip=192.168.10.3 \
    --dns=8.8.8.8 \
    --restart always \
    --link mariadb \
    -e APP_NAME="Minnotec RD Gitea" \
    -e RUN_MODE="prod" \
    -e DOMAIN="192.168.10.8" \
    -e SSH_DOMAIN="192.168.10.3" \
    -e SSH_LISTEN_PORT=22 \
    -e SSH_PORT=22 \
    -e DISABLE_SSH="false" \
    -e HTTP_PORT=3000 \
    -e DB_TYPE="mysql" \
    -e DB_HOST="mariadb:3306" \
    -e DB_NAME="gitea" \
    -e DB_USER="root" \
    -e DB_PASSWD="Minnotec2025" \
    -e REQUIRE_SIGNIN_VIEW="true" \
    -e USER_UID=1500 \
    -e USER_GID=1500 \
    -v /share/Docker_data/gitea_data:/data \
    -v /etc/localtime:/etc/localtime:ro \
    -v /share/homes/git/.ssh/:/data/git/.ssh \
    -d gitea/gitea:1.12.5

rm /share/homes/git/.ssh/authorized_keys
echo "$(cat /share/homes/git/.ssh/id_ed25519.pub)" >> /share/homes/git/.ssh/authorized_keys
chown -R git:git /share/homes/git/.ssh

rm -rf /app
mkdir /app
mkdir /app/gitea
echo 'ssh -o StrictHostKeyChecking=no git@192.168.10.3 "SSH_ORIGINAL_COMMAND=\"$SSH_ORIGINAL_COMMAND\" $0 $@"' >> /app/gitea/gitea
chmod +x /app/gitea/gitea
chown -R git:git /app

