import brain from 'brain'

var _classes;
class ClassValidation {
    constructor(classes){
        _classes = classes;
    }
    test(value) {
        return value === 'ad';
    }
}

export default ClassValidation;