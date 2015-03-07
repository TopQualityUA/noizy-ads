import brain from 'brain'
import log from '../log.js';

var _classes;
class ClassValidation {
  constructor(classes) {
    _classes = classes;
  }

  test(value) {
    return value === 'ad';
  }
}

export default ClassValidation;
