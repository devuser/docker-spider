# 大麦爬虫安装指南
如下环境及代码运行于Docker 1.7 Node.js® 4.4.3

## Quick Start

如果您非常熟悉Docker和Node.js的话，建议您按照如下步骤快速构建。

1. 在当前文件夹之行如下命令构建容器  `docker build  --no-cache -t  xiehuanang/node .`
2. 启动容器 `docker run -it --rm --name node-spider  -v /Users/devuser/working/docker-spider:/usr/src/myapp -w /usr/src/myapp -p 43000:3000 -p 48080:8080 -p 40080:80 xiehuanang/node /bin/bash`
3. 执行命令导出大麦网的城市清单  `node damai-city.js`
4. 执行命令导出大麦网的场馆清单 `node damai-spider.js`


## 制作Docker
1. Windows／MacOS用户请谷歌并下载`boot2docker`
2. Linux用户请参考`https://github.com/devuser/docker-notes`
3. 从Github下载源代码 SSH方式`git@github.com:devuser/docker-spider.git`
4. 或HTTP方式`https://github.com/devuser/docker-spider.git`
5. 切换到您的日常工作目录，比如Windows系统的`C:/working`或Linux系统的`$HOME/working`
6. 执行下载源代码的建议命令 `git clone git@github.com:devuser/docker-spider.git`
7. 切换到clone下的文件夹，eg: `cd ~/working/docker-spider/`
8. 运行Docker的构建命令 `docker build -t docker-spider .`，或运行`docker build --no-cache -t  node-spider .`

```
- 特别注意命令末尾的点
- 该命令会从Docker-Hub下载`buildpack-deps:wheezy`
- 当然您可以修改 `Dockerfile`，选择基于您喜欢的Linux发行版本来构建
- 如果您追求Docker容器小的话，建议从Debian开始构建
- 某些情况下，如果网络状况好的话，建议使用参数 `--no-cache`强迫不使用缓存
- 上述命令会从官网下载指定版本的 `Node.js®`
```

目前Dockerfile中指定下载4.4.3版本的，您可以打开Dockerfile修改版本号

```
ENV NODE_VERSION 4.4.3
```

## 启动Docker容器
1. 打开Shell窗口
2. 确认您已经成功启动docker服务，运行`docker images`，确定您可以看到我们命名的镜像`node-spider`
3. 该假设您下载源代码在Node.js®安装步骤
4. 启动刚刚创建的`node-spider`容器

```
docker run -it --rm --name node-spider  -v /Users/devuser/working/docker-spider:/usr/src/myapp -w /usr/src/myapp node-spider /bin/bash
```

运行`node -v`确认`Node.js®`的版本号是4.4.3

```
root@832335e1f42f:/usr/src/myapp# node -v
v4.4.3
```

## 测试网络
在Docker容器中尝试运行如下命令，确定您可以访问大麦网

```
curl http://venue.damai.cn
```

## 尝试编写一个HelloWorld热身

```
touch hello.js
echo "console.log('hello, Node.js world.');" > hello.js
node hello.js
```

运行结果:

```
hello, Node.js world.
```

## 爬虫前的准备工作
安装若干爬虫依赖的包，个别包可能已经随Node核心自带了。但是为了安全意见，还是建议您逐次运行如下命令
1. `npm install express`
2. `npm install url`
3. `npm install superagent`
4. `npm install cheerio`
5. `npm install eventproxy`

## Express
`Express` 是一个简洁而灵活的 node.js Web应用框架, 提供一系列强大特性帮助你创建各种Web应用。

Express 不对 node.js 已有的特性进行二次抽象，我们只是在它之上扩展了Web应用所需的功能。

丰富的HTTP工具以及来自Connect框架的中间件随取随用，创建强健、友好的API变得快速又简单

## url
`url`包把相对路径的URL地址重新解包组合为绝对地址。

在爬虫过程中频繁使用，比如在网页(`http://www.sohu.com/`)内容搜索到 `image/sample.jpg`。

我们将其压入待处理队列，希望压入的是绝对地址 `http://www.sohu.com/image/sample.jpg`

## Superagent
`superagent` 使用superagent获取源数据

superagent就是ajax API来使用的Http库。

