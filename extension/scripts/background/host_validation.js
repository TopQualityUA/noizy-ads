import brain from 'brain';

class HostValidation {
    constructor(hosts){
        this._hosts = hosts;
    }
    test(value) {
        return value === 'sports.ru'; // TODO: add logic
    }
}

export default HostValidation;