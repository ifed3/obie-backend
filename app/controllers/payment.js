'use strict';

const Company = require('../../app/models/user'),
    config = require('../../config'),
    stripe = require('stripe')(config.stripeOptions.apiKey);


//Create new charge
exports.create = function(req, res) {
    const stripeToken = req.body.stripeToken;
    const userId = req.user._id;
}

// Get request for individual charge
exports.show = function(req, res) {
    const chargeId = req.params.charge_id;
    const userId = req.params.user_id;
}

// Get request for all charges
exports.index = function(req, res) {

}