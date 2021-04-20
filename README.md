# ToC Initial

### Prerequisites
```sh
userpasword=123
```
```sh
echo '#!/bin/bash
rootpasword=123
echo -e "$rootpasword\n$rootpasword" | passwd root
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -q -N "" -C $HOSTNAME
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
ssh-keyscan github.com > ~/.ssh/known_hosts
echo "PermitRootLogin yes" >> /etc/ssh/sshd_config.d/toc.conf
cat ~/.ssh/id_ed25519.pub' > ./first_init.sh
chmod 777 ./first_init.sh
echo "$userpasword" | sudo -S ./first_init.sh
rm -f ./first_init.sh
ls
```
```sh
git clone git@github.com:Chindada/toc_initial.git
```
## Deployment
## Authors
- **Tim Hsu** 

