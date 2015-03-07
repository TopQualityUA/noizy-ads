import brain from 'brain';
import log from '../log.js';

class HostValidation {
  constructor(hostsRegexp) {
    this._hostsRegexp = hostsRegexp;
  }

  test(value) {
    return this._hostsRegexp.test(value);
  }
}

export default HostValidation;
