'use strict';
var eslint = require('gulp-eslint');
var gulp = require('gulp');
var config = require('../config.js');

gulp.task('lint', function() {
  var stream = gulp.src(config.lint.src)
    .pipe(eslint())
    .pipe(eslint.format());

  if (config.tests.failTask) {
    // fail the task on eslint violations
    stream = stream.pipe(eslint.failOnError());
  }

  return stream;
});
