#!/bin/bash

dbHost=172.20.10.10
dbUser=root
dbPass=asdf0000
dbPort=3306

echo 'DROP DATABASE redmine;
CREATE DATABASE redmine CHARACTER SET utf8 COLLATE utf8_general_ci;' >> tmp.sql
mysql -u $dbUser -p$dbPass -h $dbHost -P $dbPort --force < tmp.sql
rm tmp.sql
