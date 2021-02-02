# ToC Initial

## Getting Started

Just Run

### Prerequisites

What things you need to install the software and how to install them

```sh
cd ~
rm -rf setup
mkdir setup
cd setup
git clone http://github.com/Chindada/toc_initial.git
cd toc_initial
chmod -R 777 ./
```

```sh
docker rmi $(docker images -a -q)
docker system prune --volumes -f
docker restart $(docker ps -q)
```

## Deployment

Add additional notes about how to deploy this on a live system

## Authors

- **Tim Hsu** 

