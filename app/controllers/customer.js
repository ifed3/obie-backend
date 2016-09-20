'use strict';

const Company = require('../../app/models/company'),
    config = require('../../config'),
    stripe = require('stripe')(config.stripeOptions.apiKey);

// Retrieve customer object for logged in company
exports.show = function(req, res, next) {
    const userId = req.user._id;
    Company.findById(userId, function(err, company) {
        if (err) return next(err);
        stripe.customers.retrieve(company.stripe.customerId, function(err, customer) {
            if (err) return res.status(402).send('Error retrieving customer');
            res.json(customer);
            next();
        });
    });
}

// List of payment methods for customer
exports.sources = function(req, res) {
    const userId = req.user._id;
    Company.findById(userId, function(err, company) {
        if (err) return next(err);
        stripe.customers.createSource(company.stripe.customerId, 
            {source: req.body.source}, function(err, source) {
                if (err) return res.status(402).send('Error attaching source.');
                res.status(200).end();
                next();
            });
    });
}

// Default payment method for customer
exports.source = function(req, res) {
    const userId = req.user._id;
    Company.findById(userId, function(err, company) {
        if (err) return next(err);
        stripe.customers.createSource(company.stripe.customerId, 
            {default_source: req.body.defaultSource}, function(err, customer) {
                if (err) return res.status(402).send('Error setting default source.');
                res.status(200).end();
                next();
            });
    });
}