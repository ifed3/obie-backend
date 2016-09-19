'use strict';

const express = require('express'),
    config = require('./'),
    bodyParser = require('body-parser');

const env = process.env.NODE_ENV || 'development';
    
var app = express();

// Use bodyParser for retrieving data from post requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.locals.stripePubKey = config.stripeOptions.stripePubKey;
    next(); 
});

const router = require('../config/routes');
app.use(router);

module.exports = app;