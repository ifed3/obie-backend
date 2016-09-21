'use strict';

const jwt = require('jsonwebtoken'),
    config = require('../../config'),
    expirationSeconds = 60*60*24, // 24 hours in seconds
    User = require('../../app/models/user');

function generateToken(user) {
    return jwt.sign(user, config.secret, {expiresIn: expirationSeconds});
}

function setUserInfo(req) {
    return {
        _id: request._id,
        name: req.profile.name,
        email: req.email,
        role: req.role
    }
};

exports.login = function(req, res) {
    let userInfo = setUserInfo(req.user);
    res.status(200).json({
        token: 'JWT ' + generateToken(userInfo), 
        user: userInfo
    });
}

exports.register = function(req, res, next) {
    const email = req.body.email,
        name = req.body.name,
        company = req.body.company,
        password = req.body.password;

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
            console.log("User succesfully created")
            // Respond with json web token upon succesfull creation
            res.status(200).json({
                token: 'JWT ' + generateToken(userInfo), 
                user: userInfo
            });
        });
    });
}

exports.roleAuth = function(role) {
    return function(req, res, next) {
        const user = req.user
        User.findById(user._id, function(err, user) {
            if (err) {
                res.status(422).json({ error: 'No user was found'});
                return next(err);
            }
            if (user.role == role) return next();
            res.status(401).json({ error: "You are not authorized to view this content"});
            return next('Unauthorized');
        });
    }
}