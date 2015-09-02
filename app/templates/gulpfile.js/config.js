'use strict';
var path = require('path');
var argv = require('yargs').default('browser', true).argv;
var pkg = require('../package.json');

var dest = 'build/';
var src = 'src/';

var ENVIRONMENT = argv.env || process.env.env || 'development';
var APP_NAME = pkg.name;

module.exports = {
  environment: ENVIRONMENT,
  license: {
    src: '../LICENSE'
  },
  tests: {
    failTask: false,
    forceKarmaExit: {
      onSuccess: true,
      onFailure: true
    }
  },
  src: src,
  jsdoc: {
    src: src,
    readme: './README.md',
    dest: './docs',
    template: './node_modules/ink-docstrap/template',
    configFile: './gulpfile.js/doc_config.js'
  },
  lint: {
    src: [
      path.join('..', src, '/**/*.js'),
    ]
  },
  browserify: {
    // A separate bundle will be generated for each
    // bundle config in the list below
    debug: true, // debug mode for browserify (sourcemaps)
    watch: false, // should we use watchify
    bundleConfigs: [
      {
        entries: 'index.js',
        dest: dest,
        outputName: APP_NAME + '.js'
      }
    ]
  },
  // @TODO what 'production' means in this context is not obvious.
  // I.e. why are no other environments defined?
  production: {
    jsSrc: path.join(dest, '/**/*.js'),
    dest: dest
  }
};
