'use strict';

// Reload client for Chrome Apps & Extensions.
// The reload client has a compatibility with livereload.
// Only for development environment
if (appENV.environment === 'development'){
  var socket = io('http://localhost:35729');//connecting to socket.io server for livereload
  socket.on('reload', function (data) {
    console.log('Need reloading:', data, data.reload === true);
    chrome.runtime.reload();
  });
}
