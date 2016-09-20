'use strict';

const Company = require('../../app/models/company'),
    config = require('../../config'),
    stripe = require('stripe')(config.stripeOptions.apiKey);


// Post request
exports.create = function(req, res) {

}

// Get request for individual charge
exports.show = function(req, res) {

}

// Get request for all charges
exports.index = function(req, res) {

}