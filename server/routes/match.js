var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  var query = req.query;
  res.write('true');
});

module.exports = router;
