'use strict';
var gulp = require('gulp'),
    io = require('socket.io')(),
    jshint = require('gulp-jshint'),
    cache = require('gulp-cached'),
    webpack = require('gulp-webpack'),
    path = require('path'),
    del = require('del'),
    runSequence = require('run-sequence'),
    paths = {
        scripts: ['./scripts/**/*.js', '!./node_modules/**/*', '!./bower_components/**/*'],
        html: ['./views/**/*.html'],
        css: ['./styles/**/*.css'],
        configs: ['./manifest.json'],
        img: ['./images/**/*.*']
    };

gulp.task('clean', function (cb) {
    del(['dist/**'], cb);
});
gulp.task('clean:scripts', function (cb) {
    del([path.join('dist', paths.scripts[0])], cb);
});
gulp.task('clean:html', function (cb) {
    del([path.join('dist', paths.html[0])], cb);
});
gulp.task('clean:styles', function (cb) {
    del([path.join('dist', paths.css[0])], cb);
});
gulp.task('clean:configs', function (cb) {
    del([path.join('dist', paths.configs[0])], cb);
});
gulp.task('clean:images', function (cb) {
    del([path.join('dist', paths.img[0])], cb);
});

gulp.task('lint', function () {
    return gulp.src(paths.scripts)
        .pipe(cache('linting'))
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('copyHtml', function () {
    return gulp.src(paths.html)
        .pipe(gulp.dest('./dist/views'));
});

gulp.task('copyStyles', function () {
    return gulp.src(paths.css)
        .pipe(gulp.dest('./dist/styles'));
});

gulp.task('copyConfigs', function () {
    return gulp.src(paths.configs)
        .pipe(gulp.dest('./dist'));
});

gulp.task('copyImages', function () {
    return gulp.src(paths.img)
        .pipe(gulp.dest('./dist/images'));
});

gulp.task('reloadSocketConnection', function () {
    io.emit('reload', {reload: true});
});

gulp.task('webpack', function() {
    return gulp.src('./')
        .pipe(webpack( require('./webpack.config.js') ))
        .pipe(gulp.dest(require('./webpack.config.js').output.path));
});

gulp.task('build', ['clean'], function (){
    runSequence('clean', ['webpack', 'copyHtml', 'copyStyles', 'copyConfigs', 'copyImages']);
});

gulp.task('watch', function () {
    io.on('connection', function (socket){});//socket.io server for livereload
    io.listen(35729);

    gulp.watch(paths.scripts, function(){
        runSequence(['lint', 'clean:scripts'], 'webpack',
            'reloadSocketConnection');
    });
    gulp.watch(paths.html, function(){
        runSequence('clean:html', 'copyHtml',
            'reloadSocketConnection');
    });
    gulp.watch(paths.css, function(){
        runSequence('clean:styles', 'copyStyles',
            'reloadSocketConnection');
    });
    gulp.watch(paths.configs, function(){
        runSequence('clean:configs', 'copyConfigs',
            'reloadSocketConnection');
    });
    gulp.watch(paths.img, function(){
        runSequence('clean:images', 'copyImages',
            'reloadSocketConnection');
    });
});

gulp.task('default', ['build', 'watch']);
