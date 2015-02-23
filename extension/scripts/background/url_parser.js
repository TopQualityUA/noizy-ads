'use strict';

//Regular expression for url matching and validating, for more info visit http://jex.im/regulex/#!embed=false&flags=&re=((https%3F%3A%5C%2F%5C%2Fwww%5C.)%7C(https%3F%3A%5C%2F%5C%2F)%7C(www%5C.))(%5B0-9a-z%5C._-%5D%2B)((%5C.(com%7Ccom%5C.ua))(%5C%2F(%5B0-9a-z%5C._%5C-%5D%2B))*(%5C%2F(%5B%5C%2F%5Cw%5C.%5C-%5C%23%5C%3F%5C!%5C(%5C)%5C%3D%5C*%5C%25%5C%26%5D*))%3F)
var urlRegexpPreffix = '((https?:\\/\\/www\\.)|(https?:\\/\\/)|(www\\.))([0-9a-z\\._-]+)((\\.(',
    urlRegexpSuffix = '))(\\/([0-9a-z\\._\\-]+))*' +
        '(\\/([\\/\\w\\.\\-\\#\\?\\!\\(\\)\\=\\*\\%\\&]*))?)',
    urlRegexp = '';
urlRegexp = new RegExp(urlRegexpPreffix + 'com|com\\.ua' + urlRegexpSuffix);
$.ajax({
    type: 'GET',
    url: app.toAppUrl('tld')
})
    .done(function (res) {
        if (res) {
            urlRegexp = new RegExp(urlRegexpPreffix + res.toString() + urlRegexpSuffix);
        }
    })
    .fail(function (error) {
        console.log('Url Regexp error:', error);
        console.log('Resetting regexp to defaults');
        urlRegexp = new RegExp(urlRegexpPreffix + '(\\.(com|com\\.ua)' + urlRegexpSuffix);
    });

var getDomain = function (url) {
    return url.replace(urlRegexp, '$5$7');
};

var getLinkWithoutQueryParams = function (url) {
    return url.replace(urlRegexp, '$5$7$9');
};

var getQueryParams = function (url) {
    return url.replace(urlRegexp, '$12');
};
