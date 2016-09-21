const passport = require('passport'),
    LocalStrategy = require('passport-local'), 
    JWTStrategy = require('passport-jwt').Strategy,
    ExtractJWT = require('passport-jwt').ExtractJWT,
     Company =  require('../../app/models/company'),
     config = require('../../config');

module.exports = function(passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJWT.fromAuthHeader();
    opts.secretOrKey = config.secret;
    passport.use(new JWTStrategy(opts, function(jwt_payload, done) {
        Company.findOne({id: jwt_payload}, function(err, company) {
            if (err) return done(err, false);
            if (user) done(null, user);
            else done(null, false);
        })
    }))
}