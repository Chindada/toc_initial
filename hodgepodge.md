DROP DATABASE redmine;
CREATE DATABASE redmine CHARACTER SET utf8 COLLATE utf8_general_ci;

docker volume create redmine-vol
docker run -d --name redmine \
    --network=aiomlan \
    --ip=192.168.10.9 \
    --mac-address=24:5E:BE:39:5D:11 \
    --dns=8.8.8.8 \
    --restart always \
    -v redmine-vol:/usr/src/redmine/files \
	-e TZ="Asia/Taipei" \
    -e REDMINE_DB_MYSQL=192.168.10.20 \
    -e REDMINE_DB_USERNAME=aiom \
    -e REDMINE_DB_PASSWORD=Minnotec2025 \
    -e REDMINE_DB_NAME=redmine \
    -e REDMINE_USERNAME=admin \
    -e REDMINE_PASSWORD=admin \
    -e SMTP_HOST=smtp.gmail.com \
    -e SMTP_PORT=587 \
    -e SMTP_USER=minnotec.aiom@gmail.com \
    -e SMTP_PASSWORD=Mit82589155 \
    redmine_aiom   //此映像檔已建立敏捷插件
	
/*補充SMTP設定失敗的重建方式*/
//1. 進入redmine container 路徑 /usr/src/redmine/config 找到檔案 configuration.yml.example
//2. 複製configuration.yml.example成立configuration.yml // cp + 複製檔  + 建立檔
//3. 使用vim / nano 編輯configuration.yml 找到Gmail段落設定好變數 再刪除前段 # 註解符號
//4. 重啟Redmine 使用管理者帳號寄出測試信件 
//5. 有收到信就是成功	
//redmine data on nas:/share/CACHEDEV1_DATA/Container/container-station-data/lib/docker/volumes/redmine-vol/_data	

docker volume create gitea-vol
docker run -d --name gitea \
    --network=aiomlan \
    --ip=192.168.10.8 \
    --mac-address=24:5E:BE:39:5D:22 \
    --dns=8.8.8.8 \
    --restart always \
    -v gitea-vol:/data \
	-e TZ="Asia/Taipei" \
    -e USER_UID=0 \
    -e USER_GID=0 \
    -e HTTP_PORT=80 \
    gitea/gitea:1.11.5
//gitea data on nas:/share/CACHEDEV1_DATA/Container/container-station-data/lib/docker/volumes/gitea-vol/_data	

資料庫設定
MySQL
192.168.10.20:3306
aiom
Minnotec2025
gitea
utf8

docker volume create openkm-vol
docker run -d --name openkm \
	--network=aiomlan \
	--ip=192.168.10.7 \
	--mac-address=24:5E:BE:39:5D:33 \
	--dns=8.8.8.8 --restart always \
	-v openkm-vol:/opt/openkm/repository \
	-e TZ="Asia/Taipei" \
	openkm/openkm-ce 

docker run -d --name openkm \
	--network=aiomlan \
	--ip=192.168.10.7 \
	--mac-address=24:5E:BE:39:5D:33 \
	--dns=8.8.8.8 --restart always \
	-v openkm-vol:/opt/openkm/repository \
	-e TZ="Asia/Taipei" \
	openkm_aiom	
//openkm data on nas:/share/CACHEDEV1_DATA/Container/container-station-data/lib/docker/volumes/openkm-vol/_data

