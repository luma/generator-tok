'use strict';

var gulp = require('gulp');
var todo = require('gulp-todo');
var config = require('../config.js');
var jasmineConf = require('../../tests/support/jasmine.json');
var srcPath = config.src + '**/*.js';
var testsPath = jasmineConf.spec_files.concat(jasmineConf.helpers).map(function(path) {
  return path.replace('tests/', './tests**/');
});
var todoSearchPaths = testsPath.concat(srcPath);
var through2 = require('through2');

// output once in markdown and then output a json file as well
gulp.task('todo', function() {
  gulp.src(todoSearchPaths)
            .pipe(todo())
            .pipe(gulp.dest('./')) //output todo.md as markdown
            .pipe(todo.reporter('json', { fileName: 'TODO.json' }))
            .pipe(gulp.dest('./')) //output todo.json as json
            .pipe(todo.reporter('table', { fileName: 'TODO.json' }))
            .pipe(through2.obj(function(obj, enc, next) {
              this.push(obj.contents);
              next();
            })).pipe(process.stdout);
});
