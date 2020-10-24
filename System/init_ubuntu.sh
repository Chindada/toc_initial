#!/bin/bash

apt update -y
apt upgrade -y
apt autoremove -y

apt install git -y
apt install net-tools -y
apt install bridge-utils -y
apt install nmap -y
apt install ntp -y

# apt install mariadb-server -y
# systemctl disable mysql
# curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | bash
# apt install git-lfs
# git lfs install

