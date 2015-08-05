'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var karma = require('karma');
var config = require('../config.js');

gulp.task('karma', function(done) {
  karma.server.start(
    config.karma,
    function(exitStatus) {
      var errorMsg = 'There are failing unit tests';
      // Karma's return status is not compatible with gulp's streams
      // See: http://stackoverflow.com/questions/26614738/issue-running-karma-task-from-gulp
      // or: https://github.com/gulpjs/gulp/issues/587 for more information
      if (config.tests.failTask) {
        if (exitStatus) {
          gutil.log(errorMsg);
        }
        if (
          (config.tests.forceKarmaExit.onFailure && exitStatus) ||
          (config.tests.forceKarmaExit.onSuccess && !exitStatus)
        ) {
          process.exit(exitStatus);
        }
      }
      done(exitStatus ? errorMsg : undefined);
    }
  );
});
