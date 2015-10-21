//抓取大麦网27个关键城市的场馆清单
//启用strict模式
//@author: pythoner@icloud.com
//@since: 20151018
'use strict';
var express = require('express');
var url = require('url'); //解析操作url
var superagent = require('superagent'); //这三个外部依赖不要忘记npm install
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');
var csv = require('csv');

//
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


//大麦北京市场馆库
//定义Venue类
var venueList = [];
var venue_ids  = [];
var venue_names  = [];
var venue_cityids  = [];
var venue_citys  = [];
var venue_areas  = [];
var venue_fullhrefs  = [];
var venue_types = [];
var venue_addresss = [];
var venue_matchess  = [];
var venue_offers = [];

var epcity = new eventproxy();
var ep = new eventproxy();
var targetUrls = [
    "http://venue.damai.cn/search.aspx?cityID=852",
    "http://venue.damai.cn/search.aspx?cityID=872",
    "http://venue.damai.cn/search.aspx?cityID=893",
    "http://venue.damai.cn/search.aspx?cityID=906",
    "http://venue.damai.cn/search.aspx?cityID=1209",
    "http://venue.damai.cn/search.aspx?cityID=1377",
    "http://venue.damai.cn/search.aspx?cityID=1580",
    "http://venue.damai.cn/search.aspx?cityID=586",
    "http://venue.damai.cn/search.aspx?cityID=3250",
    "http://venue.damai.cn/search.aspx?cityID=1038",
    "http://venue.damai.cn/search.aspx?cityID=200",
    "http://venue.damai.cn/search.aspx?cityID=1087",
    "http://venue.damai.cn/search.aspx?cityID=923",
    "http://venue.damai.cn/search.aspx?cityID=372",
    "http://venue.damai.cn/search.aspx?cityID=848",
    "http://venue.damai.cn/search.aspx?cityID=1847",
    "http://venue.damai.cn/search.aspx?cityID=1597",
    "http://venue.damai.cn/search.aspx?cityID=917",
    "http://venue.damai.cn/search.aspx?cityID=356",
    "http://venue.damai.cn/search.aspx?cityID=1229",
    "http://venue.damai.cn/search.aspx?cityID=702",
    "http://venue.damai.cn/search.aspx?cityID=2024",
    "http://venue.damai.cn/search.aspx?cityID=2148",
    "http://venue.damai.cn/search.aspx?cityID=1835",
    "http://venue.damai.cn/search.aspx?cityID=2648",

    "http://venue.damai.cn/search.aspx?cityID=1077",
    "http://venue.damai.cn/search.aspx?cityID=2103",
];

let cityMap = {};
targetUrls.forEach(function( cityurl, index) {
    let cityID = parseInt(/cityID=(\d+)/.exec(cityurl)[1]);
    cityMap[cityID] = index+1;
})
// console.log(cityMap)
//@todo: 希望遍历上述27个城市后执行如下代码
epcity.after('city_by_city', targetUrls.length, function(cityurls){
    console.log("begin");
    // console.log(targetUrls);
    let realcount = 0;
    let venue_name ="";
    let venue_id = "";
    let venue_address = "";
    let venue_type = "";
    let venue_matches = "";
    let venue_city = "";
    let venue_cityid = "";
    let venue_area = "";
    let venue_fullhref = "";
    let venue_offer = "";
    for (let i=0;i<venue_names.length;i++){
            venue_name = venue_names[i];
            venue_id = venue_ids[i];
            venue_address = venue_addresss[i];
            venue_type = venue_types[i];
            venue_matches = venue_matchess[i];
            venue_city = venue_citys[i];
            venue_cityid = venue_cityids[i];
            venue_area = venue_areas[i];
            venue_fullhref = venue_fullhrefs[i];
            venue_offer = venue_offers[i];
            if (!venue_name.startsWith("测试部专用")) {
                realcount += 1;
                const objVeneue = new Venue(venue_id,venue_name,
                    venue_cityid, venue_city,
                    venue_area,
                    venue_fullhref,
                    venue_type,
                    venue_address,
                    venue_matches,
                    venue_offer);
                venueList.push(objVeneue);
                //console.log('"' + venue_id + '"' + ";" + '"'+venue_name+'"', ";", '"'+venue_cityid+'"',";", '"'+venue_city+'"',";", '"'+venue_area+'"',";", '"'+venue_address+'"',";", '"'+venue_type+'"',";", '"'+ venue_matches+'"',";", '"'+venue_offer+'"',";", '"'+venue_fullhref+'"');
            }
    }
    venueList.sort(sortVenue);
    venueList.forEach(function (v) {
        console.log('"' + v.venue_id + '"' + ";" + '"'+v.venue_name+'"', ";", '"'+v.venue_cityid+'"',";", '"'+v.venue_city+'"',";", '"'+v.venue_area+'"',";", '"'+v.venue_address+'"',";", '"'+v.venue_type+'"',";", '"'+ v.venue_matches+'"',";", '"'+v.venue_offer+'"',";", '"'+v.venue_fullhref+'"');
    })
    console.log("get all citys.count " + cityurls.length);
    console.log("venue_count: " + realcount);
    console.log("end");

});

//如下场馆排序算法需要重新思考
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

