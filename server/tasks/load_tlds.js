var https = require('https');
var redis = require('redis'),
  client = redis.createClient();

module.exports = function() {
  https.get('https://publicsuffix.org/list/effective_tld_names.dat', function (res) {
    var body = '';
    res.on('data', function (chunk) {
      body += chunk;
    });
    res.on('end', function () {
      var tlds, tldsRegexp,
        multi = client.multi();
      tlds = body.toString().split('\n')
        .filter(function (el) {
          return el && !(/^\/\//).test(el);
        });
      multi.sadd('tlds', tlds, redis.print);
      tldsRegexp = tlds.map(function (el) {
          return el && !(/^\/\//).test(el) ?
            el.replace('*', '').replace('!', '').replace('.', '\\.') : ''; //remove unnecessary '*'
        })
        .filter(function (e) {
          return e;
        })
        .sort()//TODO: do better sorting for faster regexp
        .reverse()
        .join('|')
        .trim();
      multi.set('tlds:regexp', tldsRegexp, redis.print);
      multi.exec();
    });
  })
};
