'use strict';

var gulp = require('gulp');
var todo = require('gulp-todo');
var config = require('../config.js');

// output once in markdown and then output a json file as well
gulp.task('todo', function() {
  console.log(config.src + '/**/*.js');
  var s = gulp.src(config.src + '/**/*.js')
              .pipe(todo.reporter('json', { fileName: 'todo.json' }))
              .pipe(gulp.dest('./')) //output todo.json as json
              .pipe(todo())
              .pipe(gulp.dest('./')); //output todo.md as markdown

  s.on('data', function(chunk) {
    process.stdout.write(chunk.contents.toString());
  });

  s.on('end', function() {
    process.stdout.write('\n\n');
  });
});
