'use strict';

const User = require('../../app/models/user');

// Get user's campaigns 
exports.index = function(req, res) {
    const id = req.user.id
    User.findById(id, function(err, user) {
        if (err) res.send(err);
        res.json(user.campaigns);
    })
}

// Create a new campagin
exports.create = function(req, res) {
    const id = req.user.id
    const name = req.body.campaign_name
    const influencers = req.body.influencers
    User.findById(id, function(err, user) {
        if (err) res.send(err);
        user.createCampaign(name, influencers, function(err) {
            if (err) res.send(err);
            res.status(200);
        });
    });
}

// Show campaign
exports.show = function(req, res) {
    User.findById(req.params.company_id, function(err, user) {
        if (err) res.send(err);
        res.json(user);
    });
}

// Update campaign
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

// Remove campaign
exports.destroy = function(req, res) {
    User.remove({_id: req.params.company_id}, function(err, companies) {
        if (err) res.send(err);
        res.json({ message: 'User deleted'});
    });
}