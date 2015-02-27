'use strict';

var frequency = Math.floor(Math.random() * 300000) + 300000;//check nodes once per 5-10 mins

var port = chrome.runtime.connect();

function validateNodes(){
  //expand this to validate all doubtful blocks
  var $nodesToValidate = $('[href], [src]');

  if ($nodesToValidate){
      Array.prototype.slice.call($nodesToValidate)
          .forEach(function (node) {
              port.postMessage({
                  cmd: 'validateNode',
                  data: {
                      href: node.href || '',
                      src: node.src || '',
                      id: node.id || '',
                      className: node.className || ''
                  }
              });
          });
  }
}

validateNodes();

setInterval(validateNodes, frequency);//checking nodes for new errors

port.onMessage.addListener(function(msg) {
    console.log(msg);
});