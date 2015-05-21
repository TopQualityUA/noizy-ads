var express = require('express');
var router = express.Router();
var urlParser = require('../lib/url_parser')();
var redis = require('redis'),
  client = redis.createClient();
var natural = require('natural'),
  classifier = new natural.LogisticRegressionClassifier()/*new natural.BayesClassifier()*/;

var regexp = '';
client.smembers('hosts:blacklist', function (err, blacklist) {
  client.smembers('hosts:whitelist', function (err, whitelist) {
    //blacklist.forEach(function (e) {
    //  classifier.addDocument(e.split('.'), true);
    //});
    //whitelist.forEach(function (e) {
    //  classifier.addDocument(e.split('.'), false);
    //});
    client.get('tlds:regexp', function (err, replies){
      regexp = new RegExp('([0-9a-z._-]+)((\\.(' + replies.toString() + '))(\\/([0-9a-z\\._\\-]+))*(\\/([\\/\\w\\.\\-\\#\\?\\!\\(\\)\\=\\*\\%\\&]*))?)');

      for(var i=0; i<whitelist.length; i++) {
        var regRes = whitelist[i].match(regexp);
        classifier.addDocument(regRes ? regRes[1] : '', false);
      }
      for(var i=0; i<blacklist.length; i++) {
        classifier.addDocument(blacklist[i].match(regexp)[1] || '', true);
      }
      classifier.train();
      console.log('asdasdaaazakh');
    });

  });
});

router.get('/', function (req, res, next) {
  res.send({
    classifier: classifier.classify(req.query.match || 'bad-url.com'),
    classifications: classifier.getClassifications(req.query.match || 'bad-url.com')
  });
});

router.get('/test', function (req, res, next) {
  var blackFalse = 0, blackTrue = 0, whiteFalse = 0, whiteTrue = 0;
  client.smembers('hosts:blacklist', function (err, blacklist) {
    client.smembers('hosts:whitelist', function (err, whitelist) {
      //for(var i=0; i<350; i++) {
      //  //classifier.addDocument(blacklist[i].split('.'), true);
      //  if (classifier.classify(blacklist[i].split('.')) === true){
      //    blackTrue++;
      //  } else {
      //    blackFalse++;
      //  }
      //}
      //for(var i=0; i<350; i++) {
      //  //classifier.addDocument(whitelist[i].split('.'), false);
      //  if (classifier.classify(whitelist[i].split('.')) === false){
      //    whiteTrue++;
      //  } else {
      //    whiteFalse++;
      //  }
      //}
      blacklist.forEach(function (e) {
        if (classifier.classify(e.match(regexp)[1] || '' ) === 'true'){
          blackTrue++;
        } else {
          blackFalse++;
        }
      });
      whitelist.forEach(function (e) {
        var regRes = e.match(regexp);
        if (classifier.classify(regRes ? regRes[1] : '') === 'false'){
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
