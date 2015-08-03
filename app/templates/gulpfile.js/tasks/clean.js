'use strict';
var gulp = require('gulp');
var del = require('del');
var config = require('../config.js');

gulp.task('clean', function(cb) {
  del([
    config.production.dest
  ], cb);
});
