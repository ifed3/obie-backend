'use strict';

const LocalStrategy = require('passport-local').Strategy, 
    JWTStrategy = require('passport-jwt').Strategy,
    ExtractJWT = require('passport-jwt').ExtractJwt,
    User =  require('../app/models/user'),
    config = require('./');

const localOptions = { usernameField: 'email' },
    jwtOptions = {
        jwtFromRequest: ExtractJWT.fromAuthHeader(),
        secretOrKey: config.secret
    };

module.exports = function(passport) {
    passport.use(new LocalStrategy(localOptions, 
        function(email, password, done) {
            User.findOne({email: email}, function(err, user) {
                if (err) return done(err);
                if (!user) return done(null, false, {message: 'Authentication failed. Incorrect email.'});
                // User exists in db, so compare passwords and assign token
                user.comparePassword(password, function(err, isMatch) {
                    if (err) return done(err);
                    if (!isMatch) return done(null, false, {message: 'Authentication failed. Wrong password'});
                    // Correct user and password params so create token
                    return done(null, user);
                });
            });
        })
    );

    passport.use(new JWTStrategy(jwtOptions, 
        function(payload, done) {
            User.findById(payload._id, function(err, user) {
                if (err) return done(err, false);
                if (user) done(null, user);
                else done(null, false);
            });
        })
    );
}
