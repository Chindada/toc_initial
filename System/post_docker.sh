#!/bin/bash

groupadd docker
usermod -aG docker toc

setting='{ "iptables": false, "bridge": "none" }'

echo $setting > /etc/docker/daemon.json
systemctl daemon-reload
systemctl restart docker

