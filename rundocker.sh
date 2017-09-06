#!/bin/sh
docker run --rm -it --name node-spider  -v $PWD:/usr/src/myapp -w /usr/src/myapp -p 43000:3000 -p 48080:8080 -p 40080:80 xiehuanang/node /bin/bash
