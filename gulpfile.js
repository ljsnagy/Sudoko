var gulp = require('gulp');
var babel = require('gulp-babel');
var browserify = require('browserify');
var plumber = require('gulp-plumber');
var source = require('vinyl-source-stream');
var addsrc = require('gulp-add-src');
var concat = require('gulp-concat');
var gutil = require('gulp-util');

var distDir = 'dist';

var handler = function handler(err) {
  gutil.log(err.stack || err);
  this.emit('end');
};

gulp.task('server', function () {
  return gulp.src('src/server/**/*.js', { base: 'src' })
    .pipe(gulp.dest(distDir));
});

gulp.task('lib', function () {
  return gulp.src('src/lib/**/*.js', { base: 'src' })
    .pipe(plumber({errorHandler: handler}))
    .pipe(babel({
      plugins: ['transform-es2015-modules-commonjs']
    }))
    .pipe(gulp.dest(distDir));
});

gulp.task('client-js', function () {
  var b = browserify({ debug: true })
    .add('src/client/js/app.js')
    .transform(require('babelify'), {
      presets: ['es2015']
    })
    .transform(require('browserify-shim'));

  return b.bundle().on('error', handler)
    .pipe(source('client/js/app.js'))
    .pipe(addsrc('src/client/js/lib/*.js', { base: 'src' }))
    .pipe(gulp.dest(distDir));
});

gulp.task('client-css', function () {
  return gulp.src('src/client/css/**.css')
    .pipe(concat('client/css/app.css'))
    .pipe(gulp.dest(distDir))
});

gulp.task('client-static', function () {
  return gulp.src('src/client/**.!(css|js)', { base: 'src' })
    .pipe(gulp.dest(distDir))
});

gulp.task('client', ['client-js', 'client-css', 'client-static']);

gulp.task('build', ['server', 'lib', 'client']);

gulp.task('watch', ['build'], function () {
  gulp.watch('src/**', ['build']).on('change', function (event) {
    gutil.log(gutil.colors.blue(event.path + ' ' + event.type));
  });
});