var express = require('express');
var router = express.Router();
var redis = require("redis"),
  client = redis.createClient();

router.get('/', function (req, res, next) {
  client.smembers('hosts:blacklist', function (err, replies){
    var multi = client.multi();
    replies.forEach(function (hostname){
      multi.hgetall('hosts:blacklist:' + hostname);
    });
    multi.exec(function (error, replies){
      res.send(replies);
    })
  });
});

router.get('/regexp', function (req, res, next) {
  client.get('hosts:blacklist:regexp', function (err, replies){
    res.send(replies);
  });
});

module.exports = router;
