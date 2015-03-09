'use strict';

import jquery from 'jquery';
import Store from './store';
import UrlParser from './url_parser';
import HostValidation from './host_validation.js';
import log from '../log.js';

var $ = jquery;

var ports = [],
  counters = {},
  _hostValidation = {},
  _urlParser = new UrlParser(),
  worker = new Worker(chrome.runtime.getURL('scripts/worker.js')),
  store = new Store();

store.hostsRegexp
  .then(function (res) {
    _hostValidation = new HostValidation(res);
    worker.postMessage({
      cmd: 'hostsRegexp',
      data: {
        hostsRegexp: res
      }
    });
  });

chrome.runtime.onInstalled.addListener(function (details) {
  log('previousVersion', details.previousVersion);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab){
  //worker.postMessage({
  //  cmd: 'validateLocation',
  //  data: {
  //    location: tab.url
  //  },
  //  tabId: tabId
  //});

  //validate location synchronously TODO: fix duplicating
  var location = _urlParser.getHost(tab.url);
  if (_hostValidation.test(location)) {
    log('blocking tab:' + tab.url);
    localStorage.setItem('lastForbiddenPage', tab.url);
    //redirect tab with bad resource to noizy-ads forbidden page
    chrome.tabs.update(tabId, {url: 'views/forbidden.html'});
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  (details)=>{
    var tabId = details.tabId,
      reqType = details.type,
      blocked = false;

    //validate url synchronously TODO: fix duplicating
    var location = _urlParser.getHost(details.url);
    blocked = _hostValidation.test(location);
    return { cancel: blocked };
  },
  {urls: ['http://*/*', 'https://*/*']}, ['blocking']
);

//listen to messages from worker
worker.addEventListener('message', function (e) {
  try{
    var data = e.data.data,//TODO: maybe rename?
      cmd = e.data.cmd,
      nodeId = e.data.data.nodeId,
      windowName = e.data.windowName,
      sender = e.data.sender.sender,
      tabId = e.data.tabId;//TODO: find out why
    switch (cmd) {
      case 'removeNode':
        ports.forEach(function (port){
          if ((port.sender.tab.id === sender.tab.id) &&
            (port.name === windowName)){
           port.postMessage({
             cmd: 'removeNode',
             nodeId: nodeId,
             windowName: windowName
           });
          }
        });
        log('Blocking ad from page ' + sender.tab.url + ' : ' + JSON.stringify(data) || '');
        counters[tabId || sender.tab.id] = counters[tabId || sender.tab.id] + 1;
        chrome.browserAction.setBadgeText({
          text: counters[tabId || sender.tab.id].toString(),
          tabId: tabId || sender.tab.id
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
    log(e);
  }

}, false);

//listen to messages from content scripts
chrome.runtime.onConnect.addListener(function (port) {
  ports.push(port);
  // init counter for page if it doesn't exist
  counters[port.sender.tab.id] = counters[port.sender.tab.id] || 0;
  port.onMessage.addListener(function (request, sender, sendResponse) {
    if (request) {
      var cmd = request.cmd,
        windowName = request.windowName,
        data = request.data;
      worker.postMessage({
        cmd: cmd,
        data: data,
        windowName: windowName,
        sender: sender
      });
    } else {
      log('Error: empty request');
    }
  });

  port.onDisconnect.addListener(function(){
    ports.splice( $.inArray(port, ports), 1 );
    delete counters[port.sender.tab.id];
  });
});
