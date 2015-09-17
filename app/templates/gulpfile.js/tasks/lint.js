var eslint = require('gulp-eslint');
var gulp = require('gulp');
var readFile = require('fs').readFileSync;
var config = require('../config.js');

gulp.task('lint', function() {
  var lintConfig = JSON.parse(readFile('.eslintrc'));
  var stream = gulp.src(config.lint.src)
                    .pipe(eslint(lintConfig))
                    .pipe(eslint.format());

  if (config.tests.failTask) {
    // fail the task on eslint violations
    stream = stream.pipe(eslint.failOnError());
  }

  return stream;
});
