'use strict';

const jwt = require('jsonwebtoken'),
    config = require('../../config'),
    expirationSeconds = 60*60*24, // 24 hours in seconds
    User = require('../../app/models/user');

const FIRST_CAMPAIGN_TITLE = "My First Campaign";    

function generateToken(user) {
    return jwt.sign(user, config.secret, {expiresIn: expirationSeconds});
}

function setUserInfo(user) {
    return {
        _id: user._id,
        name: user.profile.name,
        stripe: user.stripe,
        company: user.profile.company,
        email: user.email,
        image: user.profile.picture,
        role: user.role,
        campaigns: user.campaigns
    }
};

// exports.ensureUnauthenticated = function(req, res, next) {
//   if (!req.isAuthenticated()) return next();
//   next();
// }

exports.email_check = function(req, res, next) {
    const email = req.query.email
    User.find({ email: email}, function(err, user) {
        if (err) next(err);
        // Check if email is unique as in not present in db
        // Only existing emails will have a user.length attribute
        console.log("Email is unique " + String(user.length ? false : true));
        if (user.length) res.status(404).end(); // Existing email address, not unique
        res.status(200).end();
    });
}

exports.login = function(req, res) {
    let userInfo = setUserInfo(req.user);
    console.log("User succesfully logged in")
    res.status(200).json({
        token: 'JWT ' + generateToken(userInfo), 
        user: userInfo
    });
}

exports.register = function(req, res, next) {
    const email = req.body.email,
        name = req.body.profile.name,
        company = req.body.profile.company,
        password = req.body.password,
        stripe_token = req.body.stripe.token

    // Error checking
    if (!email) return res.status(422).send({ error: 'You must enter an email address'});
    if (!name) return res.status(422).send({ error: 'You must enter your name'});
    if (!company) return res.status(422).send({ error: "You must enter your company's name"});
    if (!password) return res.status(422).send({ error: 'You must enter a password'});

    User.findOne({ email: email }, function(err, currUser) {
        if (err) return next(err);
        if (currUser) return res.status(422).send({ error: 'That email address is already in use'});

        // Create a new account when provided with a unique email, and a password
        let user = new User(req.body);
        user.save(function(err) {
            if (err) return next(err);
            user.setPlan(user.stripe.plan, stripe_token, function(err) {
                if (err) return next(err);
                 user.createCampaign(FIRST_CAMPAIGN_TITLE, [], function(err) {
                    if (err) return next(err);
                    console.log("User succesfully created and subscribed to " + user.stripe.plan + " plan")
                    // Respond with json web token upon succesfull creation
                    let userInfo = setUserInfo(user);
                    res.status(200).json({
                        token: 'JWT ' + generateToken(userInfo), 
                        user: userInfo
                    });
                });
            });
        });
    });
}

exports.roleAuth = function(role) {
    return function(req, res, next) {
        if (!req.isAuthenticated()) return next('Unauthorized');
        const user = req.user
        User.findById(user._id, function(err, user) {
            if (err) res.status(422).json({ error: 'No user was found'});
            if (user.role == role) return next();
            res.status(401).json({ error: "You are not authorized to view this content"});
        });
    }
}