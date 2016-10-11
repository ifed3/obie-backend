'use strict';

const User = require('../../app/models/user');

exports.device_token = function(req, res) {
    const id = req.user._id,
        apn_device_token = req.body.device_token;
    User.findById(id, function(err, user) {
        if (err) res.status(422).send('No user was found');
        user.profile.device_token = apn_device_token;
        user.save(function(err) {
            if (err) res.send(err);
            console.log("Set user device token");
            res.status(200).send("Token retrieved");
        }); 
    });
}

// Show all companies
exports.index = function(req, res) {
    User.find({}, function(err, companies) {
        if (err) res.send(err);
        res.json(companies);
    })
}

// Show specific user details
exports.show = function(req, res) {
    User.findById(req.params.company_id, function(err, user) {
        if (err) res.send(err);
        res.json(user);
    });
}

// Update specific user details
exports.update = function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if (err) res.send(err);
        //Update user info here
        user.save(function(err) {
            if (err) res.send(err);
            res.json({ message: 'User updated' });
        });
    });
}

// Delete a user from database
exports.destroy = function(req, res) {
    User.remove({_id: req.params.company_id}, function(err, companies) {
        if (err) res.send(err);
        res.json({ message: 'User deleted'});
    });
}