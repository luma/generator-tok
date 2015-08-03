'use strict';
var path = require('path');
var argv = require('yargs').argv;

var dest = './build';
var src = './src';

var ENVIRONMENT = argv.env || process.env.env || 'development';

module.exports = {
  environment: ENVIRONMENT,
  license: {
    src: path.join(src, '../LICENSE')
  },
  tests: {
    failTask: false
  },
  src: src,
  jsdoc: {
    src: path.join(src, 'js/**/*.js'),
    readme: path.join(src, '../README.md'),
    dest: './docs/documentation/',
    template: './node_modules/ink-docstrap/template',
    configFile: 'docs/config.json'
  },
  lint: {
    src: [
      path.join(src, 'js/**/*.js'),
      'app.js'
    ]
  },
  // @TODO what 'production' means in this context is not obvious. I.e. why are no other environments defined?
  production: {
    jsSrc: path.join(dest, '/**/*.js'),
    dest: dest
  }
};
