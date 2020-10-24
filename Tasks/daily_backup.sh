#!/bin/bash

now=$(date +"%y%m%d%H%M")
mysqldump -h 172.20.10.10 -u root -pasdf0000 iom5 > $now.sql
tar -czvf $now.tar.gz $now.sql
mv $now.tar.gz /backup/ftp_data/toc
rm $now.sql
