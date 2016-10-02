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

    schema.methods.createCampaign = function(name, influencers, callback) {
        var user = this;
        let CampaignStage = mongoose.model('CampaignStage', CampaignStagesSchema)
        let campaignStage = new CampaignStage({ name: 'Start', status: true })
        if (!user.campaigns || users.campaigns.length == 0) {
            // Initialize campaigns array
            user.campaigns = [];
            users.campaigns.push({
                name: name,
                influencers: influencers.length == 0 ? [] : influencers,
                stages: [campaignStage]
            });
        };
        user.save(function(err) {
            if (err) return callback(err);
            return callback(null);
        });    
    };

    schema.methods.updateCampaign = function(name, influencers, stage, callback) {
        var user = this;
        // Find campaign with name
        if (!user.campaigns || users.campaigns.length == 0) {
            // Initialize campaigns array
            user.campaigns = [];
        }
        users.campaigns.push({
            name: name,
            influencers: influencers.length == 0 ? [] : influencers,
            stages: [campaignStage]
        });
    }

    // schema.pre('save', function(next) {
    //     var user = this;
    //     if (!this.campaigns || this.campaigns.length == 0) {
    //         this.campaigns = [];
    //         this.campaigns.push({ 
    //             influencers: [],
    //             stages: []
    //         });

    //         this.campaigns.forEach(function(campaign) {
    //             if (!campaign.stages || campaign.stages.length == 0) {
    //                 campaign.stages = stagesArray;
    //             }
    //         });
    //     }
    //     next();
    // });
}