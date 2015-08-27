// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
var karmaConfig = require('./gulpfile.js/karma_config.js');

module.exports = function(config) {
  config.set(karmaConfig);
};
