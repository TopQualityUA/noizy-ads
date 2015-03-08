'use strict';

import jquery from 'jquery';
import log from '../log.js';

var $ = jquery;

var  port,
  frequency = Math.floor(Math.random() * 10000) + 10000,//check nodes once per 5-10 mins
  $nodesToValidate = [],
  windowName = (Math.random() + 1).toString(36).substr(2,10); //for finding difference between frames

//connect to the background page
//it seems to be that for all frames there is one port connection
port = chrome.runtime.connect({name: windowName});

function validateNodes() {
  //expand this to validate all doubtful blocks
  $nodesToValidate = document.querySelectorAll('[href], [src], [data]');
  if ($nodesToValidate.length) {
    try {
      Array.prototype.slice.call($nodesToValidate)
        .forEach(function (node, index) {
          port.postMessage({
            cmd: 'validateNode',
            data: {
              href: node.href || '',
              src: node.src || '',
              id: node.id || '',
              data: node.data || '',
              className: node.className || ''
            },
            nodeId: index,
            windowName: windowName
          });
        });
    }
    catch (e) {
      log(e)
    }
  }
}

validateNodes();

//setInterval(validateNodes, frequency);//checking nodes for new errors

port.onMessage.addListener(function (msg) {
  var data = msg.data,
    nodeId = msg.nodeId,
    responseWindowName = msg.windowName,
    cmd = msg.cmd;

  if (windowName !== responseWindowName){
    return false;
  }

  switch (cmd) {
    case 'removeNode':
      log(port.name, windowName, data, msg, $nodesToValidate[nodeId]);
      //$nodesToValidate[nodeId].remove();
      if ($nodesToValidate[nodeId]){
        $nodesToValidate[nodeId].outerHTML = "";
        delete $nodesToValidate[nodeId];
      }
      //switch (data.type) {
      //  case 'href':
      //    $('[href="' + data.href + '"]').remove();
      //    $('[href="' + data.href.replace(/^http:/, '') + '"]').remove();
      //    $('[href="' + data.href.replace(/^https:/, '') + '"]').remove();
      //    break;
      //  case 'src':
      //    $('[src="' + data.src + '"]').remove();
      //    $('[src="' + data.src.replace(/^http:/, '') + '"]').remove();
      //    $('[src="' + data.src.replace(/^https:/, '') + '"]').remove();
      //    break;
      //  case 'data':
      //    $('[data="' + data.data + '"]').remove();
      //    $('[data="' + data.data.replace(/^http:/, '') + '"]').remove();
      //    $('[data="' + data.data.replace(/^https:/, '') + '"]').remove();
      //    break;
      //  case 'class': // TODO: add this functionality
      //    break;
      //  case 'default':
      //    break;
      //}
      break;
    default://add another commands to content script
      break;
  }
});
