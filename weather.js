 var soap = require('soap');
  var url = 'http://www.webxml.com.cn/WebServices/WeatherWebService.asmx?wsdl';
  var args = { byProvinceName: '江苏'};
console.log(args)
  exports.soaptest = function(){soap.createClient(url, function(err, client) {
          client.setSOAPAction("http://www.webxml.com.cn/WebServices/WeatherWebService.asmx/getSupportCity");
          client.getSupportCity(args, function(err, result) {
              console.log(result);
          });
      });
  }
