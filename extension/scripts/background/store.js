'use strict';

//some abstraction over google chrome storage
//more info: https://developer.chrome.com/extensions/storage
//TODO: add event machine for store
import jquery from "jquery";
import app from "../app_config.js";
var $ = jquery;
var _urlRegexp, _hostsRegexp, _classesRegexp, _hosts, _tlds, _classes,
    _fetchHosts, _fetchClasses, _fetchTlds,
    _buildHostsRegexp, _buildClassesRegexp, _buildUrlRegexp;

//private methods
_fetchHosts = function () {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: 'GET',
            url: app.toAppUrl('hosts')
        })
            .done(function (res) {
                if (!$.isEmptyObject(res)) {
                    _hosts = res;
                    chrome.storage.local.set({'hosts': res}, function () {
                        // Notify that we saved.
                        console.log('Hosts saved');
                    });
                    resolve(_buildHostsRegexp());
                } else {
                    console.log('Error: hosts are empty');
                }
            })
            .fail(function (error) {
                console.log('Hosts error:', error);
            });
    })
};

_fetchClasses = function () {
    $.ajax({
        type: 'GET',
        url: app.toAppUrl('classes')
    })
        .done(function (res) {
            if (!$.isEmptyObject(res)) {
                _classes = res;
                chrome.storage.local.set({'classes': res}, function () {
                    // Notify that we saved.
                    console.log('Classes saved');
                });
                _buildHostsRegexp();
            } else {
                console.log('Error: classes are empty');
            }
        })
        .fail(function (error) {
            console.log('Classes error:', error);
        });
};

_fetchTlds = function () {
    $.ajax({
        type: 'GET',
        url: app.toAppUrl('tlds/regexp')
    })
        .done(function (res) {
            _tlds = res.toString();
            if (_tlds) {
                chrome.storage.local.set({'tlds': _tlds}, function () {
                    // Notify that we saved.
                    console.log('Tlds saved');
                });
                _buildUrlRegexp();
            } else {
                console.log('Error: tlds are empty');
            }
        })
        .fail(function (error) {
            console.log('Tld error:', error);
        });
};

_buildHostsRegexp = function () {
    return new Promise(function (resolve, reject) {
        chrome.storage.local.get('hosts', function (item) {
            if ($.isEmptyObject(item.hosts)) {
                _fetchHosts();
            } else {
                var _hostsRegexpBody = Array.prototype.slice.call(item.hosts)
                    .map(function (el) {
                        return '.*' + el.name.replace('.', '\\.') + '.*';
                    })
                    .join('|');
                _hostsRegexp = new RegExp(_hostsRegexpBody);
                resolve(_hostsRegexp);
                chrome.storage.local.set({'hostRegexp': _hostsRegexpBody}, function () {
                    // Notify that we saved.
                    console.log('Hosts regexp saved');
                });
            }
        });
    });

};

_buildClassesRegexp = function () {
    chrome.storage.local.get('classes', function (item) {
        if ($.isEmptyObject(item.classes)) {
            _fetchClasses();
        } else {
            var _classesRegexpBody = Array.prototype.slice.call(item.classes)
                .map(function (el) {
                    return '.*' + el.name.replace('.', '\\.') + '.*';
                })
                .join('|');
            _classesRegexp = new RegExp(_classesRegexpBody);
            chrome.storage.local.set({'classesRegexp': _classesRegexpBody}, function () {
                // Notify that we saved.
                console.log('Classes regexp saved');
            });
        }
    });

};

_buildUrlRegexp = function () {
    chrome.storage.local.get('tlds', function (item) {
        var _urlRegexpPreffix = '((https?:\\/\\/www\\.)|(https?:\\/\\/)|(www\\.))([0-9a-z\\._-]+)((\\.(',
            _urlRegexpSuffix = '))(\\/([0-9a-z_\\-]+))*' +
                '(\\/([\\/\\w\\.\\-\\#\\?\\!\\(\\)\\=\\*\\%\\&]*))?)';
        if ($.isEmptyObject(item.tlds)) {
            _fetchTlds();
        } else {
            var _urlRegexpBody = _urlRegexpPreffix + item.tlds.toString() + _urlRegexpSuffix;
            _urlRegexp = new RegExp(_urlRegexpBody);
            chrome.storage.local.set({'urlRegexp': _urlRegexpBody}, function () {
                // Notify that we saved.
                console.log('Url regexp saved');
            });
        }
    });
};

//Store class with public methods
class Store {
    constructor() {
        chrome.storage.local.get(
            ['hosts', 'classes', 'tlds', 'urlRegexp', 'hostsRegexp', 'classesRegexp'],
            function (items) {
                // Notify that we saved.
                if (!items.hosts) {
                    _fetchHosts();
                } else {
                    _hosts = items.hosts;
                    if (!items.hostsRegexp) {
                        _buildHostsRegexp();
                    }
                }
                if (!items.classes) {
                    _fetchClasses();
                } else {
                    _classes = items.classes;
                    if (!items.classesRegexp) {
                        _buildClassesRegexp();
                    }
                }
                if (!items.tlds) {
                    _fetchTlds();
                } else {
                    _tlds = items.tlds;
                    if ($.isEmptyObject(items.urlRegexp)) {
                        _buildUrlRegexp();
                    } else {
                        _urlRegexp = new RegExp(items.urlRegexp);
                    }
                }
            });
        chrome.storage.onChanged.addListener(function (changes, namespace) {
            for (var key in changes) {
                if (changes.hasOwnProperty(key)) {
                    var storageChange = changes[key];
                    console.log('Storage key "%s" in namespace "%s" changed. ' +
                        'Old value was "%s", new value is "%s".',
                        key,
                        namespace/*,
                         storageChange.oldValue,
                         storageChange.newValue*/);
                }
            }
        });
    }

    getHosts() {
        //if ($.isEmptyObject(_hosts)) {
        //    _fetchHosts();
        //}
        return $.isEmptyObject(_hosts) ? _fetchHosts() : _hosts;
    };

    getClasses() {
        if ($.isEmptyObject(_hosts)) {
            _fetchClasses();
        }
        return _classes;
    };

    getHost(hostKey) {
        var result = '';
        chrome.storage.local.get('hosts.' + hostKey, function (item) {
            if ($.isEmptyObject(item)) {
                if ($.isEmptyObject(_classes)) {
                    _fetchClasses();
                } else {
                    result = null;
                }
            } else {
                result = item.name;
            }
        });
    };

    getClass(classKey) {
        var result = '';
        chrome.storage.local.get('classes.' + classKey, function (item) {
            if ($.isEmptyObject(item)) {
                if ($.isEmptyObject(_classes)) {
                    _fetchClasses();
                } else {
                    result = null;
                }
            } else {
                result = item.name;
            }
        });
    };

    getHostsRegexp(classKey) {
        if (!_hostsRegexp) {
            _buildHostsRegexp();
        }
        return _hostsRegexp;
    };

    getClassesRegexp(classKey) {
        if (!_classesRegexp) {
            _buildClassesRegexp();
        }
        return _classesRegexp;
    };

    getUrlRegexp() {
        if (!_urlRegexp) {
            _buildUrlRegexp();
        }
        return _urlRegexp;
    };
}

export default Store;