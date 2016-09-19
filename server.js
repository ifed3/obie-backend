#!/usr/bin/env node

'use strict';

const mongoose = require('mongoose');

const config = require('./config'),
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

function connect() {
    var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 }}};
    return mongoose.connect(config.db, options).connection;
}