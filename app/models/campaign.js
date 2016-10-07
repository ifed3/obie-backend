'use strict';

const mongoose = require('mongoose');

// Extend user schema with the following properties

module.exports = function userCampaign(schema) {
    var InfluencerSchema = new mongoose.Schema({
        name: {type: String, required: true},
        image: {type: String, required: true},
        location: {type: String}
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
        stages: [CampaignStagesSchema]
    });

    let CampaignStage = mongoose.model('CampaignStage', CampaignStagesSchema);

    schema.add({
        campaigns: [CampaignSchema]
    });

    var getCampaign = function(campaigns, name, callback) {
        // Check for campaign existence
        var campaign = campaigns.filter(function(campaign) {
            return campaign.name === name;
        })[0]
        if (!campaign) return callback(new Error("Campaign does not exist"));
        return campaign;
    }

    schema.methods.showCampaign = function(name, callback) {
        return callback(null, getCampaign(this.campaigns, name, callback));
    }

    schema.methods.createCampaign = function(name, influencers, callback) {
        var user = this;
        // Prevent duplicate campaign naming
        var campaignFilterArray = user.campaigns.filter(function(campaign) {
            return campaign.name === name;
        });
        if (campaignFilterArray.length > 0) return callback(new Error(name + " campaign already exists"));

        if (!user.campaigns || user.campaigns.length == 0) { // Initialize campaigns array
            user.campaigns = [];
        }

        let stage = new CampaignStage({ name: 'Start', status: true });
        user.campaigns.push({
            name: name,
            influencers: influencers.length == 0 ? [] : influencers,
            stages: [stage]
        });   

        user.save(function(err) {
            if (err) return callback(err);
            return callback(null);
        });                    
    };

    schema.methods.deleteCampaign = function(name, callback) {
        let user = this;
        let campaign = getCampaign(user.campaigns, name, callback);
        return callback(new Error("Delete functionality not yet implemented"));
        // user.save(function(err) {
        //     if (err) return callback(err);
        //     return callback(null);
        // }); 
    }

    schema.methods.updateCampaign = function(name, influencers, stage_name, callback) {
        var user = this;

        // Check for campaign existence
        var campaign = getCampaign(user.campaigns, name, callback);

        // Update campaign influencers
        if (campaign.influencers.length < 1 && influencers.length == 0) { //
            campaign.influencers = [];
        } else { // Push array elements into existing array
            campaign.influencers.push.apply(campaign.influencers, influencers);
        }

        // Initialize stages array if non-existent
        if (!campaign.stages || campaign.stages.length == 0) {
            campaign.stages = [];
        }

        // Add a stage to stages array only anew
        var stageFilterArray = campaign.stages.filter(function(stage) {
            return stage.name === stage_name;
        });
        if (stageFilterArray.length < 1) {
            let stage = new CampaignStage({ name: stage_name, status: true });
            campaign.stages.push(stage)
        } else {
            return callback(new Error(stage_name + " stage of campaign already exists"));
        }

        user.save(function(err) {
            if (err) return callback(err);
            return callback(null);
        });   
    };
}