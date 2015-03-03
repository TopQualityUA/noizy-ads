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
                // Notify that we saved.
                if ($.isEmptyObject(items.hosts)) {
                    _that._fetchHosts();
                } else {
                    _that._hosts = items.hosts;
                }

                if ($.isEmptyObject(items.hostsRegexp)) {
                    _that._fetchHostsRegexp();
                }
                //if (!items.classes) {
                //    _that._fetchClasses();
                //} else {
                //    _that._classes = items.classes;
                //    if (!items.classesRegexp) {
                //        _that._buildClassesRegexp();
                //    }
                //}
                if ($.isEmptyObject(items.urlRegexp)) {
                    _that._fetchTldsRegexp();
                } else {
                    _that._urlRegexp = new RegExp(items.urlRegexp);
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

    _fetchHostsRegexp() {
        var _that = this;
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: 'GET',
                url: app.toAppUrl('hosts/regexp')
            })
                .done(function (res) {
                    if (!$.isEmptyObject(res)) {
                        _that._hostsRegexp = new RegExp(res);

                        chrome.storage.local.set({'hostsRegexp': _that._hostsRegexp}, function () {
                            // Notify that we saved.
                            console.log('Hosts Regexp saved');
                        });
                        resolve(_that._hostsRegexp);
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
                } else {
                    console.log('Error: classes are empty');
                }
            })
            .fail(function (error) {
                console.log('Classes error:', error);
            });
    }

    _fetchClassesRegexp() {
        var _that = this;
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: 'GET',
                url: app.toAppUrl('classes/regexp')
            })
                .done(function (res) {
                    console.log(res);
                    if (!$.isEmptyObject(res)) {
                        _that._classesRegexp = new RegExp(res);

                        chrome.storage.local.set({'classesRegexp': _that._classesRegexp}, function () {
                            // Notify that we saved.
                            console.log('Hosts Regexp saved');
                        });
                        resolve(_that._hostsRegexp);
                    } else {
                        console.log('Error: hosts are empty');
                    }
                })
                .fail(function (error) {
                    console.log('Hosts error:', error);
                });
        });
    }

    _fetchTldsRegexp() {
        var _that = this;
        return new Promise(function (resolve, reject) {
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
                        resolve(_that._buildUrlRegexp(_that._tldsRegexp));
                    } else {
                        let error = 'Error: tlds are empty';
                        console.log(error);
                        reject(error);
                    }
                })
                .fail(function (error) {
                    console.log('Tld error:', error);
                });
        });
    }

    _buildUrlRegexp(tldsRegexp) {
        if ($.isEmptyObject(tldsRegexp)) {
            return 'Bad tlds regexp';
        } else {
            let _urlRegexpPreffix = '((https?:\\/\\/www\\.)|(https?:\\/\\/)|(www\\.))' +
                    '([0-9a-z\\._-]+)((\\.(',
                _urlRegexpSuffix = '))(\\/([0-9a-z_\\-]+))*' +
                    '(\\/([\\/\\w\\.\\-\\#\\?\\!\\(\\)\\=\\*\\%\\&]*))?)',
                _urlRegexpBody = _urlRegexpPreffix + tldsRegexp.toString() + _urlRegexpSuffix;
            this._urlRegexp = new RegExp(_urlRegexpBody);
            chrome.storage.local.set({'urlRegexp': _urlRegexpBody}, function () {
                // Notify that we saved.
                console.log('Url regexp saved');
            });
            return this._urlRegexp;
        }
    }

    //public methods
    get hosts() {
        var _that = this;
        return new Promise(function (resolve, reject) {
            $.isEmptyObject(this._hosts) ?
                _that._fetchHosts()
                    .then(function (hosts) {
                        resolve(hosts);
                    })
                : resolve(this._hosts);
        })
    }

    get classes() {
        var _that = this;
        return new Promise(function (resolve, reject) {
            $.isEmptyObject(this._hosts) ?
                _that._fetchClasses()
                    .then(function (classes) {
                        resolve(classes);
                    })
                : resolve(this._classes);
        })
    }

    //getHost(hostKey) { TODO: fix this functional
    //    var result = '',
    //        _that = this;
    //    chrome.storage.local.get('hosts.' + hostKey, function (item) {
    //        if ($.isEmptyObject(item)) {
    //            if ($.isEmptyObject(this._classes)) {
    //                _that._fetchClasses();
    //            } else {
    //                result = null;
    //            }
    //        } else {
    //            result = item.name;
    //        }
    //    });
    //}
    //
    //getClass(classKey) {
    //    var result = '',
    //        _that = this;
    //    chrome.storage.local.get('classes.' + classKey, function (item) {
    //        if ($.isEmptyObject(item)) {
    //            if ($.isEmptyObject(_that._classes)) {
    //                _that._fetchClasses();
    //            } else {
    //                result = null;
    //            }
    //        } else {
    //            result = item.name;
    //        }
    //    });
    //}

    get hostsRegexp() {
        var _that = this;
        return new Promise(function (resolve, reject) {
            $.isEmptyObject(_that._hostsRegexp) ?
                _that._fetchHostsRegexp()
                    .then(function (hostsRegexp) {
                        resolve(hostsRegexp);
                    })
                : resolve(_that._hostsRegexp);
        })
    }

    get classesRegexp() {
        var _that = this;
        return new Promise(function (resolve, reject) {
            $.isEmptyObject(_that._classesRegexp) ?
                _that._fetchClassesRegexp()
                    .then(function (classesRegexp) {
                        resolve(classesRegexp);
                    })
                : resolve(_that._classesRegexp);
        });
    }

    get urlRegexp() {
        var _that = this;
        return new Promise(function (resolve, reject) {
            $.isEmptyObject(_that._urlRegexp) ?
                _that._fetchTldsRegexp()
                    .then(function (urlRegexp) {
                        resolve(urlRegexp);
                    })
                : resolve(_that._urlRegexp);
        });
    }
}

export default Store;
