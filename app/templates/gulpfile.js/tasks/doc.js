'use strict';

var gulp = require('gulp');
var config = require('../config.js').jsdoc;
var exec = require('child_process').exec;
var argv = require('yargs').argv;
var opn = require('open');
var path = require('path');

gulp.task('doc', function(cb) {
  var command = './node_modules/.bin/jsdoc -c ' + config.configFile;
  exec(command, function(error) {
    if (error) {
      return cb(error);
    }
    cb();
  });
  if (argv.open) {
    opn(path.join(config.dest, 'index.html'));
  }
});
