var express = require('express');
var router = express.Router();
var redis = require('redis'),
  client = redis.createClient();

router.get('/regexp', function (req, res, next) {
  client.get('tlds:regexp', function (err, replies){
    res.send(replies);
  });
});

module.exports = router;
