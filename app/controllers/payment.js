'use strict';

const Company = require('../../app/models/company'),
    config = require('../../config'),
    stripe = require('stripe')(config.stripeOptions.apiKey);


//Create new charge
exports.create = function(req, res) {
    const stripeToken = req.body.stripeToken;
    const userId = req.company._id;
}

// Get request for individual charge
exports.show = function(req, res) {
    const chargeId = req.params.charge_id;
    const companyId = req.params.company_id;
}

// Get request for all charges
exports.index = function(req, res) {

}