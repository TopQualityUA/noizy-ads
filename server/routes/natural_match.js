var express = require('express');
var router = express.Router();
var urlParser = require('../lib/url_parser')();
var redis = require('redis'),
  client = redis.createClient();
var natural = require('natural'),
  classifier = new natural.BayesClassifier();

client.smembers('hosts:blacklist', function (err, blacklist) {
  client.smembers('hosts:whitelist', function (err, whitelist) {
    blacklist.forEach(function (e) {
      classifier.addDocument(e.split('.'), true);
    });
    whitelist.forEach(function (e) {
      classifier.addDocument(e.split('.'), false);
    });
    classifier.train();
  });
});

router.get('/', function (req, res, next) {
  res.send({
    classifier: classifier.classify(req.query.match.split('.') || 'bad-url.com'),
    classifications: classifier.getClassifications(req.query.match.split('.') || 'bad-url.com')
  });
});

router.get('/test', function (req, res, next) {
  var blackFalse = 0, blackTrue = 0, whiteFalse = 0, whiteTrue = 0;
  client.smembers('hosts:blacklist', function (err, blacklist) {
    client.smembers('hosts:whitelist', function (err, whitelist) {
      blacklist.forEach(function (e) {
        if (classifier.classify(e.split('.')) === 'true'){
          blackTrue++;
        } else {
          blackFalse++;
        }
      });
      whitelist.forEach(function (e) {
        if (classifier.classify(e.split('.')) === 'false'){
          whiteTrue++;
        } else {
          whiteFalse++;
        }
      });
      res.send({
        black: {
          blackTrue: blackTrue,
          blackFalse: blackFalse,
          perc: blackTrue/blacklist.length
        },
        white: {
          whiteTrue: whiteTrue,
          whiteFalse: whiteFalse,
          perc: whiteTrue/whitelist.length
        }
      });
    });
  });
});

module.exports = router;
