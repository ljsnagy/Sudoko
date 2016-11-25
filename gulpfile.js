var gulp = require('gulp');
var babel = require('gulp-babel');
var babelify = require('babelify');
var browserify = require('browserify');
var browserifyShim = require('browserify-shim');
var plumber = require('gulp-plumber');
var source = require('vinyl-source-stream');
var addsrc = require('gulp-add-src');
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

gulp.task('client', function () {
  var b = browserify({
    entries: 'src/client/js/app.js',
    transform: [
      babelify.configure({
        presets: ['es2015']
      }),
      browserifyShim
    ],
    debug: true
  });

  return b.bundle().on('error', handler)
    .pipe(source('client/js/app.js'))
    .pipe(addsrc(['src/client/**/*.html', 'src/client/js/lib/*.js'], { base: 'src' }))
    .pipe(gulp.dest(distDir));
});

gulp.task('build', ['server', 'lib', 'client']);

gulp.task('watch', ['build'], function () {
  gulp.watch('src/**', ['build']).on('change', function (event) {
    gutil.log(gutil.colors.blue(event.path + ' ' + event.type));
  });
});