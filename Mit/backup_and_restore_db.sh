#!/bin/bash

dbHost=192.168.10.240
dbUser=root
dbPass=Minnotec2025
dbPort=3306

rm -rf ~/minnotec_backup
mkdir ~/minnotec_backup
cd minnotec_backup
mysqldump -u $dbUser -p$dbPass -h $dbHost -P $dbPort gitea > gitea.sql
mysqldump -u $dbUser -p$dbPass -h $dbHost -P $dbPort redmine > redmine.sql
echo 'DROP DATABASE redmine;
CREATE DATABASE redmine CHARACTER SET utf8 COLLATE utf8_general_ci;
DROP DATABASE gitea;
CREATE DATABASE gitea CHARACTER SET utf8 COLLATE utf8_general_ci;' >> tmp.sql
mysql -u $dbUser -p$dbPass -h $dbHost -P $dbPort --force < tmp.sql
rm tmp.sql
echo "Import gitea"
mysql -u $dbUser -p$dbPass -h $dbHost -P $dbPort gitea < gitea.sql
echo "Import redmine"
mysql -u $dbUser -p$dbPass -h $dbHost -P $dbPort redmine < redmine.sql
