'use strict';
if( 'undefined' === typeof window){
    importScripts('url_parser.js');
    (function () {
        var urlParser;

        addEventListener('message', function (e) {
            var data = e.data.data,//TODO: maybe rename?
                cmd = e.data.cmd,
                sender = e.data.sender;
            switch (cmd) {
                case 'urlRegexp':
                    //console.log('5');
                    urlParser = new UrlParser(data.urlRegexp);
                    break;
                case 'validateLocation':
                    var location = urlParser.getHost(data.location);
                    if (location === 'sports.ru'){
                        postMessage({
                            cmd: 'block',
                            sender: sender,
                            location: location
                        });
                    }
                    break;
                case 'validateNode':
                    break;
                case 'close':
                    console.log('close');
                    close();
                    break;
                default:
                    postMessage('Unknown command: ' + data.msg);
            }
        }, false);
    })();
}
