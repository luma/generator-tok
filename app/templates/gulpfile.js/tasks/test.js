'use strict';
var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var jasmine = require('gulp-jasmine');
var argv = require('yargs').argv;
var reporters = require('jasmine-reporters');
var jasmineConf = require('../../tests/support/jasmine.json');

gulp.task('test', function(cb) {
  var testOptions = {};

  if (argv.verbose) {
    testOptions.verbose = argv.verbose === true;
  }

  if (argv.includeStackTrace) {
    testOptions.includeStackTrace = argv.includeStackTrace === true;
  }

  if (argv.timeout) {
    testOptions = argv.timeout;
  }

  testOptions.reporter = [
    new reporters.JUnitXmlReporter({
        savePath: './reports',
        consolidateAll: false
    }),

    new reporters.TerminalReporter({
        showStack: !!testOptions.includeStackTrace,
        verbosity: 3,
        color: true
    })
  ];

  if (argv.coverage === true) {
    gulp.src(['src/**/*.js', 'app.js'])
      .pipe(istanbul()) // Covering files
      .pipe(istanbul.hookRequire()) // Force `require` to return covered files
      .on('finish', function() {
        gulp.src(jasmineConf.spec_files)
          .pipe(jasmine(testOptions))
          .pipe(istanbul.writeReports()) // Creating the reports after tests ran
          .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } })) // Enforce a coverage of at least 90%
          .on('end', cb);
      });
  } else {
    gulp.src(jasmineConf.spec_files)
      .pipe(jasmine(testOptions))
      .on('end', cb);
  }
});
