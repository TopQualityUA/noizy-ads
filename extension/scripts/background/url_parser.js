'use strict';
import log from '../log.js';

//Regular expression for url matching and validating, for more info visit http://jex.im/regulex/#!embed=false&flags=&re=((https%3F%3A%5C%2F%5C%2Fwww%5C.)%7C(https%3F%3A%5C%2F%5C%2F)%7C(www%5C.))(%5B0-9a-z%5C._-%5D%2B)((%5C.(com%7Ccom%5C.ua))(%5C%2F(%5B0-9a-z%5C._%5C-%5D%2B))*(%5C%2F(%5B%5C%2F%5Cw%5C.%5C-%5C%23%5C%3F%5C!%5C(%5C)%5C%3D%5C*%5C%25%5C%26%5D*))%3F)
class UrlParser {
  constructor() {
    this._urlParseRegexp = /^(([^:]+(?::|$))(?:(?:\w+:)?\/\/)?(?:[^:@\/]*(?::[^:@\/]*)?@)?(([^:\/?#]*)(?::(\d*))?))((?:[^?#\/]*\/)*[^?#]*)(\?[^#]*)?(\#.*)?/;
  }

  parseUrl(url){
    var uri = {},
      keys = ["href", "origin", "protocol", "host", "hostname", "port",
      "pathname", "queryParams", "hash"],
      matches = this._urlParseRegexp.exec(url);
    matches.forEach((el, i) => {
      uri[keys[i]] = el || '';
    });
    return uri;
  }

  getHost(url) {
    return this.parseUrl(url).host;
  }

  getLinkWithoutQueryParams(url) {
    var parsedUrl = this.parseUrl(url);
    return parsedUrl.host + parsedUrl.pathname;
  }

  getQueryParams(url) {
    return this.parseUrl(url).queryParams;
  }
}

export default UrlParser;
