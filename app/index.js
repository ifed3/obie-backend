'use strict';


// Get libraries
const express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('bodyParser'),
    path = require('path'),
    secrets = require('./config/secrets');

// Get environment variables
const development = require('./env/development'),
    test = require('./env/test'),
    production = require('./env/production');


const app = express();

module.exports = app;