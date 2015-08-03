'use strict';
var gulp = require('gulp');
var displayHelp = require('gulp-display-help');

var tasks = {
  'default': 'Lints the source and runs the tests',
  clean: 'removes all build artifacts',
  test: 'runs the tests and (optionally) generates coverage reports',
  lint: 'lints the source',
  help: 'displays this help text'
};

var flags = {
  '--verbose': 'Display lots of useful debug output',
  '--includeStackTrace': 'include stack traces when tests fail',
  '--timeout': 'Change the default timeout for each test',
  '--coverage': 'Generate a coverage report'
};

gulp.task('help', gulp.tasks, displayHelp(tasks, [/* omit these tasks */],  flags));
