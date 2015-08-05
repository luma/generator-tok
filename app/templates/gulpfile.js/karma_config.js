'use strict';

var gutil = require('gulp-util');

var argv = require('yargs')
              .default('browser', true)
              .argv;


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
  files: [
    'app.js',
    'tests/unit/**/*_spec.js'
  ],
  preprocessors: {
    'app.js': ['browserify'],
    'tests/unit/**/*_spec.js': ['browserify']
  },
  tapReporter: {
    outputFile: './reports/results.tap',
    stdout: false
  },
  junitReporter: {
    outputDir: './reports',
    suite: ''
  },
  // to avoid DISCONNECTED messages
  browserDisconnectTimeout: 10000, // default 2000
  browserDisconnectTolerance: 1, // default 0
  browserNoActivityTimeout: 60000, //default 10000
  customLaunchers: {
    ChromeFakeDevices: {
      base: 'Chrome',
      flags: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream']
    },
    FirefoxFakeDevices: {
      base: 'Firefox',
      prefs: {
        'media.navigator.permission.disabled': true
      }
    }
  }
};

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

module.exports = karmaConfig;
