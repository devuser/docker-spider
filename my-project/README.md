ReportServer 前端
=================

> A Vue.js project

Build Setup
-----------

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

环境准备工作
------------

首次启动Docker容器

```
docker run -it --name node-spider  -v $HOME/working/docker-spider:/usr/src/myapp -w /usr/src/myapp -p 43000:3000 -p 48080:8080 -p 40080:80 xiehuanang/node /bin/bash
```

再次启动Docker容器

```
docker start node-spider
```

进入已经启动的Docker容器

```
docker exec -it node-spider bash
```

安装所有需要的插件

```
npm install jquery-weui
npm install vue@csp
npm install -g vue-cli
vue init webpack my-project
$ cd my-project
$ npm install
$ npm run dev
```

在Mac环境下安装gem的淘宝镜像

```
$ gem sources --add https://ruby.taobao.org/ --remove https://rubygems.org/
$ gem sources -l
*** CURRENT SOURCES ***

https://ruby.taobao.org
# 请确保只有 ruby.taobao.org
$ gem install rails
```

create a new project using the "webpack" boilerplate
====================================================

$ vue init webpack my-project

install dependencies and go!
============================

$ cd my-project $ npm install $ npm run dev

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
