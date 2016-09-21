'use strict';

const bodyParser = require('body-parser'),
    logger = require('morgan'),
    express = require('express'),
    passport = require('passport'),
    passportService = require('./passport'),
    jwt = require('jsonwebtoken'),
    config = require('./');

const env = process.env.NODE_ENV;
    
var app = express();

// Use bodyParser for retrieving data from post requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize());
passportService(passport);

// Log request to console
app.use(logger('dev'));

app.use(function(req, res, next) {
    res.locals.stripePubKey = config.stripeOptions.stripePubKey;
    next(); 
});

const router = require('../config/routes');
router(app, passport);

module.exports = app;