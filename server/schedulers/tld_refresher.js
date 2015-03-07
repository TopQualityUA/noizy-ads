var schedule = require('node-schedule');
var load_tlds = require('../tasks/load_tlds');

// refresh tld set and regex
var j = schedule.scheduleJob({hour: 13}, function () {
  load_tlds();
});
