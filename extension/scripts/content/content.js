'use strict';

import jquery from 'jquery';
import log from '../log.js';

var $ = jquery;

var frequency = Math.floor(Math.random() * 10000) + 3000,//check nodes once per 5-10 mins
  port = chrome.runtime.connect({name: "after"});

function validateNodes() {
  //expand this to validate all doubtful blocks
  var $nodesToValidate = document.querySelectorAll('[href], [src], [data]');

  if ($nodesToValidate.length) {
    try {
      Array.prototype.slice.call($nodesToValidate)
        .forEach(function (node) {
          port.postMessage({
            cmd: 'validateNode',
            data: {
              href: node.href || '',
              src: node.src || '',
              id: node.id || '',
              data: node.data || '',
              className: node.className || ''
            }
          });
        });
    }
    catch (e) {
      log(e)
    }
  }
}

validateNodes();

setInterval(validateNodes, frequency);//checking nodes for new errors

port.onMessage.addListener(function (msg) {
  var data = msg.data,
    cmd = msg.cmd;
  switch (cmd) {
    case 'removeNode':
      switch (data.type) {
        case 'href':
          $('[href="' + data.href + '"]').remove();
          $('[href="' + data.href.replace(/^http:/, '') + '"]').remove();
          $('[href="' + data.href.replace(/^https:/, '') + '"]').remove();
          break;
        case 'src':
          $('[src="' + data.src + '"]').remove();
          $('[src="' + data.src.replace(/^http:/, '') + '"]').remove();
          $('[src="' + data.src.replace(/^https:/, '') + '"]').remove();
          break;
        case 'data':
          $('[data="' + data.data + '"]').remove();
          $('[data="' + data.data.replace(/^http:/, '') + '"]').remove();
          $('[data="' + data.data.replace(/^https:/, '') + '"]').remove();
          break;
        case 'class': // TODO: add this functionality
          break;
        case 'default':
          break;
      }
      break;
    default://add another commands to content script
      break;
  }
});