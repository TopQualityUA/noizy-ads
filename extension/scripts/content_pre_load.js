'use strict';

//do all staff what needs to be done before loading page
function validateLocation(){
   chrome.extension.sendRequest({
      cmd: 'validateLocation',
      data: {
        location: window.location.hostname
      }
  });
}

validateLocation(); //validate hostname on load

//do other stuff
