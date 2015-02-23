'use strict';
var gulp = require('gulp');
var io = require('socket.io')();
var jshint = require('gulp-jshint');
var cache = require('gulp-cached');
var path = {
    scripts: ['./scripts/**/*.js', '!./node_modules/**/*', '!./bower_components/**/*'],
    html: ['./views/**/*.html'],
    css: ['./styles/**/*.css']
  };

gulp.task('lint', function(){
  return gulp.src(path.scripts)
    .pipe(cache('linting'))
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('reloadSocketConnection', function(){
  return gulp.src('./**/*.*')
    .pipe(cache('all'))
    .on('end', function() {
      io.emit('reload', {reload: true});
    });
});


gulp.task('watch', function () {
  io.on('connection', function(socket){});//socket.io server for livereload
  io.listen(35729);

  gulp.watch(path.scripts, ['lint']); //js files watcher for linting
  gulp.watch(path.scripts.concat(path.html.concat(path.css.concat(['./manifest.json', './bower.json', './package.json']))), ['reloadSocketConnection']);
});

gulp.task('default', ['watch']);
