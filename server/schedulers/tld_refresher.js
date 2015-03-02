var schedule = require('node-schedule');
var load_tlds = require('../tasks/load_tlds');

// refresh tld set and regex
// source: https://publicsuffix.org/list/effective_tld_names.dat
var j = schedule.scheduleJob({hour: 13}, function () {
  load_tlds();
});
