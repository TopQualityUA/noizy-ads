'use strict';
var gulp = require('gulp');
var io = require('socket.io')();


gulp.task('watch', function () {
  var extensionSocket = null;
  io.on('connection', function(socket){});//socket.io server for livereload
  io.listen(35729);
  io.on('connection', function (socket) {
    extensionSocket = socket;
    socket.on('disconnect', function () {
      extensionSocket = null;
    });
  });
  gulp.watch(['**/*.*'], function (){
    if (extensionSocket){
      console.log('Reloading sources');
      extensionSocket.emit('reload', {reload: true});
    }
  });
});

gulp.task('default', ['watch']);
