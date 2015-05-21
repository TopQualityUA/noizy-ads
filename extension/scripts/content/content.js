'use strict';

import log from '../log.js';

var  port,
  frequency = Math.floor(Math.random() * 300000) + 300000,//check nodes once per 5-10 mins
  $nodesToValidate = [],
  windowName = (Math.random() + 1).toString(36).substr(2,10), //for finding difference between frames
  $ = function ( elem ) { //get shortened form of document.querySelectorAll, like jQuery does
    return document.querySelectorAll( elem );
  };

//connect to the background page
//it seems to be that for all frames there is one port connection
port = chrome.runtime.connect({name: windowName});

function validateNodes() {
  //expand this to validate all doubtful blocks
  $nodesToValidate = $('[href], [src], [data], [id], [class]');
  if ($nodesToValidate.length) {
    try {
      let data = [];
      Array.prototype.slice.call($nodesToValidate)
        .forEach(function (node, index) {
          data.push({
            href: node.href || '',
            src: node.src || '',
            id: node.id || '',
            data: node.data || '',
            className: node.className || '',
            nodeId: index
          });
        });
      port.postMessage({
        cmd: 'validateNode',
        data: data,
        windowName: windowName
      });
    }
    catch (e) {
      log(e);
    }
  }
}

validateNodes();

//setInterval(validateNodes, frequency);//checking nodes for new errors

port.onMessage.addListener(function (msg) {
  var data = msg.data,
    nodeId = msg.nodeId,
    msgWindowName = msg.windowName,
    cmd = msg.cmd;

  if (windowName !== msgWindowName){
    return false;
  }

  switch (cmd) {
    case 'removeNode':
      if ($nodesToValidate[nodeId]){
        $nodesToValidate[nodeId].outerHTML = '';
        delete $nodesToValidate[nodeId];
      }
      break;
    default://add another commands to content script
      break;
  }
});
