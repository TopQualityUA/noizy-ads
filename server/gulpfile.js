'use strict';
var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  jshint = require('gulp-jshint'),
  path = {
    scripts: ['./**/*.js', '!./node_modules/**/*', '!tests/**/*', '!udf_modules/**/*']
  },
  changedFiles = path.scripts; //default value

var loadHosts = require('./tasks/load_hosts');
var loadTlds = require('./tasks/load_tlds');
var loadWhiteList = require('./tasks/load_whitelist');

gulp.task('loadHosts', function (){
  loadHosts();
});

gulp.task('loadTlds', function (){
  loadTlds();
});

gulp.task('loadWhiteList', function (){
  loadWhiteList();
});

gulp.task('lint', function () {
  gulp.src(changedFiles)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('default', function () {
  nodemon()
    .on('start', ['lint'])
    //.on('change', ['lint']) //run tasks after any file changes such as build, etc.
    .on('restart', function (changes) {
      changedFiles = changes || [];
    },
      ['lint']); //run tasks after restarting server such as lint for changed files, etc.
});
