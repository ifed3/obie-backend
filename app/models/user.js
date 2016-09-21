'use strict';

const mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    stripeOptions = require('../../config').stripeOptions,
    stripeCustomer = require('./plugins/stripe-customer');

var UserSchema = new mongoose.Schema({
    email: { 
        type: String, 
        unique: true, 
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        name: { type: String, required: true },
        company: { type: String, required: true },
        website: { type: String },
        picture: { type: String }
    },
    role: {
        type: String,
        enum: ['Member', 'Client', 'Owner', 'Admin'],
        default: 'Member'
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: String },
},
{
    timestamps: true
});

// Extend schema with stripe attributes
UserSchema.plugin(stripeCustomer, stripeOptions);

//  Hash (with random salt) user's password
UserSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

// Compare password for login
UserSchema.methods.comparePassword = function(potentialPass, callback) {
    bcrypt.compare(potentialPass, this.password, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);