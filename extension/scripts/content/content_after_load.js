'use strict';

var frequency = Math.floor(Math.random() * 300000) + 300000;//check nodes once per minute

function validateNodes(){
  //expand this to validate all doubtful blocks
  var $nodesToValidate = $('[href], [src]'),
    data = {
      hrefs: [],
      srcs: [],
      ids: [],
      classes: []
    };

  Array.prototype.slice.call($nodesToValidate)
    .forEach(function (node) {
      if (node.href) {
         data.hrefs.push(node.href);
      }
      if (node.src) {
        data.srcs.push(node.src);
      }
      if (node.id) {
        data.ids.push(node.id);
      }
      if (node.className) {
        data.classes.push(node.className);
      }
    });
  chrome.extension.sendRequest({
    cmd: 'validateNode',
    data: data
  });
}

validateNodes();

setInterval(validateNodes, frequency);//checking nodes for new errors
