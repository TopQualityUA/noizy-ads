var express = require('express');
var router = express.Router();

//require other routes
var users = require('./users');
var match = require('./match');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Express'});
});

/*add others routes*/
router.use('/users', users);
router.use('/match', match);

module.exports = router;