它的使用方法与jQuery差不多，我们通过它发起get请求，在回调函数中输出结果。

## Cheerio
使用 `cheerio` 解析

cheerio 充当服务器端的jQuery功能，我们先使用它的.load()来载入HTML，再通过CSS selector来筛选元素。

cheerio 支持CSS选择器，ID选择器，类型选择器。

## EventProxy
使用eventproxy作为时间代理，简化编程， 特别对于不太熟悉Node.js的同学来说，第一次编写爬虫，需要居于Node.js基础事件模型来处理异步事件， 是不可能。

什么异步事件呢？ 抓取主页，然后顺序抓取网页内容中若干二级页面，就出现了异步事件。 当然严格说起来，抓取主页时就出现了异步事件。
- 抓取主页
- 通过CSS选择器获取二级网页 page1、page2、page3
- 发起抓取page1、page2、page3的请求，这三个请求的结束时间不确定
- 等待上述三个请求全部结束后，进行汇总

后面会详细介绍抓取大麦场馆过程中的异步事件

## 我们的任务描述
目标描述

```
- 抓取大麦网27个关键城市的场馆清单
- 每个场馆的名称、城市、县市、场馆类型、地址、适演剧种、近期演出场次
```

- 关键信息1. 27个城市页面 `http://venue.damai.cn`
- 关键信息2. 在上述页面点开进入每个城市，可以看到该城市的所有场馆清单
- 关键信息3. 如果该城市场馆数量多的话，分页显示

## 抓取热身
抓取27个城市页面的网页内容，并全部打印出来

```
var express = require('express');
var url = require('url');
var superagent = require('superagent');
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');


var targetUrl = 'http://venue.damai.cn';
var cityurls = [];

superagent.get(targetUrl)
    .end(function (err, res) {
        console.log(res);
        console.log('cityurl count: ' + cityurls.length)
        });
```

屏幕上洋洋洒洒打印出来千万言，前半部分是网页内容 细心的话，可以看到如下关于城市场馆的内容

```
<dt><a target="_blank" title="苏州市 共有 72 个场馆" href="http://venue.damai.cn/search.aspx?cityID=1087">苏州市[<strong class="c4">72</strong>]</a></dt>\r\n
```

对应浏览器中显示

```
苏州市[72]
```

注意上述两个细节
- 类型`<a href`标签
- 链接地址可以使用正则表达式去筛选

打开`node－shell`，我们测试一下正则表达式 在Shell窗口输入 `node` 回车进入node-shell

```
> var foo = 'http://venue.damai.cn/search.aspx?cityID=1087'
undefined
> /cityID=(\d+)$/.test(foo)
true
```

上述正则表达式 `/cityID=(\d+)$/`测试通过

## 抓取27个城市

```
var express = require('express');
var url = require('url');
var superagent = require('superagent');
var cheerio = require('cheerio');

var targetUrl = 'http://venue.damai.cn';
var cityurls = [];
superagent.get(targetUrl)
    .end(function (err, res) {
        console.log(res);
        console.log("==========================")
        var $ = cheerio.load(res.text);
        $('a').each(function (idx, element){
            var $element = $(element);
            var href = $element.attr('href');

            if (/(cityID=[1-9])/.test(href)) {
                console.log(href);
                var fullhref = url.resolve(targetUrl, href);
                cityurls.push(fullhref);
            }
        });
        console.log(cityurls.length)
});
```

运行命令 `node damai-city.js` 可以看到如下结果，打印获取的27个城市页面的URL

