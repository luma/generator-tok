'use strict';
var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var jasmine = require('gulp-jasmine');
var argv = require('yargs').argv;
var reporters = require('jasmine-reporters');
var jasmineConf = require('../../tests/support/jasmine.json');

require('babel-core/register')({stage: 1});

var reportsDir = './reports';

gulp.task('test-node', function(cb) {
  var testOptions = {
    verbose: argv.verbose === true,
    includeStackTrace: argv.includeStackTrace !== false
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

  function runJasmine() {
    return gulp.src(jasmineConf.spec_files)
                .pipe(jasmine(testOptions));
  }

  if (argv.coverage === true) {
    gulp.src(['lib/**/*.js', 'index.js'])
      .pipe(istanbul()) // Covering files
      .pipe(istanbul.hookRequire()) // Force `require` to return covered files
      .on('finish', function() {
        // Creating the reports after tests run and
        // enforce a coverage of at least 90%
        runJasmine()
            .pipe(istanbul.writeReports({ dir: reportsDir }))
            .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }))
            .on('end', cb);
      });
  } else {
    runJasmine().on('end', cb);
  }
});
