# ToC Initial

## Getting Started

Just Run

### Prerequisites

What things you need to install the software and how to install them

```sh
sudo xcode-select --install

ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -q -N "" -C "toc@gmail.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
cat ~/.ssh/id_ed25519.pub
```

```sh
cd ~
git clone http://github.com/Chindada/toc_initial.git
cd toc_initial
chmod -R 777 ./
```
```sh
flutter doctor
flutter doctor --android-licenses
flutter pub global activate devtools
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

