var gulp = require('gulp');
var babel = require('gulp-babel');
var browserify = require('browserify');
var plumber = require('gulp-plumber');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var addsrc = require('gulp-add-src');
var postcss = require('gulp-postcss');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');

var distDir = 'dist';
var isProduction = process.env.NODE_ENV === 'production';

var inDev = function(plugin) {
  return isProduction ?  gutil.noop() : plugin;
};

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
    .pipe(babel())
    .pipe(gulp.dest(distDir));
});

gulp.task('client-js', function () {
  var b = browserify({ debug: !isProduction })
    .add('src/client/js/app.js')
    .transform(require('babelify'))
    .transform(require('browserify-shim'));

  return b.bundle().on('error', handler)
    .pipe(source('client/js/app.js'))
    .pipe(buffer())
    .pipe(plumber({errorHandler: handler}))
    .pipe(inDev(sourcemaps.init({ loadMaps: true })))
    .pipe(uglify())
    .pipe(inDev(sourcemaps.write()))
    .pipe(addsrc('src/client/js/lib/*.js', { base: 'src' }))
    .pipe(gulp.dest(distDir));
});

gulp.task('client-css', function () {
  return gulp.src('src/client/css/app.css', { base: 'src' })
    .pipe(plumber({errorHandler: handler}))
    .pipe(inDev(sourcemaps.init()))
    .pipe(postcss(
      [
        require('postcss-import'),
        require('cssnano'),
      ]
    ))
    .pipe(inDev(sourcemaps.write()))
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