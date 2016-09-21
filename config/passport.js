'use strict';

const passport = require('passport'),
    LocalStrategy = require('passport-local'), 
    JWTStrategy = require('passport-jwt').Strategy,
    ExtractJWT = require('passport-jwt').ExtractJWT,
    User =  require('../../app/models/user')
    localOptions = { usernameField: 'email' },
    config = require('../../config');

module.exports = function(passport) {
    const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
        User.findOne({email: email}, function(err, user) {
            if (err) return done(err);
            if (!user) return done(null, false, {message: 'Authentication failed. User not found.'});
            // User exists in db, so compare passwords and assign token
            user.comparePassword(password, function(err, isMatch) {
                if (err) return done(err);
                if (!isMatch) res.json({ success: false, message: 'Authentication failed. Wrong password'});
                // Correct user and password params so create token
                return done(null, user);
            });
        });
    });

    const jwtOptions = {
        jwtFromRequest = ExtractJWT.fromAuthHeader(),
        secretOrKey = config.secret
    };

    const jwtLogin = new JWTStrategy(jwtOptions, function(payload, done) {
        User.findById(payload._id, function(err, user) {
            if (err) return done(err, false);
            if (user) done(null, user);
            else done(null, false);
        });
    });

    passport.use(jwtLogin);
    passport.use(localLogin);
}