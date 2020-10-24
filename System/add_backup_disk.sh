#!/bin/bash

apt install parted -y
parted /dev/sdb mklabel msdos -s
parted -a opt /dev/sdb mkpart primary ext4 0% 100%
mkfs.ext4 -L backup /dev/sdb1 -F
wait
mkdir -p /backup
command="LABEL=backup /backup ext4 defaults 0 2"
echo $command >> /etc/fstab

