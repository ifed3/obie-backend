'use strict';

const jwt = require('jsonwebtoken'),
    config = require('../../config'),
    tokenExpirationMinutes = 1440,
    Company = require('../../app/models/company');

exports.create = function(req, res) {
    Company.findOne({email: req.body.email}, function(err, company) {
        if (err) res.send(err);
        if (!company) res.json({success: false, message: 'Authentication failed. User not found.'});
        else if (user) {
            if (user.password != req.body.password) {
                res.json({ sucess: false, message: 'Authentication failed. Wrong password'});
            } else {
                // Correct user and password params sent
                // Create token set to expire
                const token = jwt.sign(companny, config.secret, {expiresInMinutes: tokenExpirationMinutes});
                res.json({success: true, message: 'Here is the token', token: token});
            }
        }
    });
}

