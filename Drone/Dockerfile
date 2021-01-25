FROM golang:1.13.15
# USER root
# System Init
RUN apt update -y && apt upgrade -y
RUN apt install fonts-wqy-zenhei -y && fc-cache -v
RUN apt autoremove -y
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && apt install ./google-chrome-stable_current_amd64.deb -y
# Build ENV
ENV GO111MODULE=on
ENV TZ=Asia/Taipei
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /go/src/app
COPY . .
RUN date +"%Y/%m/%d-%T" >> version.txt
RUN go build -o s5system

ENTRYPOINT /go/src/app/s5system
EXPOSE 8887





