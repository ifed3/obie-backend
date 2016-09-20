'use strict';

const mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    bcrypt = require('bcrypt-nodejs'),
    stripeOptions = require('../../config').stripeOptions,
    stripeCustomer = require('./plugins/stripeCustomer');

var CompanySchema = new mongoose.Schema({
    email: {type: String, unique: true, lowercase: true},
    password: String,
    profile: {
        name: String,
        manager: String,
        website: String
    },
    created_at: {type: Date, default: Date.now}
});

// Extend schema with stripe attributes
CompanySchema.plugin(timestamps);
CompanySchema.plugin(stripeCustomer, stripeOptions);

//  Hash (with random salt) user's password
CompanySchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

// Compare password for login
CompanySchema.methods.comparePassword = function(potentialPass, callback) {
    bcrypt.compare(potentialPass, this.password, function(err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

module.exports = mongoose.model('Company', CompanySchema);