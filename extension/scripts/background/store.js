'use strict';

//some abstraction over google chrome storage
//more info: https://developer.chrome.com/extensions/storage
//TODO: add event machine for store
import jquery from 'jquery';
import EventMachine from '../helpers/event_machine.js';
import app from '../app_config.js';
import log from '../log.js';

var $ = jquery;

//Store class with public methods
class Store extends EventMachine{
  constructor() {
    var _that = this;
    chrome.storage.local.get(
      ['hosts', 'classes', 'tldsRegexp', 'urlRegexp', 'hostsRegexp', 'classesRegexp'],
      function (items) {
        // Notify that we saved.
        //log(items);
        if ($.isEmptyObject(items.hosts)) {
          _that._fetchHosts();
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
        if (!items.urlRegexp) {
          _that._fetchTldsRegexp();
        }

      });
    // TODO: Event Machine also can be triggered from here
    chrome.storage.onChanged.addListener(function (changes, namespace) {
      for (var key in changes) {
        if (changes.hasOwnProperty(key)) {
          var storageChange = changes[key];
          log('Storage key "%s" in namespace "%s" changed. ' +
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
          log(res);
          if (!$.isEmptyObject(res)) {
            var _hosts = {};

            res.map(function (el) {
              _hosts[el.name] = el;
            });

            chrome.storage.local.set({'hosts': _hosts}, function () {
              // Notify that we saved.
              _that.trigger('hostsChanged', [_hosts]);
              log('Hosts saved');
            });
            resolve(_hosts);
          } else {
            log('Error: hosts are empty');
          }
        })
        .fail(function (error) {
          log('Hosts error:', error);
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
            var _hostsRegexpBody = res,
              _hostsRegexp = new RegExp(_hostsRegexpBody);
            chrome.storage.local.set({'hostsRegexp': _hostsRegexpBody}, function () {
              // Notify that we saved.
              _that.trigger('hostsRegexpChanged', [_hostsRegexp]);
              log('Hosts Regexp saved');
            });
            resolve(_hostsRegexp);
          } else {
            log('Error: hosts are empty');
          }
        })
        .fail(function (error) {
          log('Hosts error:', error);
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
          var _classes = {};

          res.map(function (el) {
            _classes[el.name] = el;
          });
          chrome.storage.local.set({'classes': _classes}, function () {
            // Notify that we saved.
            _that.trigger('classesChanged', [_classes]);
            log('Classes saved');
          });
        } else {
          log('Error: classes are empty');
        }
      })
      .fail(function (error) {
        log('Classes error:', error);
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
          log(res);
          if (!$.isEmptyObject(res)) {
            var _classesRegexpBody = res,
              _classesRegexp = new RegExp(_classesRegexpBody);

            chrome.storage.local.set({'classesRegexp': _classesRegexpBody}, function () {
              // Notify that we saved.
              _that.trigger('classesChanged', [_classesRegexp]);
              log('Hosts Regexp saved');
            });
            resolve(_classesRegexp);
          } else {
            log('Error: classes are empty');
          }
        })
        .fail(function (error) {
          log('Hosts error:', error);
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
          var _tldsRegexp = res.toString();
          if (_tldsRegexp) {
            chrome.storage.local.set({'tldsRegexp': _tldsRegexp}, function () {
              // Notify that we saved.
              log('Tlds saved');
            });
            resolve(_that._buildUrlRegexp(_tldsRegexp));
          } else {
            let error = 'Error: tlds are empty';
            log(error);
            reject(error);
          }
        })
        .fail(function (error) {
          log('Tld error:', error);
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
      let _urlRegexp = new RegExp(_urlRegexpBody);
      chrome.storage.local.set({'urlRegexp': _urlRegexpBody}, function () {
        // Notify that we saved.
        _that.trigger('urlRegexpChanged', [_urlRegexp]);
        log('Url regexp saved');
      });
      return _urlRegexp;
    }
  }

  //public methods
  get hosts() {
    var _that = this;
    return new Promise(function (resolve, reject) {
      chrome.storage.local.get('hosts', function (items){
        $.isEmptyObject(items.hosts) ?
          _that._fetchHosts()
            .then(function (hosts) {
              resolve(hosts);
            })
          : resolve(items.hosts);
      })

    })
  }

  get classes() {
    var _that = this;
    return new Promise(function (resolve, reject) {
      chrome.storage.local.get('classes', function (items){
        $.isEmptyObject(items.classes) ?
          _that._fetchClasses()
            .then(function (classes) {
              resolve(classes);
            })
          : resolve(items.classes);
      })
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
      chrome.storage.local.get('hostsRegexp', function (items){
        $.isEmptyObject(items.hostsRegexp) ?
          _that._fetchHostsRegexp()
            .then(function (hostsRegexp) {
              resolve(new RegExp(hostsRegexp));
            })
          : resolve(new RegExp(items.hostsRegexp));
      })
    })
  }

  get classesRegexp() {
    var _that = this;
    return new Promise(function (resolve, reject) {
      chrome.storage.local.get('classesRegexp', function (items){
        $.isEmptyObject(items.classesRegexp) ?
          _that._fetchClassesRegexp()
            .then(function (classesRegexp) {
              resolve(new RegExp(classesRegexp));
            })
          : resolve(new RegExp(items.classesRegexp));
      })
    });
  }

  get urlRegexp() {
    var _that = this;
    return new Promise(function (resolve, reject) {
      chrome.storage.local.get('urlRegexp', function (items){
        $.isEmptyObject(items.urlRegexp) ?
          _that._fetchTldsRegexp()
            .then(function (urlRegexp) {
              resolve(new RegExp(urlRegexp));
            })
          : resolve(new RegExp(items.urlRegexp));
      })
    });
  }
}

export default Store;