```
http://venue.damai.cn/search.aspx?cityID=852
http://venue.damai.cn/search.aspx?cityID=872
http://venue.damai.cn/search.aspx?cityID=893
http://venue.damai.cn/search.aspx?cityID=906
http://venue.damai.cn/search.aspx?cityID=1209
http://venue.damai.cn/search.aspx?cityID=1377
http://venue.damai.cn/search.aspx?cityID=1580
http://venue.damai.cn/search.aspx?cityID=586
http://venue.damai.cn/search.aspx?cityID=3250
http://venue.damai.cn/search.aspx?cityID=1038
http://venue.damai.cn/search.aspx?cityID=200
http://venue.damai.cn/search.aspx?cityID=1087
http://venue.damai.cn/search.aspx?cityID=923
http://venue.damai.cn/search.aspx?cityID=372
http://venue.damai.cn/search.aspx?cityID=848
http://venue.damai.cn/search.aspx?cityID=1847
http://venue.damai.cn/search.aspx?cityID=1597
http://venue.damai.cn/search.aspx?cityID=917
http://venue.damai.cn/search.aspx?cityID=356
http://venue.damai.cn/search.aspx?cityID=1229
http://venue.damai.cn/search.aspx?cityID=702
http://venue.damai.cn/search.aspx?cityID=2024
http://venue.damai.cn/search.aspx?cityID=2148
http://venue.damai.cn/search.aspx?cityID=1835
http://venue.damai.cn/search.aspx?cityID=2648
http://venue.damai.cn/search.aspx?cityID=1077
http://venue.damai.cn/search.aspx?cityID=2103
27
```

## 抓取每个城市
复制上述获取的27个城市页面URL到 `damai-spider.js` 文件中

运行命令 `node damai-spider.js`

## 引入strict模式
确认您的node版本在4.4.3及以上版本， 在Node.js源文件头部增加一行, 注意一定在源代码的首行。 前头自然可以出现双斜线的注释。

```
'use strict';
```

引入strict模式后，可以使用关键字`let`可以让我们将变量的作用范围限定在一个代码块中

```

'use strict';
if (1) {
    let b = 2;
    console.log(b);       //2
}
console.log(typeof b); //undefined
```

严格模式的一大目标是让你能更快更方便的调试。

运行环境在发现问题时显性的抛出错误比默不做声的失败或怪异行事(未开启严格模式的JavaScript运行环境经常这样)要好。

严格模式会抛出更多错误,但这是好事, 因为这些错误会唤起你注意并修复很多以前很难被发现的潜在问题。

低版本的Node.js可能需要使用参数 `node --harmony damai-spider.js`。

但是我在4.4.3版本测试，无需关心这些参数，更不需要使用awk去启动strict模式的node-shell。

当然我是非完整性测试。

运行  `time node  damai-spider.js` 耗费时间如下:

```

get all citys.count 27
venue_count: 3316
end

real    0m4.265s
user    0m1.800s
sys    0m0.680s
```

上述结果运行于Docker容器中。

## 使用原型方法定义类

```
function Venue(venue_id,venue_name,
    venue_cityid, venue_city,
    venue_area,
    venue_fullhref,
    venue_type,
    venue_address,
    venue_matches,
    venue_offer) {
　　this.venue_id = venue_id;
　　this.venue_name = venue_name;
　　this.venue_cityid = venue_cityid;
　　this.venue_city = venue_city;
　　this.venue_area = venue_area;
　　this.venue_fullhref = venue_fullhref;
　　this.venue_type = venue_type;
　　this.venue_address = venue_address;
　　this.venue_matches = venue_matches;
　　this.venue_offer = venue_offer;
}

//var objVeneue = new Venue("1", "The first Venue");
//console.log(objVeneue.venue_name);
```

## 定制场馆排序

```
venueList.sort(sortVenue);
function sortVenue(a,b)
{
    let acityorder = cityMap[a.venue_cityid];
    let bcityorder = cityMap[b.venue_cityid];
    // console.log(a.venue_cityid, b.venue_cityid);
    // console.log(acityorder, bcityorder);
    if ((acityorder - bcityorder)==0) {
        return parseInt(a.venue_id) > parseInt(b.venue_id);
    }
    return  (acityorder > bcityorder);
}
```

希望按照城市ID和场馆ID排序。

# 抓取大麦网演出赛事
查询全部项目的网址: `http://www.damai.cn/projectlist.do`

演出赛事系列分类清单
1. 演唱会 网址: `http://s.damai.cn/ticket/concert.html`
2. 音乐会
3. 话剧歌剧
4. 舞蹈芭蕾
5. 曲苑杂坛
6. 体育比赛 网址: `http://s.damai.cn/ticket/sports.html`
7. 度假休闲
8. 周边商品
9. 活动
10. 超级票
11. 儿童亲子
12. 旅游演艺|韩流地带

稍后继续写.....
