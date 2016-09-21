'use strict';

const jwt = require('jsonwebtoken'),
    config = require('../../config'),
    expirationSeconds = 60*60*24, // 24 hours in seconds
    Company = require('../../app/models/company');

exports.create = function(req, res) {
    Company.findOne({email: req.body.email}, function(err, company) {
        if (err) res.send(err);
        if (!company) res.json({success: false, message: 'Authentication failed. Company not found.'});
        // Company exists in db, so compare passwords and assign token
        company.comparePassword(req.body.password, function(err, match) {
            if (err || !match) res.json({ success: false, message: 'Authentication failed. Wrong password'});
            // Correct company and password params so create token
            const token = jwt.sign(company, config.secret, {expiresIn: expirationSeconds});
            res.json({success: true, message: 'Here is the token', token: token});
        });
    });
}

exports.verify = function(req, res, next) {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) return res.json({success: false, message: 'Failed to authenticate token.'});
            req.decoded = decoded;
            next()
        })
    } else {
        res.status(403).send({sucess: false, message: 'No token provided'});
    }
}