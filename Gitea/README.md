# Read me

```
useradd -u 1500 -m git
ssh-keygen -t ed25519 -C "maochindada@gmail.com"
/home/git/.ssh/id_ed25519

ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519 -q -N "" -C "maochindada@gmail.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
ssh-keyscan 192.168.10.239
```