'use strict';
var gulp = require('gulp');
var argv = require('yargs').argv;
var Jasmine = require('jasmine');
var reporters = require('jasmine-reporters');

gulp.task('test', function(cb) {
  var jasmine = new Jasmine();
  jasmine.loadConfigFile('tests/support/jasmine.json');

  jasmine.getEnv().addReporter(new reporters.JUnitXmlReporter({
      savePath: './reports',
      consolidateAll: false
  }));

  if (argv.coverage) {
    // @TODO
  }

  jasmine.onComplete(cb);
});
