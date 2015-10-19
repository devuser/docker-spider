var csv = require('../lib/csv');

//createParser(delimiter, quote_char, quote_escape)
//defaults are ',', '"' and '"'

//Test the default parser
csv.createParser().parseFile('./test.csv', function(err, data) {
    if (err) throw err;
    console.log(data);
});

//Test tab separated values + converting each row to an object
//with properties based on the first row of column names
csv.createParser('\t').mapFile('./test.tsv', function(err, data) {
    if (err) throw err;
    console.log(data);
});
