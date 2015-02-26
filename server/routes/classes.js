var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');


router.get('/', function (req, res, next) {
  res.send({
    'sports.ru': {
      id: '1',
      name : 'sports.ru'
    }
  });
});

module.exports = router;
