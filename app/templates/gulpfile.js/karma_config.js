// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
'use strict';

var gutil = require('gulp-util');
var argv = require('yargs').default('browser', true).argv;
var jasmineConf = require('../tests/support/jasmine.json');
var REPORT_DIR = './reports/';

var testFiles = jasmineConf.spec_files.concat(jasmineConf.helpers);

//
// Transforms:
// ['app.js', 'foo.js']
//
// To:
// {
//   'app.js': ['browserify'],
//   'foo.js': ['browserify']
// }
//
function mapToPreprocessorOption(paths) {
  return paths.reduce(function(pre, path) {
    pre[path] = ['browserify'];
    return pre;
  }, {});
}

var karmaConfig = {
  // enable / disable watching file and executing tests whenever any file changes
  autoWatch: true,

  // base path, that will be used to resolve files and exclude
  // basePath: './',

  // testing framework to use (jasmine/mocha/qunit/...)
  // as well as any additional frameworks (requirejs/chai/sinon/...)
  frameworks: [
    'jasmine',
    'browserify',
  ],

  // list of files / patterns to load in the browser
  files: [
    'app.js',
    'src/js/**/*.js',
  ].concat(testFiles),

  // list of files / patterns to exclude
  exclude: [
  ],

  // @TODO
  preprocessors: mapToPreprocessorOption(['app.js'].concat(testFiles)),

  // web server port
  port: 8080,

  // Start these browsers, currently available:
  // - Chrome
  // - ChromeCanary
  // - Firefox
  // - Opera
  // - Safari (only Mac)
  // - PhantomJS
  // - IE (only Windows)
  browsers: [],

  customLaunchers: {
    ChromeFakeDevices: {
      base: 'Chrome',
      flags: [
        '--use-fake-ui-for-media-stream',
        '--use-fake-device-for-media-stream'
      ],
    },

    FirefoxFakeDevices: {
      base: 'Firefox',
      prefs: {
        'media.navigator.permission.disabled': true
      },
    },
  },

  // to avoid DISCONNECTED messages
  browserDisconnectTimeout: 10000, // default 2000
  browserDisconnectTolerance: 1, // default 0
  browserNoActivityTimeout: 60000, //default 10000

  // Which plugins to enable
  plugins: [
    'karma-browserify',
    'karma-chrome-launcher',
    'karma-coverage',
    'karma-firefox-launcher',
    'karma-ievms',
    'karma-jasmine-html-reporter',
    'karma-jasmine',
    'karma-junit-reporter',
    'karma-nested-reporter',
    'karma-nyan-reporter',
    'karma-jasmine-diff-reporter',
    'karma-source-map-support',
    'karma-tap-reporter',
  ],

  // Continuous Integration mode
  // if true, it capture browsers, run tests and exit
  singleRun: false,

  // Enable or disable colors in the output (reporters and logs).
  colors: true,

  // Report all the tests that are slower than given time limit (in ms)
  reportSlowerThan: 10000,

  reporters: [
    'jasmine-diff',     // github.com/JamieMason/karma-nested-reporter
    'nested',           // github.com/mradionov/karma-jasmine-diff-reporter
  ],

  // @TODO
  browserify: {
    transform: [
      'brfs'            // inline static assets: npmjs.com/package/brfs
    ],

    debug: true,        // use source maps
  },

  // github.com/fumiakiy/karma-tap-reporter
  tapReporter: {
    outputFile: REPORT_DIR + 'results.tap',
    stdout: false,
  },

  // github.com/karma-runner/karma-junit-reporter
  junitReporter: {
    outputDir: REPORT_DIR,      // where the results will be saved to
    suite: '',                  // suite will become the package name attribute in xml testsuite element
  },

  // github.com/mradionov/karma-jasmine-diff-reporter
  jasmineDiffReporter: {
    // Bg - background
    // Fg - foreground (text)
    // color: {
    //   expectedBg: 'bgYellow', // default 'bgRed'
    //   expectedFg: 'black',    // default 'white'
    //   actualBg: 'bgCyan',     // default 'bgGreen'
    //   actualFg: 'red'         // default 'white'
    // }
  },

  // github.com/dgarlitt/karma-nyan-reporter
  nyanReporter: {
    // increase the number of rainbow lines displayed
    // enforced min = 4, enforced max = terminal height - 1
    numberOfRainbowLines: 4,
  },

  client: {
    // Optionally capture all console output and pipe it to the terminal.
    captureConsole: false,
  },

  // level of logging
  // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
  // logLevel: LOG_ERROR,

  // URL root prevent conflicts with the site root
  // urlRoot: '_karma_'
};


// Allows properties from karmaConfig to be overwritten
// by CLI arguments.
var properties = Object.keys(karmaConfig).reduce(function(properties, key) {
  if (key in argv) {
    var value = !Array.isArray(karmaConfig[key])
                      ? argv[key]
                      : argv[key].split(',');

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
  }

  return properties;
}, {});

Object.defineProperties(karmaConfig, properties);
module.exports = karmaConfig;
