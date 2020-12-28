#!/bin/bash

# sudo -u git ssh-keygen -t rsa -b 4096 -C "mao123123123"
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
echo 'ssh -o StrictHostKeyChecking=no git@172.20.10.50 "SSH_ORIGINAL_COMMAND=\"$SSH_ORIGINAL_COMMAND\" $0 $@"' >> gitea
chmod +x /app/gitea/gitea
cd /app
chown -R git:git gitea

cd
rm -rf /var/lib/gitea
mkdir /var/lib/gitea
mkdir /var/lib/gitea/git
mkdir /var/lib/gitea/git/.ssh
# rm /var/lib/gitea/git/.ssh/authorized_keys
rm /home/git/.ssh/authorized_keys
ln -s /var/lib/gitea/git/.ssh/authorized_keys /home/git/.ssh/authorized_keys
echo "no-port-forwarding,no-X11-forwarding,no-agent-forwarding,no-pty $(cat /home/git/.ssh/id_rsa.pub)" >> /var/lib/gitea/git/.ssh/authorized_keys
cd /var/lib
chown -R git:git gitea

docker run --name gitea \
    --network=tocvlan \
    --ip=172.20.10.50 \
    --restart always \
    --link tocsql \
    -e APP_NAME="Gitea" \
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
    -v /var/lib/gitea:/data \
    -v /etc/timezone:/etc/timezone:ro \
    -v /etc/localtime:/etc/localtime:ro \
    -d gitea/gitea:1.12.5

echo "[ssh]" >> /var/lib/gitea/gitea/conf/app.ini
echo "SSH_BACKUP_AUTHORIZED_KEYS=false" >> /var/lib/gitea/gitea/conf/app.ini
docker container restart gitea

