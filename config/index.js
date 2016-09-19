'use strict';

const extend = require('util')._extend;

const development = require('./env/development'),
    test = require('./env/test'),
    production = require('./env/production');

// Expose environment variables
module.exports = {
    development: extend(development, defaults),
    test: extend(test, defaults),
    production: extend(production, defaults)
}[process.env.NODE_ENV || 'development'];