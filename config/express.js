'use strict';

const fs = require("fs"),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    express = require('express'),
    passport = require('passport'),
    passportService = require('./passport'),
    router = require('../config/routes'),
    config = require('./');

const env = process.env.NODE_ENV;

// const ssl_options = {
//   key: fs.readFileSync('privatekey.pem'),
//   cert: fs.readFileSync('certificate.pem')
// };
    
// var app = express.createServer(ssl_options);

var app = express();

// Use bodyParser for retrieving data from post requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize());
passportService(passport);

// Log request to console
if (env == "production") {
    app.use(logger('dev'));
}

app.use(function(req, res, next) {
    res.locals.stripePubKey = config.stripeOptions.stripePubKey;
    next(); 
});

router(app, passport);

module.exports = app;