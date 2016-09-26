'use strict';

const User = require('../../app/models/user'),
    config = require('../../config'),
    stripe = require('stripe')(config.stripeOptions.apiKey);

// Retrieve customer object for logged in user
exports.show = function(req, res, next) {
    const id = req.user._id;
    User.findById(id, function(err, user) {
        if (err) return next(err);
        stripe.customers.retrieve(user.stripe.customerId, function(err, customer) {
            if (err) return res.status(402).send('Error retrieving customer');
            console.log(customer)
            res.json(customer);
            next();
        });
    });
}

// List of payment methods for customer
exports.sources = function(req, res) {
    const id = req.user._id;
    User.findById(id, function(err, user) {
        if (err) return next(err);
        stripe.customers.createSource(user.stripe.customerId, 
            {source: req.body.source}, function(err, source) {
                if (err) return res.status(402).send('Error attaching source.');
                res.status(200).end();
                next();
            });
    });
}

// Default payment method for customer
exports.source = function(req, res) {
    const id = req.user._id;
    User.findById(id, function(err, user) {
        if (err) return next(err);
        stripe.customers.createSource(user.stripe.customerId, 
            {default_source: req.body.defaultSource}, function(err, customer) {
                if (err) return res.status(402).send('Error setting default source.');
                res.status(200).end();
                next();
            });
    });
}