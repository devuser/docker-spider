var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/damai-venues.html', function(req, res, next) {
  res.render('damai-venues', { title: '大麦网场馆库' });
});

module.exports = router;
