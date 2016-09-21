'use strict';

const bodyParser = require('body-parser'),
    morgan = require('morgan'),
    express = require('express'),
    passport = require('passport'),
    jwt = require('jsonwebtoken'),
    config = require('./');

const env = process.env.NODE_ENV;
    
var app = express();

// Use bodyParser for retrieving data from post requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Log request to console
app.use(morgan('dev'));

app.use(function(req, res, next) {
    res.locals.stripePubKey = config.stripeOptions.stripePubKey;
    next(); 
});

const router = require('../config/routes');
app.use('/api', router);

module.exports = app;