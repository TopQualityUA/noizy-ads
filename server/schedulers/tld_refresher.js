var schedule = require('node-schedule');
var https = require('https');
var path = require('path');
var fs = require('fs');

//refresh tld regex source: https://publicsuffix.org/list/effective_tld_names.dat
var j = schedule.scheduleJob({hour: 13}, function () {
  var body = '';

  console.log('Regexp scheduler');

  https.get('https://publicsuffix.org/list/effective_tld_names.dat', function (res) {
    var regexFilepath = path.join(__dirname, '../public/tld_lists/regex_tld.txt'),
      originFilePath = path.join(__dirname, '../public/tld_lists/effective_tld_names.dat');
    res.on('data', function (chunk) {
      body += chunk;
    });
    res.on('end', function () {
      fs.writeFile(originFilePath, body);
      fs.writeFile(regexFilepath, body.toString().split('\n')
        .map(function (el) {
          return el && !(/^\/\//).test(el) ?
            el.replace('*', '').replace('!', '').replace('.', '\\.') : ''; //remove unnecessary '*'
        })
        .filter(function (e) {
          return e;
        })
        .sort()//TODO: do better sorting for faster regexp
        .reverse()
        .join('|')
        .trim());
    });
  });
});
