'use strict';

//some abstraction over google chrome storage
//more info: https://developer.chrome.com/extensions/storage
//TODO: add event machine for store
import jquery from 'jquery';
import EventMachine from '../helpers/event_machine.js';
import app from '../app_config.js';
import log from '../log.js';

var $ = jquery;

class Store extends EventMachine{
  constructor() {
    var _that = this;
    super();
    _that._fetchHosts();
    _that._fetchHostsRegexp();

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
          if (!$.isEmptyObject(res)) {

            // _hostsHashes are for faster way to access objects,
            // for example get('hosts:google.com', ...), it's like in redis db
            var _hostsSet = {},
              _hostsHashes = {};

            res.map(function (el) {
              _hostsSet[el.name] = el;
              _hostsHashes['hosts:' + el.name] = el;
            });

            chrome.storage.local.set({'hosts': _hostsSet}, function () {
              // Notify that we saved.
              _that.trigger('hostsChanged', [_hostsSet]);
              log('Hosts saved');
            });
            chrome.storage.local.set(_hostsHashes, function () {
              // Notify that we saved.
              _that.trigger('hostsHashesChanged', [_hostsHashes]);
              log('Hosts hashes saved');
            });
            resolve(_hostsSet);
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

  //_fetchClasses() {
  //  var _that = this;
  //  $.ajax({
  //    type: 'GET',
  //    url: app.toAppUrl('classes')
  //  })
  //    .done(function (res) {
  //      if (!$.isEmptyObject(res)) {
  //        var _classes = {};
  //
  //        res.map(function (el) {
  //          _classes[el.name] = el;
  //        });
  //        chrome.storage.local.set({'classes': _classes}, function () {
  //          // Notify that we saved.
  //          _that.trigger('classesChanged', [_classes]);
  //          log('Classes saved');
  //        });
  //      } else {
  //        log('Error: classes are empty');
  //      }
  //    })
  //    .fail(function (error) {
  //      log('Classes error:', error);
  //    });
  //}

  //_fetchClassesRegexp() {
  //  var _that = this;
  //  return new Promise(function (resolve, reject) {
  //    $.ajax({
  //      type: 'GET',
  //      url: app.toAppUrl('classes/regexp')
  //    })
  //      .done(function (res) {
  //        log(res);
  //        if (!$.isEmptyObject(res)) {
  //          var _classesRegexpBody = res,
  //            _classesRegexp = new RegExp(_classesRegexpBody);
  //
  //          chrome.storage.local.set({'classesRegexp': _classesRegexpBody}, function () {
  //            // Notify that we saved.
  //            _that.trigger('classesChanged', [_classesRegexp]);
  //            log('Hosts Regexp saved');
  //          });
  //          resolve(_classesRegexp);
  //        } else {
  //          log('Error: classes are empty');
  //        }
  //      })
  //      .fail(function (error) {
  //        log('Hosts error:', error);
  //      });
  //  });
  //}

  //public methods
  get hosts() {
    var _that = this;
    return new Promise(function (resolve, reject) {
      chrome.storage.local.get('hosts', function (items){
        if ($.isEmptyObject(items.hosts)){
          _that._fetchHosts()
            .then(function (hosts) {
              resolve(hosts);
            })
        } else {
          resolve(items.hosts);
        }
      })

    })
  }

  //get classes() {
  //  var _that = this;
  //  return new Promise(function (resolve, reject) {
  //    chrome.storage.local.get('classes', function (items){
  //      if ($.isEmptyObject(items.classes)){
  //        _that._fetchClasses()
  //          .then(function (classes) {
  //            resolve(classes);
  //          })
  //      } else {
  //        resolve(items.classes);
  //      }
  //    })
  //  })
  //}

  getHost(hostKey) {
      var _that = this;
    return new Promise(function (resolve, reject) {
      chrome.storage.local.get('hosts:' + hostKey, function (item) {
        resolve(item);
      });
    });
  }

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
        if ($.isEmptyObject(items.hostsRegexp)){
          _that._fetchHostsRegexp()
            .then(function (hostsRegexp) {
              resolve(new RegExp(hostsRegexp));
            })
        } else {
          resolve(new RegExp(items.hostsRegexp));
        }
      })
    })
  }

  //get classesRegexp() {
  //  var _that = this;
  //  return new Promise(function (resolve, reject) {
  //    chrome.storage.local.get('classesRegexp', function (items){
  //      if ($.isEmptyObject(items.classesRegexp)){
  //        _that._fetchClassesRegexp()
  //          .then(function (classesRegexp) {
  //            resolve(new RegExp(classesRegexp));
  //          })
  //      } else {
  //        resolve(new RegExp(items.classesRegexp));
  //      }
  //    })
  //  });
  //}
}

export default Store;
