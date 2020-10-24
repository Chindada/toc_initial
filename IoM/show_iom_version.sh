#!/bin/bash

cd /var/lib/docker/volumes/s5system-vol/_data
sqlite3
.open srv.db
select * from sys_setting;
.quit
