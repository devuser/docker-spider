'use strict';
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
