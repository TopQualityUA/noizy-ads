var http = require('http');
var redis = require('redis'),
  client = redis.createClient();
var uuid = require('node-uuid');

module.exports = function(){
  http.get('http://pgl.yoyo.org/adservers/serverlist.php?hostformat=plain&showintro=1&mimetype=plaintext',
    function (res) {
    var body = '';
    res.on('data', function (chunk) {
      body += chunk;
    });
    res.on('end', function () {
      var hosts, hostsRegexp,
        multi = client.multi();
      hosts = body.split('\n')
        .filter(function (el){
          return el; //for filtering out empty strings
        });
      multi.sadd('hosts:blacklist', hosts, redis.print);
      hostsRegexp = hosts
        .map(function (el) {
          multi.hmset('hosts:blacklist:' + el, {
            id: uuid.v1(),
            name: el,
            uri: el,
            dateCreated: (new Date()).toUTCString()
          }, redis.print);
          return el.replace('.', '\\.');
        }).filter(function (e) {
          return e;
        })
        .join('|')
        .trim();
      multi.set('hosts:blacklist:regexp', hostsRegexp, redis.print);
      multi.exec();
    });
  });
};

