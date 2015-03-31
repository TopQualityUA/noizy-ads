module.exports = function () {
  this._urlParseRegexp = /^(([^:]+(?::|$))(?:(?:\w+:)?\/\/)?(?:[^:@\/]*(?::[^:@\/]*)?@)?(([^:\/?#]*)(?::(\d*))?))((?:[^?#\/]*\/)*[^?#]*)(\?[^#]*)?(\#.*)?/;
  
  this.parseUrl = function (url) {
    var uri = {},
      keys = ["href", "origin", "protocol", "host", "hostname", "port",
      "pathname", "queryParams", "hash"],
      matches = this._urlParseRegexp.exec(url);
    matches.forEach(function (el, i) {
      uri[keys[i]] = el || '';
    });
    return uri;
  }

  this.getHost = function (url) {
    console.log(url, this.parseUrl(url));
    return this.parseUrl(url).host;
  }

  this.getLinkWithoutQueryParams = function (url) {
    var parsedUrl = this.parseUrl(url);
    return parsedUrl.host + parsedUrl.pathname;
  }

  this.getQueryParams = function (url) {
    return this.parseUrl(url).queryParams;
  }
  return this;
};