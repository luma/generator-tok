'use strict';

var logger = require('bunyan').createLogger({
  name: '<%= appName %>'
});

logger.info('Hello World from <%= appName %>');
