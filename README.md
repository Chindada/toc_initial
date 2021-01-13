# ToC Initial

## Getting Started

Just Run

### Prerequisites

What things you need to install the software and how to install them

```
cd /
rm -rf toc
mkdir toc
cd toc
git clone http://github.com/Chindada/toc_initial.git
cd toc_initial
chmod 777 chmod.sh
./chmod.sh

docker rmi $(docker images -a -q)
docker system prune --volumes -f
```
## IP Table

- 192.168.10.10: MariaDB - 3306
- 192.168.10.50: Gitea - 80
- 192.168.10.70: Docker Registry - 5000
- 192.168.10.71: Docker Registry UI - 80
- 192.168.10.98: Drone Runner - 80
- 192.168.10.99: Drone Server - 80
- 192.168.10.210: Redmine
- 192.168.10.220: Nginx - 80

## Deployment

Add additional notes about how to deploy this on a live system

## Authors

- **Tim Hsu** 

