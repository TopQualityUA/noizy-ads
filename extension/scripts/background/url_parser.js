'use strict';
import log from '../log.js';

//Regular expression for url matching and validating, for more info visit http://jex.im/regulex/#!embed=false&flags=&re=((https%3F%3A%5C%2F%5C%2Fwww%5C.)%7C(https%3F%3A%5C%2F%5C%2F)%7C(www%5C.))(%5B0-9a-z%5C._-%5D%2B)((%5C.(com%7Ccom%5C.ua))(%5C%2F(%5B0-9a-z%5C._%5C-%5D%2B))*(%5C%2F(%5B%5C%2F%5Cw%5C.%5C-%5C%23%5C%3F%5C!%5C(%5C)%5C%3D%5C*%5C%25%5C%26%5D*))%3F)
class UrlParser {
  constructor(urlRegexp) {
    this._urlRegexp = urlRegexp;
  }

  getHost(url) {
    var match = '',
      result = '';
    try{
      match = url.match(this._urlRegexp);
      result = match[5].concat(match[7]);
    }
    catch (e) {
      log(e);
    }
    return result;
  }

  getLinkWithoutQueryParams(url) {
    var match = '',
      result = '';
    try{
      match = url.match(this._urlRegexp);
      result = match[5].concat(match[7].concat(match[9]));
    }
    catch (e) {
      log(e);
    }
    return result;
  }

  getQueryParams(url) {
    var result = '';
    try{
      result = url.match(this._urlRegexp)[12];
    }
    catch (e) {
      log(e);
    }
    return result;
  }

  set regexp(urlRegexp) {
    this._urlRegexp = urlRegexp;
  }

  get regexp() {
    return this._urlRegexp;
  }
}

export default UrlParser;
