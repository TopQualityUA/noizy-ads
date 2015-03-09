'use strict';
import UrlParser from './url_parser';
import HostValidation from './host_validation.js';
import ClassValidation from './class_validation.js';
import log from '../log.js';

(function () {
  var _hostValidation,
    _urlParser = new UrlParser()/*,
    _classValidation = new ClassValidation()*/;

  addEventListener('message', function (e) {
    var data = e.data.data,//TODO: maybe rename?
      cmd = e.data.cmd,
      windowName = e.data.windowName,
      sender = e.data.sender,
      tabId = e.data.tabId;
    switch (cmd) {
      case 'hostsRegexp':
        _hostValidation = new HostValidation(data.hostsRegexp);
        break;
      case 'validateLocation':
        var location = _urlParser.getHost(data.location);
        if (_hostValidation.test(location)) {
          postMessage({
            cmd: 'blockTab',
            sender: sender || '',
            tabId: tabId,
            data: {
              location: location
            }
          });
        }
        break;
      case 'validateNode':
        let _testResult = false;
        data.forEach((data)=>{
          if (data.href) {
            _testResult = _hostValidation.test(data.href);
          }
          if (!_testResult && data.src){
            _testResult = _hostValidation.test(data.src);
          }
          if (!_testResult && data.data){
            _testResult = _hostValidation.test(data.data);
          }
          if (_testResult){
            postMessage({
              cmd: 'removeNode',
              sender: sender || '',
              tabId: tabId || '',
              windowName: windowName || '',
              data: data || ''
            });
            _testResult = false;
          }
        });

        break;
      case 'close':
        log('close');
        close();
        break;
      default:
        postMessage({
          cmd: 'Unknown command:',
          sender: sender || '',
          tabId: tabId || '',
          windowName: windowName || '',
          data: data.msg || ''
        });
    }
  }, false);
})();
