'use strict';

const User = require('../../app/models/user');

// Create new user
exports.create = function(req, res) {
    var user = new User(req.body);
    user.save(function(err) {
        if (err) res.send(err);
        console.log("User succesfully saved")
        res.json({ message: 'User created'});
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
    User.findById(req.params.company_id, function(err, user) {
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