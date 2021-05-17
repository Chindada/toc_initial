#!/bin/bash

groupadd docker
usermod -aG docker timhsu

registries_ip="172.20.10.70"

setting='
{
  "insecure-registries" : ["'$registries_ip':5000"],
  "iptables": false, 
  "bridge": "none"
}'

local='
{
  "insecure-registries" : ["'$registries_ip':5000"]
}'

echo $local > /etc/docker/daemon.json
systemctl daemon-reload
systemctl restart docker