// targetUrls.sort(sortNumber);
targetUrls.forEach(function(targetUrl){

    superagent.get(targetUrl)
        .end(function (err, res) {
            // console.log(res);
            // console.log(targetUrl);
            const $ = cheerio.load(res.text);
            let pagecount = 1;
            let pageurlprefix = "";
            let pageurls = [];
            const cityID = parseInt(/cityID=(\d+)/.exec(targetUrl)[1]);
            //通过CSS selector来筛选数据
            $('.ml10').each(function (idx, element){
                pagecount = parseInt(/(\d+)/.exec($(element).text())[1]);
                // console.log(pagecount);
            });
            if (pagecount > 1) {
                $('.pagination a').each(function(index, el) {
                    const $element = $(el);
                    const href = $element.attr('href');
                    if (/pageIndex\=(\d+)/.test(href)) {
                            const fullhref = url.resolve(targetUrl, href);
                            pageurlprefix = fullhref.substr(0, fullhref.indexOf("pageIndex="))+"pageIndex=";
                            return;
                    }
                });
                for(let i=0;i<pagecount;i++){
                    pageurls.push(pageurlprefix + (i+1));
                }
                // console.log(pageurls);
                pageurls.sort();
            }else{
                pageurls.push(targetUrl);
            }

            ep.after('page_by_page' + targetUrl, pageurls.length, function(pageurls){
                // console.log(pageurl);
                // for (i=0;i<venue_names.length;i++){
                //     var venue_name = venue_names[i];
                //     var venue_address = venue_addresss[i];
                //     var venue_type = venue_types[i];
                //     var venue_matches = venue_matchess[i];
                //     var venue_city = venue_citys[i];
                //     var venue_area = venue_areas[i];
                //     var venue_offer = venue_offers[i];
                //     var venue_fullhref = venue_fullhrefs[i];
                //     console.log(venue_name,venue_city,venue_area,venue_address,venue_type,venue_matches,venue_offer,venue_fullhref);
                // }
                // console.log(venue_names.length);
                epcity.emit("city_by_city", targetUrl);
            });
            //循环遍历每个页面
            pageurls.forEach(function (pageurl){
                superagent.get(pageurl)
                    .end(function (err, res) {
                        // console.log(res);
                        const $ = cheerio.load(res.text);
                        /////////////////////////////////////////////////
                        $('.clear a').each(function (idx, element) {
                            var $element = $(element);
                            $element.each(function(eidx, txtelement){
                                const $txtelement = $(txtelement);
                                const title =  $txtelement.attr('title');
                                const href = $txtelement.attr('href');
                                const text = $txtelement.text();
                                const bMarkHref = /^(\/venue_\d+)/.test(href);
                                const bMarkText = /\[/.test(text);
                                if (bMarkHref  && bMarkText) {
                                    //
                                    const regresult = /^(.*)\[(.*)\-(.*)\]$/.exec(text);
                                    const venue_id = parseInt(/^\/venue_(\d+)/.exec(href)[1]);
                                    const venue_name = regresult[1];
                                    const venue_cityid = cityID;
                                    const venue_city = regresult[2];
                                    const venue_area = regresult[3];
                                    const venue_fullhref = url.resolve(targetUrl, href);
                                    // console.log(venue_name,venue_city,venue_area,venue_fullhref);
                                    venue_ids.push(venue_id);
                                    venue_names.push(venue_name);
                                    venue_cityids.push(venue_cityid);
                                    venue_citys.push(venue_city);
                                    venue_areas.push(venue_area);
                                    venue_fullhrefs.push(venue_fullhref);
                                }
                            });
                            //var title = url.resolve(pageurl, $element.attr('title'));
                            //console.log($element);
                            //console.log(element);
                        });
                        $('.clear .txt').each(function (idx, element) {
                            const $element = $(element);
                            $element.each(function(eidx, txtelement){
                                const $txtelement = $(txtelement);
                                const text = $txtelement.text();
                                // console.log(text);
                                const addr_prefix = "场馆地址：";
                                const type_prefix = "场馆类型：";
                                if (text.startsWith(addr_prefix)) {
                                    venue_addresss.push(text.substr(addr_prefix.length));
                                }
                                if (text.startsWith(type_prefix)) {
                                    venue_types.push(text.substr(type_prefix.length));
                                }
                            });
                            //var title = url.resolve(targetUrl, $element.attr('title'));
                            //console.log($element);
                            //console.log(element);
                        });
                        $('.clear .seat_muns').each(function (idx, element) {
                            const $element = $(element);
                            $element.each(function(eidx, txtelement){
                                const $txtelement = $(txtelement);
                                const text = $txtelement.text();
                                if (text != "适演剧种"){
                                    venue_matchess.push(text);
                                }
                                // console.log(venue_matches);
                            });
                            //var title = url.resolve(targetUrl, $element.attr('title'));
                            //console.log($element);
                            //console.log(element);
                        });
                        $('.offer a').each(function (idx, element) {
                            const $element = $(element);
                            $element.each(function(eidx, txtelement){
                                const $txtelement = $(txtelement);
                                if( /(\d+)/.test($txtelement.text())){
                                    venue_offers.push(/(\d+)/.exec($txtelement.text())[1]);
                                }else{
                                    venue_offers.push("");
                                }
                            });
                            //var title = url.resolve(targetUrl, $element.attr('title'));
                            //console.log($element);
                            //console.log(element);
                        });


                        // console.log(targetUrl);
                         ep.emit('page_by_page' + targetUrl, pageurl);
                    });
            });// end of page_by_page


    });//end of first page

});
