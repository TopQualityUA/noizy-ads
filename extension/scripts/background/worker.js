'use strict';
import UrlParser from './url_parser'
import HostValidation from './host_validation.js'
import ClassValidation from './class_validation.js'

var _urlParser, _hostValidation = new HostValidation(), _classValidation = new ClassValidation();

addEventListener('message', function (e) {
    var data = e.data.data,//TODO: maybe rename?
        cmd = e.data.cmd,
        sender = e.data.sender;
    switch (cmd) {
        case 'urlRegexp':
            //console.log('5');
            _urlParser = new UrlParser(data.urlRegexp);
            break;
        case 'validateLocation':
            var location = _urlParser.getHost(data.location);
            if (_hostValidation.test(location)){
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
