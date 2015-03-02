import brain from 'brain'

var _hosts;
class HostValidation {
    constructor(hosts){
        _hosts = hosts;
    }
    test(value) {
        return value === 'sports.ru';
    }
}

export default HostValidation;