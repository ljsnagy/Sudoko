var gulp = require('gulp');
var babel = require('gulp-babel');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');

var distDir = 'dist';

var handler = function handler(err) {
  gutil.log(err.stack);
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

gulp.task('client', function () {
  return gulp.src('src/client/**/*.html', { base: 'src' })
    .pipe(gulp.dest(distDir));
});

gulp.task('build', ['server', 'lib', 'client']);

gulp.task('watch', ['build'], function () {
  gulp.watch('src/**/*.js', ['build']).on('change', function (event) {
    gutil.log(gutil.colors.blue(event.path + ' ' + event.type));
  });
});