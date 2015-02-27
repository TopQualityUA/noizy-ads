'use strict';

//do all staff what needs to be done before loading page
var port = chrome.runtime.connect();
function validateLocation(){
    console.log('Noizy-Ads: [' + (new Date()).toDateString() + '] ' + 'sending message');
    port.postMessage({
        cmd: 'validateLocation',
        data: {
            location: window.location.href
        }
    });
}

validateLocation(); //validate hostname on load

//do other stuff
