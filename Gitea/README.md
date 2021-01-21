
```
useradd -u 1500 -m git
ssh-keygen -t ed25519 -C "maochindada@gmail.com"
ssh-keygen -t ed25519 -C "tim.hsu@minnotec.com"
/home/git/.ssh/id_ed25519


ssh-keygen -t ed25519 -C "build@minnotec.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519


```