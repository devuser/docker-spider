var myService = {
    MyService: {
        MyPort: {
            MyFunction: function(args) {
                return {
                    name: args.name
                };
            }
            MyAsyncFunction: function(args, callback) {
                // do some work
                callback({
                    name: args.name
                })
            }
        }
    }
}

var xml = require('fs').readFileSync('myservice.wsdl', 'utf8'),
    server = http.createServer(function(request,response) {
        response.end("404: Not Found: "+request.url)
    });

server.listen(8000);
soap.listen(server, '/wsdl', myService, xml);
