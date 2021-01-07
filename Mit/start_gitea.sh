#!/bin/bash

# sudo -u git ssh-keygen -t rsa -b 4096 -C "tim.hsu@minnotec.com"
# useradd -u 1500 -m git

docker stop gitea
docker system prune --volumes -f

cd /
rm -rf app
mkdir app
cd app
mkdir gitea
cd gitea
scriptheader=\!
echo "#$scriptheader/bin/sh" >> gitea
echo 'ssh -o StrictHostKeyChecking=no git@192.168.10.8 "SSH_ORIGINAL_COMMAND=\"$SSH_ORIGINAL_COMMAND\" $0 $@"' >> gitea
chmod +x /app/gitea/gitea
cd /app
chown -R admin:administrators gitea

cd
rm -rf /share/Docker_data/gitea_data/git/.ssh
mkdir /share/Docker_data/gitea_data/git/.ssh
rm /share/homes/admin/.ssh/authorized_keys
ln -s /share/Docker_data/gitea_data/git/.ssh/authorized_keys /share/homes/admin/.ssh/authorized_keys
echo "no-port-forwarding,no-X11-forwarding,no-agent-forwarding,no-pty $(cat /share/homes/admin/.ssh/id_rsa.pub)" >> /share/Docker_data/gitea_data/git/.ssh/authorized_keys
cd /share/Docker_data
chown -R admin:administrators gitea_data

docker run --name gitea \
    --network=dockervlan \
    --ip=192.168.10.8 \
    --restart always \
    --link mariadb \
    -e APP_NAME="Minnotec Gitea" \
    -e RUN_MODE="prod" \
    -e DOMAIN="192.168.10.8" \
    -e SSH_DOMAIN="192.168.10.8" \
    -e SSH_LISTEN_PORT=22 \
    -e SSH_PORT=22 \
    -e DISABLE_SSH="false" \
    -e HTTP_PORT=80 \
    -e DB_TYPE="mysql" \
    -e DB_HOST="mariadb:3306" \
    -e DB_NAME="gitea" \
    -e DB_USER="root" \
    -e DB_PASSWD="Minnotec2025" \
    -e REQUIRE_SIGNIN_VIEW="true" \
    -e USER_UID=0 \
    -e USER_GID=0 \
    -v /share/Docker_data/gitea_data:/data \
    -v /etc/localtime:/etc/localtime:ro \
    -d gitea/gitea:1.12.5

echo "[ssh]" >> /share/Docker_data/gitea_data/gitea/conf/app.ini
echo "SSH_BACKUP_AUTHORIZED_KEYS=false" >> /share/Docker_data/gitea_data/gitea/conf/app.ini
docker container restart gitea

