'use strict';

const User = require('../../app/models/user');

// Get user's campaigns 
exports.index = function(req, res) {
    const id = req.user.id
    User.findById(id, function(err, user) {
        if (err) res.send(err);
        res.status(200).json(user.campaigns);
    })
}

// Update or create campaign campaign
exports.set = function(req, res) {
    const id = req.user.id
    const name = req.body.campaign_name
    const influencers = req.body.influencers
    const stage = req.body.stage_name
    User.findById(id, function(err, user) {
        if (err) res.send(err);
        user.setCampaign(name, influencers, stage, function(err) {
            if (err) res.send(err);
            res.status(200);
        });
    });
}

// Show campaign
exports.show = function(req, res) {
    const id = req.user.id
    const name = req.body.name
    User.findById(id, function(err, user) {
        if (err) res.send(err);
        let campaign = user.campaign.find({name: name})
        if (!campaign) res.status(422).json({ error: 'Campaign was not found'})
        res.status(200);
    });
}

// Remove campaign
exports.destroy = function(req, res) {
    // User.findById(id, function(err, user) {
    //     if (err) res.send(err);
    //     user.campaigns.pull()
    //     let campaign: user.campaign.find({name: name})
    //     res.status(200).json(user);
    // });
}