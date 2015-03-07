var schedule = require('node-schedule');
var load_hosts = require('../tasks/load_hosts');

// refresh hosts set and regex
var j = schedule.scheduleJob({hour: 13}, function () {
  load_hosts();
});
