var https = require('https');
var redis = require('redis'),
  client = redis.createClient();
var uuid = require('node-uuid');

function uniq (array) {
  var seen = {};
  var out = [];
  var j = 0;
  for(var i = 0; i < array.length; i++) {
    var item = array[i];
    if(seen[item] !== 1) {
      seen[item] = 1;
      out[j++] = item;
    }
  }
  return out;
}

module.exports = function(){
  https.get('https://hg.adblockplus.org/easylist/raw-file/538e79ce68d4/easylist/easylist_whitelist.txt',
    function (res) {
      var body = '';
      res.on('data', function (chunk) {
        body += chunk;
      });
      res.on('end', function () {
        var hosts, hostsRegexp,
          multi = client.multi();
        hosts = body.split('\n')
          .filter(function (el) {
            return el.indexOf('@@||') > -1; //for filtering out empty strings
          })
          .map(function (el) {
            return el.replace('@@||', '')
              .split('|')
              .map(function (el) {
                return el.match(/[^/]*/)[0];
              });
          })
          .reduce(function (a, b) {
            return a.concat(b);
          })
          .map(function (el) {
            return el.match(/[^\*\^\$\?]*/)[0];
          })
          .filter(function (el) {
            return el;
          });
        hosts = uniq(hosts);
        multi.sadd('hosts:whitelist', hosts, redis.print);
        hostsRegexp = hosts
          .map(function (el) {
            multi.hmset('hosts:whitelist:' + el, {
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
        multi.set('hosts:whitelist:regexp', hostsRegexp, redis.print);
        multi.exec();
      });
    });
};
