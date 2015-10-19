//2015CBA测试演出   时间:2015-11-30 10:58
//场次编号：00000D16场次编号：
var soap = require('soap');
  var url = 'http://210.5.151.171:8888/weipiao/MypiaoWS.dll/wsdl/IMypiaoWS_CNOH';
  var args = {UNITID: '00000D16'};
  //var args = '<PARAM><UNITID>00000D16</UNITID> </PARAM>'

  soap.createClient(url, function(err, client) {
    //   client.
        console.log(args)
      client.UTN_QueryUnitInfo_ByProduct(args, function(err, result) {
          console.log(result);
      });
  });
