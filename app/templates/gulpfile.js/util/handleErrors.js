'use strict';

var gulp = require('gulp');
var notify = require('gulp-notify');

module.exports = function(errorObject) {
  notify.onError(errorObject.toString().split(': ').join(':\n')).apply(
    this,
    arguments
  );

  // Keep gulp from hanging on this task
  if (typeof gulp.emit === 'function') gulp.emit('end');
};
