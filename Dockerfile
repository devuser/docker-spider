FROM node:alpine

RUN npm install -g nrm  \
  &&  nrm use npm

RUN npm install -g express \
    &&  npm install -g url \
    &&  npm install -g superagent  \
    &&  npm install -g cheerio \
    &&  npm install -g eventproxy \
    &&  npm install -g webpack \
    &&  npm install -g react \
    &&  npm install -g react-dom  \
    &&  npm install -g express  \
    &&  npm install -g grunt-cli    \
    &&  npm install -g yo    \
    &&  npm install -g bower    \
    &&  npm install g vue-cli \
    &&  npm install -g gulp
    #  \
    # &&  npm install -g vuetable  \
    # &&  npm install -g vue-resource  \
    # &&  npm install -g vue-router  \
    # &&  npm install -g vue-tables  \
    # &&  npm install -g vue-lazyload \
    # &&  npm install -g vue-validator  \
    # &&  npm install -g react-native-cli \
    # &&  npm install -g electron-prebuilt \
    # &&  npm install -g scrat \
    # &&  npm install -g cross-env \
    # &&  npm install -g koa \
    # &&  npm install -g iview \
    # &&  npm install -g vue-strap
RUN npm install ant-design-pro-cli -g    
CMD [ "node" ]
