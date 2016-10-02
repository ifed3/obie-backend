'use strict';

const mongoose = require('mongoose');

// Extend user schema with the following properties

module.exports = function userCampaign(schema) {
    var InfluencerSchema = new mongoose.Schema({
        name: {type: String, required: true},
        image: {type: String, required: true}
    });

    var CampaignStagesSchema = new mongoose.Schema({
        name: {
            type: String, 
            enum: ['Start', 'Discover', 'Contact', 'Manage', 'Launch'],
            required: true
        },
        status: {type: Boolean, required: true},
        created: {type: Date, default: Date.now}
    });

    var CampaignSchema = new mongoose.Schema({
        name: {type: String, required: true},
        influencers: [InfluencerSchema],
        stages: [CampaignStagesSchema],
    });

    schema.add({
        campaigns: [CampaignSchema]
    });

    schema.methods.setCampaign = function(name, influencers, stage_name, callback) {
        var user = this;

        let CampaignStage = mongoose.model('CampaignStage', CampaignStagesSchema);
        let stage = new CampaignStage({ name: stage_name, status: true });

        var createCampaign = function(name, influencers, stage_name, callback) {
            user.campaigns = [];
            users.campaigns.push({
                name: name,
                influencers: influencers.length == 0 ? [] : influencers,
                stages: [stage]
            });        
        };

        var updateCampaign = function(name, influencers, stage_name, callback) {
            campaign = users.campaigns.find({name: name});
            if (!campaign) {
                return callback(new Error("Campaign with provided name could not be found"));
            }
            // Update campaign influencers
            campaign.influencers = influencers.length == 0 ? [] : influencers;
            // Initialize stages array if non-existent
            if (!campaign.stages || campaign.stages.length == 0) {
                campaign.stages = [];
            }
            campaign.stages.push(stage)
        }

        if (!user.campaigns || users.campaigns.length == 0) {
            createCampaign(name, influencers, stage_name, callback);
        } else {
            updateCampaign(name, influencers, stage_name, callback);
        }

        user.save(function(err) {
            if (err) return callback(err);
            return callback(null);
        });   
    };
}