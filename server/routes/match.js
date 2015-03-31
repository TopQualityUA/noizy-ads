var express = require('express');
var router = express.Router();
var urlParser = require('../lib/url_parser')();
var redis = require("redis"),
  client = redis.createClient();

router.get('/', function (req, res, next) {
  var query = req.query;

  client.get('hosts:blacklist:regexp', function (err, replies){
  	var hostsRegexp = new RegExp(replies);
  	console.log(urlParser.getHost(query.host || query.url || query.src || query.uri));
    res.send(hostsRegexp.test(
    	urlParser.getHost(query.host || query.url || query.src || query.uri))
    );
  });
});

module.exports = router;
