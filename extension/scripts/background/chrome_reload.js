'use strict';

// Reload client for Chrome Apps & Extensions.
// The reload client has a compatibility with livereload.
// Only for development environment

import io from 'io';
import app from '../app_config.js';
import log from '../log.js';

if (app.config.ENV.environment === 'development') {
  var socket = io('http://localhost:35720');//connecting to socket.io server for livereload
  socket.on('reload', function (data) {
    log('Need reloading:', data, data.reload === true);
    chrome.runtime.reload();
  });
}