//繁體中文安裝包:https://www.openkm.com/wiki/images/7/79/OpenKM_6_zh-TW.sql	
/*------------------以下是實驗性語法.需驗證再使用----------------------*/	
{
	# 創建兩個 macvlan 子接口 
	ip link add link enp0s8 dev mac1 type macvlan mode bridge 
	ip link add link enp0s8 dev mac2 type macvlan mode bridge 
	# 創建兩個 namespace 
	ip netns add ns1 
	ip netns add ns2 
	# 將兩個子接口分別掛到兩個 namespace 中 
	ip link set mac1 netns ns1 
	ip link set mac2 netns ns2 
	# 配置 IP 並啟用 
	ip netns exec ns1 ip a a 192.168.56.122/24 dev mac1 
	ip netns exec ns1 ip l s mac1 up ip netns exec ns1 ip a a 192.168.56.123/24 dev mac2 
	ip netns exec ns2 ip l s mac2 up
	
	# ip link set dev <interface> up
	# ip link set dev <interface> down
	# 掛載路由器
	route add -host 192.168.10.69 gw 192.168.10.1 dev virtual0 //新增
	route del -net 192.168.10.69 gw 0.0.0.0 netmask 255.255.255.255 dev virtual0 //刪除
		
	/*--------------------*/
	ip link add virtual link eth0 type macvlan mode bridge
	ip address add 192.168.10.69/32 dev  virtual
	/*--------------------*/	
//---------------------------MariaDB docker //可用
docker run --name aiomdb \
    --network=aiomlan \
    --ip=192.168.10.6 \
    --dns=8.8.8.8 \
    --restart always \
    -e MYSQL_ROOT_PASSWORD=Minnotec2025 \
    -e MYSQL_ROOT_HOST="%" \
    -d mariadb:10.5.2	
	
//---------------------------Dokuwiki docker
docker run -d --name dokuwiki \ 
-net=aiomlan \
--ip=192.168.10.7 \
--mac-address=24:5E:BE:39:5D:33 \
--dns=8.8.8.8 \
--restart always \
-v /docker_data/dokuwiki:/bitnami \
-e TZ=Asia/Taipei \
-e DOKUWIKI_WIKI_NAME=AIoM Wiki \
-e DOKUWIKI_USERNAME=aiom \
-e DOKUWIKI_FULL_NAME=AIoM \
-e DOKUWIKI_PASSWORD=Minnotec2025 \ 
-e PHP_MEMORY_LIMIT=4096m bitnami/dokuwiki

一行式: docker run -d --name dokuwiki --network=aiomlan --ip=192.168.10.7 --mac-address=24:5E:BE:39:5D:33 --dns=8.8.8.8 --restart always -v /docker_data/dokuwiki:/bitnami -e TZ=Asia/Taipei -e DOKUWIKI_WIKI_NAME=Wiki -e DOKUWIKI_USERNAME=aiom -e DOKUWIKI_PASSWORD=Minnotec2025 bitnami/dokuwiki
	
//參考網址 : https://github.com/bitnami/bitnami-docker-dokuwiki#readme	
//DB插件 : https://www.dokuwiki.org/plugin:database2	
//SMTP插件:https://codeload.github.com/splitbrain/dokuwiki-plugin-smtp/legacy.zip/master

/*..........*///mediawiki
docker run -d --name mediawiki \ 
	--network=aiomlan \
	--ip=192.168.10.7 \
	--mac-address=24:5E:BE:39:5D:33 \
	--dns=8.8.8.8 \
	--restart always \
	-v /docker_data/mediawiki:/bitnami \
	-e TZ=Asia/Taipei \
	-e MEDIAWIKI_USERNAME=aiom \
	-e MEDIAWIKI_PASSWORD=Minnotec2025 \
	-e MEDIAWIKI_WIKI_NAME=AIoM \  
	-e MEDIAWIKI_EMAIL=minnotec.aiom@gmail.com \ 
	-e MARIADB_HOST=192.168.10.20 \
	-e MARIADB_PORT_NUMBER=3306 \
	-e MEDIAWIKI_DATABASE_NAME=mediawiki \
	-e MEDIAWIKI_DATABASE_USER=aiom \
	-e MEDIAWIKI_DATABASE_PASSWORD=Minnotec2025 \
	-e SMTP_HOST=smtp.gmail.com \
	-e SMTP_HOST_ID=minnotec.com \
	-e SMTP_PORT=587 \
	-e SMTP_USER=minnotec.aiom@gmail.com \
	-e SMTP_PASSWORD=Mit82589155 \
	bitnami/mediawiki	
}	
/*
OpenDocMan Demo : http://demo.opendocman.com/
普通用戶：
用戶名：demo
密碼：demo

管理員用戶：
用戶名：admin
密碼：admin
*/


/*-----------------------*/ //redmine 插件安裝
cd /share/AIoM 


/usr/src/redmine/files
/share/CACHEDEV1_DATA/Container/container-station-data/lib/docker/volumes/redmine-vol/_data

/usr/src/redmine/plugins


rake redmine：plugins：process_version_change RAILS_ENV = productioncd mv
 rake redmine:plugins:migunrate RAILS_ENV=productioncd 
 
 Minnotec2025
 