'use strict';

import jquery from 'jquery';
import Store from './store';
import log from '../log.js';

var $ = jquery;

var ports = [],
  worker = new Worker(chrome.runtime.getURL('scripts/worker.js')),
  store = new Store();

// load regexps
store.urlRegexp
  .then(function (res) {
    worker.postMessage({
      cmd: 'urlRegexp',
      data: {
        urlRegexp: res
      }
    });
  });

store.hostsRegexp
  .then(function (res) {
    worker.postMessage({
      cmd: 'hostsRegexp',
      data: {
        hostsRegexp: res
      }
    });
  });

function checkURL(tabId, changeInfo, tab){
  if (tab.url.indexOf('www.opera.com')> -1){ // If it satisfies the criteria (the URL containing 'www.opera.com')
     // shows the page action
  }
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab){
  worker.postMessage({
    cmd: 'validateLocation',
    data: {
      location: tab.url
    },
    tabId: tabId
  });
});

//listen to messages from worker
worker.addEventListener('message', function (e) {
  try{
    var data = e.data.data,//TODO: maybe rename?
      cmd = e.data.cmd,
      sender = e.data.sender.sender,
      tabId = e.data.tabId;//TODO: find out why
    switch (cmd) {
      case 'removeNode':
        ports.forEach(function (port){
          if (port.sender.tab.id == sender.tab.id && port.name == 'after') {
           port.postMessage({
             cmd: 'removeNode',
             data: data
           });
          }
        });
        switch (data.type){
          case 'href':
            log('blocking ad: ' + data.href || '');
            break;
          case 'src':
            log('blocking ad: ' + data.src || '');
            break;
          case 'data':
            log('blocking ad: ' + data.data || '');
            break;
          case 'class': // TODO: add this functionality
            break;
          case 'default':
            log('blocking ad: unknown type ' + data.type);
            break;
        }
        chrome.browserAction.getBadgeText({ tabId: tabId || sender.tab.id }, function (count){
          count = count ? parseInt(count) + 1 : 1;
          chrome.browserAction.setBadgeText({ text: count.toString(), tabId: tabId || sender.tab.id });
        });
        break;
      case 'blockTab':
        log('blocking tab:' + data.location);
        localStorage.setItem('lastForbiddenPage', data.location);
        //redirect tab with bad resource to noizy-ads forbidden page
        chrome.tabs.update(tabId || sender.tab.id, {url: 'views/forbidden.html'});
        break;
      case 'default':
        log('Unknown command: ...');
    }
  }
  catch(e){
    log(e)
  }

}, false);

chrome.runtime.onInstalled.addListener(function (details) {
  log('previousVersion', details.previousVersion);
});

//listen to messages from content scripts
chrome.runtime.onConnect.addListener(function (port) {
  ports.push(port);
  port.onMessage.addListener(function (request, sender, sendResponse) {
    if (request) {
      var cmd = request.cmd,
        data = request.data;
      switch (cmd) {
        case 'validateLocation':
          if (data && data.location) {
            worker.postMessage({
              cmd: cmd,
              data: data,
              sender: sender
            });
          }
          break;
        case 'validateNode':
          if (data && (data.href || data.src || data.id || data.className || data.data)) {
            worker.postMessage({
              cmd: cmd,
              data: data,
              sender: sender
            });
          }
          break;
        default:
          log('Unknown command "' + cmd);
      }
    } else {
      log('Error: empty request');
    }
  });

  port.onDisconnect.addListener(function(){
    ports.splice( $.inArray(port, ports), 1 );
  })
});
