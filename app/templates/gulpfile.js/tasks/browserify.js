'use strict';

/* browserify task
   ---------------
   Bundle javascripty things with browserify!
   This task is set up to generate multiple separate bundles, from
   different sources, and to use Watchify when run from the default task.
   See browserify.bundleConfigs in gulp/config.js
*/

var browserify   = require('browserify');
var watchify     = require('watchify');
var mergeStream  = require('merge-stream');
var bundleLogger = require('../util/bundleLogger');
var gulp         = require('gulp');
var handleErrors = require('../util/handleErrors');
var source       = require('vinyl-source-stream');
var config       = require('../config').browserify;
var assign       = require('lodash.assign');
var omit         = require('lodash.omit');
var map          = require('lodash.map');
var clone        = require('lodash.clone');
var resolutions  = require('browserify-resolutions');

var browserifyTask = function(shouldWatch, debugMode) {

  var browserifyThis = function(_bundleConfig) {
    var bundleConfig = clone(_bundleConfig);

    // Add debug (sourcemaps) option
    assign(bundleConfig, watchify.args, { debug: debugMode });

    if (shouldWatch) {
      // A watchify require/external bug that prevents proper recompiling,
      // so (for now) we'll ignore these options during development. Running
      // `gulp browserify` directly will properly require and externalize.
      bundleConfig = omit(bundleConfig, ['external', 'require']);
    }

    var b = browserify(bundleConfig)
      .plugin(resolutions, '*');

    var bundle = function() {
      // Log when bundling starts
      bundleLogger.start(bundleConfig.outputName);

      return b
        .bundle()
        // Report compile errors
        .on('error', handleErrors)
        // Use vinyl-source-stream to make the
        // stream gulp compatible. Specify the
        // desired output filename here.
        .pipe(source(bundleConfig.outputName))
        // Specify the output destination
        .pipe(gulp.dest(bundleConfig.dest));
    };

    if (shouldWatch) {
      // Wrap with watchify and rebundle on changes
      b = watchify(b);
      // Rebundle on update
      b.on('update', bundle);
      bundleLogger.watch(bundleConfig.outputName);
    } else {
      // Sort out shared dependencies.
      // b.require exposes modules externally
      if (bundleConfig.require) {
        b.require(bundleConfig.require);
      }

      // b.external excludes modules from the bundle, and expects
      // they'll be available externally
      if (bundleConfig.external) {
        b.external(bundleConfig.external);
      }
    }

    return bundle();
  };

  // Start bundling with Browserify for each bundleConfig specified
  return mergeStream.apply(gulp, map(config.bundleConfigs, browserifyThis));

};

gulp.task('browserify', function() {
  return browserifyTask(config.watch, config.debug);
});

// Exporting the task so we can call it directly in our watch task, with the 'devMode' option
module.exports = browserifyTask;
