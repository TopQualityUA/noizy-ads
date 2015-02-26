var express = require('express');
var router = express.Router();

//require other routes
var users = require('./users');
var match = require('./match');
var tlds = require('./tlds');
var hosts = require('./hosts');
var classes = require('./classes');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Express'});
});

/*add others routes*/
router.use('/users', users);
router.use('/match', match);
router.use('/tlds', tlds);
router.use('/hosts', hosts);
router.use('/classes', classes);

module.exports = router;
