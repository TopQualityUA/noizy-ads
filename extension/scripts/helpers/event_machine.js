class EventMachine {
  constructor() {
    this._funcArray = {};
  }
  /**
   * Set new event handler
   * @param events {String} - event names separated by space;
   * @param eventHandler {Function} - function that will be called when event triggers;
   * @returns {EventMachine}
   */
  on(events, eventHandler) {
    var _that = this;
    events.split(/\s+/)
      .forEach(function (event) {
        !_that._funcArray[event] ? _that._funcArray[event] = [] : 0;
        _that._funcArray[event].push(eventHandler);
      });
    return this;
  }

  /**
   * Remove event handler
   * @param events {String} - event names separated by space;
   * @param eventHandler {Function} - function that will be called when event triggers;
   * @returns {EventMachine}
   */
  off(events, eventHandler) {
    var _that = this;
    events.split(/\s+/)
      .forEach(function (event) {
        if (_that._funcArray[event])
          _that._funcArray[event] = _that._funcArray[event].filter(function (handler) {
            return !(handler === eventHandler);
          });
      });
    return this;
  }

  /**
   * Call listeners of event
   * @param events {String} - event names separated by space;
   * @param parameters {Array} - array of args
   * @returns {EventMachine}
   */
  trigger(events, parameters) {
    var _that = this;
    events.split(/\s+/)
      .forEach(function (event) {
        if (_that._funcArray[event]) {
          _that._funcArray[event].forEach(function (handler) {
            handler.apply(_that, parameters);
          });
        }
      });
    return this;
  }
}

export default EventMachine;