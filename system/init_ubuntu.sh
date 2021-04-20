#!/bin/bash

apt update -y
apt upgrade -y
apt autoremove -y

# apt install git -y
apt install net-tools -y
# apt install bridge-utils -y
# apt install nmap -y
# apt install ntp -y

# apt install mariadb-server -y
# systemctl disable mysql

# 20210420
timhsukey="ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBLITYOqhGW3xZYOaIVTrl+FGXF7TYftOPvdUW9Y9y5W maochindada@gmail.com"
mkdir /home/$USER/.ssh
echo $timhsukey > /home/$USER/.ssh/authorized_keys

