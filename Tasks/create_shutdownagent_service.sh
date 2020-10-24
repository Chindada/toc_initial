#!/bin/bash

rm /etc/systemd/system/shutdownagent.service
cp shutdownagent.service /etc/systemd/system
chmod +644 /etc/systemd/system/shutdownagent.service
systemctl daemon-reload
systemctl enable shutdownagent
systemctl start shutdownagent
systemctl status shutdownagent