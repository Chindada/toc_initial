#!/bin/bash

dbHost=172.20.10.10
dbUser=root
dbPass=asdf0000
dbPort=3306

cd /home/toc
mkdir minnotec
cd minnotec
rm gitea.sql redmine.sql
mysqldump -u $dbUser -p$dbPass -h $dbHost -P $dbPort gitea > gitea.sql
mysqldump -u $dbUser -p$dbPass -h $dbHost -P $dbPort redmine > redmine.sql
echo 'DROP DATABASE redmine;
CREATE DATABASE redmine CHARACTER SET utf8 COLLATE utf8_general_ci;
DROP DATABASE gitea;
CREATE DATABASE gitea CHARACTER SET utf8 COLLATE utf8_general_ci;' >> tmp.sql
mysql -u $dbUser -p$dbPass -h $dbHost -P $dbPort --force < tmp.sql
rm tmp.sql
mysqldump -u $dbUser -p$dbPass -h $dbHost -P $dbPort gitea < gitea.sql
mysqldump -u $dbUser -p$dbPass -h $dbHost -P $dbPort redmine < redmine.sql
