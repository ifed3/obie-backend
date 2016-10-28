'use strict';

const User = require('../../app/models/user');

// Use req.user.id when switching to campaign update by user and not admin

// Get user's campaigns 
exports.index = function(req, res) {
    const id = req.query.id;
    User.findById(id, function(err, user) {
        if (err) res.send(err);
        res.status(200).json({ campaigns: user.campaigns });
    });
}

// Create campaign
exports.create = function(req, res) {
    const id = req.body.id,
        name = req.body.campaign_name,
        influencers = req.body.influencers;
    User.findById(id, function(err, user) {
        if (err) res.send(err);
        user.createCampaign(name, influencers, function(err) {
            if (err) res.status(409).json({ error: err.message });
            user.save(function(err) {
                if (err) res.send(err);
                res.status(200).json("Campaign created");
            }); 
        });
    });
}

// Update campaign
exports.update = function(req, res) {
    const id = req.body.id,
        name = req.body.campaign_name,
        influencers = req.body.influencers,
        stage = req.body.stage_name;
    User.findById(id, function(err, user) {
        if (err) res.send(err);
        user.updateCampaign(name, influencers, stage, function(err) {
            if (err) res.status(409).json({ error: err.message });
            res.status(204).end();
        });
    });
}

// Show campaign
exports.show = function(req, res) {
    const id = req.query.id,
        name = req.query.name;
    User.findById(id, function(err, user) {
        if (err) res.send(err);
        user.showCampaign(name, function(err, campaign) {
            if (err) res.status(404).json({ error: err.message });
            res.status(200).json({ campaign: campaign });
        });
    });
}

// Remove campaign
exports.destroy = function(req, res) {
    const id = req.query.id,
        name = req.query.name;
    User.findById(id, function(err, user) {
        if (err) res.send(err);
        user.deleteCampaign(name, function(err) {
            if (err) res.status(404).json({ error: err.message });
            res.status(204).end();
        });
    });
}