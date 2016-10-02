'use strict';

const mongoose = require('mongoose');

// Extend user schema with the following properties

module.exports = function userCampaign(schema) {
    var InfluencerSchema = new mongoose.Schema({
        name: {type: String, required: true},
        image: {type: String, required: true}
    });

    var CampaignStagesSchema = new mongoose.Schema({
        stage: {
            name: {
                type: String, 
                enum: ['Start', 'Discover', 'Contact', 'Manage', 'Launch'],
                default: 'Start',
                required: true
            },
            status: {type: Boolean, default: false, required: true},
        }
    },
    {
        timestamps: true
    });

    var CampaignSchema = new mongoose.Schema({
        influencers: [InfluencerSchema],
        stages: [CampaignStagesSchema],
    });

    schema.add({
        campaigns: [CampaignSchema]
    });

    // Create campaign stages
    let CampaignStage = mongoose.model('CampaignStage', CampaignStagesSchema);
    var stagesArray = []
    stagesArray.push(new CampaignStage({ name: 'Start', status: false })); 
    stagesArray.push(new CampaignStage({ name: 'Discover', status: false }));
    stagesArray.push(new CampaignStage({ name: 'Contact', status: false }));
    stagesArray.push(new CampaignStage({ name: 'Manage', status: false }));
    stagesArray.push(new CampaignStage({ name: 'Launch', status: false }));

    schema.pre('save', function(next) {
        var user = this;
        if (!this.campaigns || this.campaigns.length == 0) {
            this.campaigns = [];
            this.campaigns.push({ 
                influencers: [],
                stages: []
            });

            this.campaigns.forEach(function(campaign) {
                if (!campaign.stages || campaign.stages.length == 0) {
                    campaign.stages = stagesArray;
                }
            });
        }
        next();
    });

    // Create campaign array
    let Campaign = mongoose.model('Campaign', CampaignSchema);
    var campaign = new Campaign()
}