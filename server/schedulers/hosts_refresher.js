var schedule = require('node-schedule');
var load_hosts = require('../tasks/load_hosts');

// refresh hosts set and regex
// source: http://pgl.yoyo.org/adservers/serverlist.php?hostformat=plain&showintro=1&mimetype=plaintext
var j = schedule.scheduleJob({hour: 13}, function () {
  load_hosts();
});


