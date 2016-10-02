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
    
    // Create campaign stages
    let CampaignStage = mongoose.model('CampaignStage', CampaignStagesSchema);
    let start = new CampaignStage, 
        discover = new CampaignStage({ name: 'Discover' }),
        contact = new CampaignStage({ name: 'Contact' }),
        manage = new CampaignStage({ name: 'Manage' }),
        launch = new CampaignStage({ name: 'Launch' });

    var CampaignSchema = new mongoose.Schema({
        influencers: [InfluencerSchema],
        stages: [start, discover, contact, manage, launch],
    });

    // Create campaign array
    let Campaign = mongoose.model('Campaign', CampaignSchema);
    var campaign = new Campaign()

    schema.add({
        campaigns: [campaign]
    });
}