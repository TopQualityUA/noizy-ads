'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
  console.log('previousVersion', details.previousVersion);
});

chrome.extension.onRequest.addListener(function(request, sender) {
  if (request){
    var cmd = request.cmd,
      data = request.data;
    console.log('New request: ' + cmd);
    switch (cmd) {
      case 'validateLocation':
        console.log('Validating Location');
        if (data && data.location){
          //chrome.tabs.update(sender.tab.id, {url: 'warning/warning.html'});
        }
        break;
      case 'validateNode':
        console.log('Validating Node');
        $.ajax({
          type: 'GET',
          url: 'http://localhost:9000/match',
          data: data
        })
        .done(function( msg ) {
          console.log( 'Data Send: ' + msg );
        });
        break;
      default:
        console.log('Unknown command "' + cmd);
    }
  } else {
    console.log('Error: empty request');
  }
});


