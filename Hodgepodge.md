```sh
docker stop handyboss
docker system prune --volumes -f
docker rmi 172.20.10.70:5000/handyboss
docker pull 172.20.10.70:5000/handyboss
docker run -d --name handyboss \
  --network tocvlan \
  --ip=172.20.10.73 \
  --restart always \
  172.20.10.70:5000/handyboss

```

```sh
docker stop handyboss
docker system prune --volumes -f
docker rmi handyboss
docker build --rm -f "Dockerfile" \
             -t handyboss .
docker run -d --name handyboss \
  --network tocvlan \
  --ip=172.20.10.73 \
  --restart always \
  handyboss
docker system prune --volumes -f

```
