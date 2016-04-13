#!/bin/sh
docker run -it --rm --name node-spider  -v /Users/devuser/working/docker-spider:/usr/src/myapp -w /usr/src/myapp -p 43000:3000 -p 48080:8080 -p 40080:80 xiehuanang/node /bin/bash
