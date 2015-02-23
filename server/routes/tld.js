var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');


router.get('/', function (req, res, next) {
  var filepath = path.join(__dirname, '../public/tld_lists/regex_tld.txt');
  var readable = fs.createReadStream(filepath);

  readable.pipe(res);
});

module.exports = router;
