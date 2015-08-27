'use strict';

var gulp = require('gulp');
var config = require('../config.js');
var karmaConfig = require('../karma_config.js');
var gulpSequence = require('gulp-sequence').use(gulp);
var argv = require('yargs').argv;

gulp.task('test-browser', function(cb) {
  var reporters = ['junit', 'nested', 'tap'];

  config.tests.failTask = true;
  karmaConfig.singleRun = true;
  karmaConfig.autoWatch = false;

  karmaConfig.browsers = ['Chrome', 'Firefox'];

  if (argv.coverage) {
    // the coverage reporter seems to break tests
    // lets put it behind a flag for now
    karmaConfig.browserify.transform.push('browserify-istanbul');
    reporters.push('coverage');
  }

  karmaConfig.reporters = reporters;
  karmaConfig.browsers = ['ChromeFakeDevices', 'FirefoxFakeDevices'];
  gulpSequence('karma', cb);
});
