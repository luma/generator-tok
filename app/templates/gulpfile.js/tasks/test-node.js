'use strict';
var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var jasmine = require('gulp-jasmine');
var argv = require('yargs').argv;
var reporters = require('jasmine-reporters');
var jasmineConf = require('../../tests/support/jasmine.json');

var reportsDir = './reports';

gulp.task('test-node', function(cb) {
  var testOptions = {
    verbose: argv.verbose === true,
    includeStackTrace: argv.includeStackTrace === true
  };

  if (argv.timeout !== void 0) {
    testOptions = argv.timeout;
  }

  testOptions.reporter = [
    // @TODO attempt to make the options identical to the ones
    // used in Karma.
    new reporters.JUnitXmlReporter({
        savePath: reportsDir,
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
          .pipe(istanbul.writeReports({ dir: reportsDir })) // Creating the reports after tests ran
          .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } })) // Enforce a coverage of at least 90%
          .on('end', cb);
      });
  } else {
    gulp.src(jasmineConf.spec_files)
      .pipe(jasmine(testOptions))
      .on('end', cb);
  }

  // @TODO should run the linter before
});
