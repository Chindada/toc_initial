#!/bin/bash

docker container restart s5system
docker container restart s5data
docker container restart s5edge
docker container restart c5system

