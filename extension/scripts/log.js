'use strict';

import app from './app_config.js'

function log() {
  if (app.config.ENV.environment === 'development') {
    let args = Array.prototype.slice.call(arguments)
      .map((el) => {
        return el;
      });
    let /*cmd = args.shift(),*/
      d = new Date();
    console.groupCollapsed('[' +
    ("00" + d.getHours()).slice(-2) + ":" +
    ("00" + d.getMinutes()).slice(-2) + ":" +
    ("00" + d.getSeconds()).slice(-2) + '] ' +
    'Noizy-Ads:');
    console.log.apply(console, args);
    console.groupEnd();
  }
}

if (('undefined' !== typeof window)
  && (app.config.ENV.environment === 'development')) {
  window.log = log;
}

export default log
