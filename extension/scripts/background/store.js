'use strict';

//some abstraction over google chrome storage
//more info: https://developer.chrome.com/extensions/storage
//TODO: add event machine for store
import jquery from 'jquery';
import app from '../app_config.js';

var $ = jquery;

//Store class with public methods
class Store {
    constructor() {
        var _that = this;
        chrome.storage.local.get(
            ['hosts', 'classes', 'tldsRegexp', 'urlRegexp', 'hostsRegexp', 'classesRegexp'],
            function (items) {
                console.log(items)
                // Notify that we saved.
                if ($.isEmptyObject(items.hosts)) {
                    _that._fetchHosts();
                } else {
                    _that._hosts = items.hosts;
                    if ($.isEmptyObject(items.hostsRegexp)) {
                        _that._buildHostsRegexp();
                    }
                }
                //if (!items.classes) {
                //    _that._fetchClasses();
                //} else {
                //    _that._classes = items.classes;
                //    if (!items.classesRegexp) {
                //        _that._buildClassesRegexp();
                //    }
                //}
                if ($.isEmptyObject(items.tldsRegexp)) {
                    _that._fetchTldsRegexp();
                } else {
                    _that._tldsRegexp = items.tldsRegexp;
                    if ($.isEmptyObject(items.urlRegexp)) {
                        _that._buildUrlRegexp();
                    } else {
                        _that._urlRegexp = new RegExp(items.urlRegexp);
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

    //private methods
    _fetchHosts() {
        var _that = this;
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: 'GET',
                url: app.toAppUrl('hosts')
            })
                .done(function (res) {
                    console.log(res);
                    if (!$.isEmptyObject(res)) {
                        _that._hosts = {};

                        res.map(function (el) {
                            _that._hosts[el.name] = el;
                        });

                        chrome.storage.local.set({'hosts': _that._hosts}, function () {
                            // Notify that we saved.
                            console.log('Hosts saved');
                        });
                        resolve(_that._hosts);
                    } else {
                        console.log('Error: hosts are empty');
                    }
                })
                .fail(function (error) {
                    console.log('Hosts error:', error);
                });
        });
    }

    _fetchClasses() {
        var _that = this;
        $.ajax({
            type: 'GET',
            url: app.toAppUrl('classes')
        })
            .done(function (res) {
                if (!$.isEmptyObject(res)) {
                    _that._classes = {};

                    res.map(function (el) {
                        _that._classes[el.name] = el;
                    });
                    chrome.storage.local.set({'classes': _that._classes}, function () {
                        // Notify that we saved.
                        console.log('Classes saved');
                    });
                    //_that._buildClassesRegexp();
                } else {
                    console.log('Error: classes are empty');
                }
            })
            .fail(function (error) {
                console.log('Classes error:', error);
            });
    }

    _fetchTldsRegexp() {
        var _that = this;
        $.ajax({
            type: 'GET',
            url: app.toAppUrl('tlds/regexp')
        })
            .done(function (res) {
                _that._tldsRegexp = res.toString();
                if (_that._tldsRegexp) {
                    chrome.storage.local.set({'tldsRegexp': _that._tldsRegexp}, function () {
                        // Notify that we saved.
                        console.log('Tlds saved');
                    });
                    _that._buildUrlRegexp();
                } else {
                    console.log('Error: tlds are empty');
                }
            })
            .fail(function (error) {
                console.log('Tld error:', error);
            });
    }

    _buildHostsRegexp() {
        var _that = this;
        return new Promise(function (resolve, reject) {
            chrome.storage.local.get('hosts', function (item) {
                if ($.isEmptyObject(item.hosts)) {
                    resolve(_that._fetchHosts()
                    .then(function (hosts){
                            if (hosts) {
                                return _that._buildHostsRegexp();
                            }
                        }));
                } else {
                    var _hostsRegexpBody = Array.prototype.slice.call(item.hosts)
                        .map(function (el) {
                            return '.*' + el.name.replace('.', '\\.') + '.*';
                        })
                        .join('|');
                    _that._hostsRegexp = new RegExp(_hostsRegexpBody);
                    resolve(_that._hostsRegexp);
                    chrome.storage.local.set({'hostsRegexp': _hostsRegexpBody}, function () {
                        // Notify that we saved.
                        console.log('Hosts regexp saved');
                    });
                }
            });
        });

    }

    _buildClassesRegexp() {
        var _that = this;
        chrome.storage.local.get('classes', function (item) {
            if ($.isEmptyObject(item.classes)) {
                _that._fetchClasses();
            } else {
                var _classesRegexpBody = Array.prototype.slice.call(item.classes)
                    .map(function (el) {
                        return '.*' + el.name.replace('.', '\\.') + '.*';
                    })
                    .join('|');
                _that._classesRegexp = new RegExp(_classesRegexpBody);
                chrome.storage.local.set({'classesRegexp': _classesRegexpBody}, function () {
                    // Notify that we saved.
                    console.log('Classes regexp saved');
                });
            }
        });

    }

    _buildUrlRegexp() {
        var _that = this;
        chrome.storage.local.get('tldsRegexp', function (item) {
            var _urlRegexpPreffix = '((https?:\\/\\/www\\.)|(https?:\\/\\/)|(www\\.))' +
                    '([0-9a-z\\._-]+)((\\.(',
                _urlRegexpSuffix = '))(\\/([0-9a-z_\\-]+))*' +
                '(\\/([\\/\\w\\.\\-\\#\\?\\!\\(\\)\\=\\*\\%\\&]*))?)';
            if ($.isEmptyObject(item.tldsRegexp)) {
                _that._fetchRegexpTlds();
            } else {
                var _urlRegexpBody = _urlRegexpPreffix + item.tldsRegexp.toString() + _urlRegexpSuffix;
                _that._urlRegexp = new RegExp(_urlRegexpBody);
                chrome.storage.local.set({'urlRegexp': _urlRegexpBody}, function () {
                    // Notify that we saved.
                    console.log('Url regexp saved');
                });
            }
        });
    }

    //public methods
    get hosts() {
        //if ($.isEmptyObject(this._hosts)) {
        //    _fetchHosts();
        //}
        return $.isEmptyObject(this._hosts) ? this._fetchHosts() : this._hosts;
    }

    get classes() {
        if ($.isEmptyObject(this._hosts)) {
            _that._fetchClasses();
        }
        return this._classes;
    }

    getHost(hostKey) {
        var result = '',
            _that = this;
        chrome.storage.local.get('hosts.' + hostKey, function (item) {
            if ($.isEmptyObject(item)) {
                if ($.isEmptyObject(this._classes)) {
                    _that._fetchClasses();
                } else {
                    result = null;
                }
            } else {
                result = item.name;
            }
        });
    }

    getClass(classKey) {
        var result = '',
            _that = this;
        chrome.storage.local.get('classes.' + classKey, function (item) {
            if ($.isEmptyObject(item)) {
                if ($.isEmptyObject(_that._classes)) {
                    _that._fetchClasses();
                } else {
                    result = null;
                }
            } else {
                result = item.name;
            }
        });
    }

    get hostsRegexp() {
        if (!this._hostsRegexp) {
            this._buildHostsRegexp();
        }
        return this._hostsRegexp;
    }

    get classesRegexp() {
        if (!this._classesRegexp) {
            this._buildClassesRegexp();
        }
        return this._classesRegexp;
    }

    get urlRegexp() {
        if (!this._urlRegexp) {
            this._buildUrlRegexp();
        }
        return this._urlRegexp;
    }
}

export default Store;