'use strict';
var gutil = require('gulp-util');
var argv = require('yargs').argv;
var _ = require('lodash');

var karmaConfig = {
  singleRun: false,
  autoWatch: true,
  browsers: [],
  reporters: ['nested'],
  browserify: {
    transform: ['brfs'],
    debug: true
  },
  frameworks: ['browserify', 'jasmine'],
  client: {
    captureConsole: false
  },
  files: [],
  preprocessors: {},
  tapReporter: {
    outputFile: './results.tap'
  }
};

// @TODO document what the purpose of this is
Object.keys(karmaConfig).map(function(key) {
  var value = argv[key];
  if (key in argv) {
    if (karmaConfig[key] instanceof Array) {
      value = value.split(',');
    }
    var properties = {};
    properties[key] = {
      get: function() { return value; },
      set: function(ignored) {
        var quote = '\'';
        var color = gutil.colors;

        gutil.log([
          'Ignoring karma setting',
          quote + color.cyan(key) + quote,
          quote + color.magenta(ignored) + quote,
          'as the CLI flag overrides this to',
          quote + color.magenta(value) + quote
        ].join(' '));
      }
    };
    Object.defineProperties(
      karmaConfig,
      properties
    );
  }
});

module.exports = function(files, preprocessors) {
  // specialise the conf
  var conf = _.clone(karmaConfig);
  conf.files = files;
  conf.preprocessors = preprocessors;
  return conf;
};
