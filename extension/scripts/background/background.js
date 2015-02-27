'use strict';

(function (){
    var urlRegexp,
        worker = new Worker('scripts/background/worker.js'),
        store = new Store(),
        date;
    //
    //worker.postMessage({
    //    cmd: 'store',
    //    data: {
    //        store: store
    //    }
    //});

    //use promises
    urlRegexp = store.getUrlRegexp();
    worker.postMessage({
        cmd: 'urlRegexp',
        data: {
            urlRegexp: urlRegexp || /.+/
        }
    });

    worker.addEventListener('message', function(e) {
        var data = e.data.data,//TODO: maybe rename?
            cmd = e.data.cmd,
            sender = e.data.sender.sender;//TODO: find out why
        if (cmd === 'removeNode'){
            //TODO: do this part
        } else {
            console.log('blocking web site', e);
            //chrome.tabs.update(sender.tab.id, {url: 'views/block.html'});
        }
    }, false);

    chrome.runtime.onInstalled.addListener(function (details) {
        console.log('previousVersion', details.previousVersion);
    });

    chrome.runtime.onConnect.addListener(function(port) {
        if (!urlRegexp){
            //console.log('1');
            urlRegexp = store.getUrlRegexp();
            worker.postMessage({
                cmd: 'urlRegexp',
                data: {
                    urlRegexp: urlRegexp
                }
            });
        } else {
            //console.log('2');
            worker.postMessage({
                cmd: 'urlRegexp',
                data: {
                    urlRegexp: urlRegexp
                }
            });
        }
        port.onMessage.addListener(function(request, sender) {
            if (!urlRegexp){
                //console.log('3');
                urlRegexp = store.getUrlRegexp();
                worker.postMessage({
                    cmd: 'urlRegexp',
                    data: {
                        urlRegexp: urlRegexp
                    }
                });
            } else {
                //console.log('4');
                worker.postMessage({
                    cmd: 'urlRegexp',
                    data: {
                        urlRegexp: urlRegexp
                    }
                });
            }
            if (request){
                var cmd = request.cmd,
                    data = request.data;
                switch (cmd) {
                    case 'validateLocation':
                        if (data && data.location){
                            worker.postMessage({
                                cmd: cmd,
                                data: data,
                                sender: sender
                            });
                        }
                        break;
                    case 'validateNode':
                        if (data && (data.href || data.src || data.id || data.className)){
                            worker.postMessage({
                                cmd: cmd,
                                data: data,
                                sender: sender
                            });
                        }
                        break;
                    default:
                        console.log('Unknown command "' + cmd);
                }
            } else {
                console.log('Error: empty request');
            }
        });
    });
})();