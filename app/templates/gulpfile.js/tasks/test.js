'use strict';

var gulp = require('gulp');
var gulpSequence = require('gulp-sequence').use(gulp);

gulp.task('test', gulpSequence('lint', ['test-node', 'test-browser']));
