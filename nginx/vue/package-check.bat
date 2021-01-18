cd /d %~dp0

RD /S /Q .\node_modules
RD /S /Q .\dist

call npm cache rm --force
call npm-check -y
call npm-check -g -y
call npm i
call npm cache verify

@pause
