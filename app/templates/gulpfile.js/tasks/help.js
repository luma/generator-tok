'use strict';
var gulp = require('gulp');
var displayHelp = require('gulp-display-help');

var taskDescriptions = {
  'default': 'Lints the source and runs the tests',
  clean: 'removes all build artifacts',
  test: 'runs the tests and (optionally) generates coverage reports',
  lint: 'lints the source',
  todo: 'display all todos and fixmes in the project. It also writes them to TODO.md and todo.json',
  doc: 'generate docs for the project source',
  help: 'displays this help text'
};

var flags = {
  '--verbose': 'Display lots of useful debug output',
  '--includeStackTrace': 'include stack traces when tests fail',
  '--timeout': 'Change the default timeout for each test',
  '--coverage': 'Generate a coverage report'
};

gulp.task('help', displayHelp(gulp.tasks, taskDescriptions, [/* omit these tasks */],  flags));
