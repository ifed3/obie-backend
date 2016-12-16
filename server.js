#!/usr/bin/env node

'use strict';

// Monitor with newrelic
require('newrelic');

// Libraries to use in application
require('dotenv').config();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Get environment config variables
const config = require('./config'),
    app = require('./config/express'),
    port = process.env.PORT || 3000;

// Begin listening for requests once connected to database
connect()
    .on('error', console.log)
    .on('disconnected', connect)
    .once('open', listen);

function listen() {
    app.listen(port, function() {
        console.log("Express listening on port " + port);
    });
}

// Connect to database
function connect() {
    var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 }}};
    return mongoose.connect(config.db, options).connection;
}