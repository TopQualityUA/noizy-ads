'use strict';

//Regular expression for url matching and validating, for more info visit http://jex.im/regulex/#!embed=false&flags=&re=((https%3F%3A%5C%2F%5C%2Fwww%5C.)%7C(https%3F%3A%5C%2F%5C%2F)%7C(www%5C.))(%5B0-9a-z%5C._-%5D%2B)((%5C.(com%7Ccom%5C.ua))(%5C%2F(%5B0-9a-z%5C._%5C-%5D%2B))*(%5C%2F(%5B%5C%2F%5Cw%5C.%5C-%5C%23%5C%3F%5C!%5C(%5C)%5C%3D%5C*%5C%25%5C%26%5D*))%3F)

var UrlParser = function () {
    var _urlRegexp,
        store = new Store();

    var getHost = this.getHost = function (url) {
        var match = [];
        if (!_urlRegexp) {
            _urlRegexp = store.getUrlRegexp();
        }
        match = url.match(_urlRegexp);
        return match[5].concat(match[7]);
    };

    var getWithoutQueryParams = this.getLinkWithoutQueryParams = function (url) {
        var match = [];
        if (!_urlRegexp) {
            _urlRegexp = store.getUrlRegexp();
        }
        match = url.match(_urlRegexp);
        return match[5].concat(match[7].concat(match[9]));
    };

    var getQueryParams = this.getQueryParams = function (url) {
        var match = [];
        if (!_urlRegexp) {
            _urlRegexp = store.getUrlRegexp();
        }
        match = url.match(_urlRegexp);
        return match[12];
    };

    var _init = function () {
        _urlRegexp = store.getUrlRegexp();
    };

    _init();

    return this;
};