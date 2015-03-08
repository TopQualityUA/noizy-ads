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
      nodeId = e.data.nodeId,
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
        var _testResult = [];
        if (data.href) {
          _testResult.push({
            result:_hostValidation.test(data.href),
            data: {
              type: 'href',
              href: data.href
            }
          });
        } else if (data.src){
          _testResult.push({
            result:_hostValidation.test(data.src),
            data: {
              type: 'src',
              src: data.src
            }
          });
        } else if (data.data){

          _testResult.push({
            result:_hostValidation.test(data.data),
            data: {
              type: 'data',
              src: data.data
            }
          });
        }
        _testResult.forEach(function (testResult) {
          if (testResult.result){
            postMessage({
              cmd: 'removeNode',
              sender: sender || '',
              tabId: tabId || '',
              nodeId: nodeId || '',
              windowName: windowName || '',
              data: testResult.data || ''
            });
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
          nodeId: nodeId || '',
          windowName: windowName || '',
          data: data.msg || ''
        });
    }
  }, false);
})();
