A CSV parser for node.js

To install node-csv, use [npm](http://github.com/isaacs/npm):

    $ npm install node-csv

## Usage

    var csv = require('node-csv').createParser();
    
    var csv_str = "1,2,3\n4,5,6";
    
    csv.parse(csv_str, function(err, data) {
    
        console.log(data); //Outputs: [[1,2,3],[4,5,6]]
        
    });
    
    // or
    
    csv.parseFile('./test.csv', function(err, data) {
        console.log(data);
    });

createParser() takes 3 optional params - delimiter, quote_char, quote_escape

E.g. to parse tab separated values where fields are wrapped with quotes (") and quotes are escaped with \"

    var csv = require('node-csv').createParser('\t', '"', '\\');
    
node-csv can also convert each row to an object based on the column names in the first row, e.g.

test.csv

    id,user,pass
    1,foo,bar
    
parse.js

    var csv = require('node-csv').createParser();
    
    csv.mapFile('./test.csv', function(err, data) {
    
        console.log(data); //Outputs: [ { id: '1', user: 'foo', pass: 'bar' } ]
        
    });
