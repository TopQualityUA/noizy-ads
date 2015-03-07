'use strict';

var app = {};
app.config = {
  ENV: {
    environment: 'development',
    protocol: 'http://',
    host: 'localhost:9000'
  }
};

app.toAppUrl = function (method) {
  return method ? app.config.ENV.protocol + app.config.ENV.host + '/' + method : '';
};

export default app;