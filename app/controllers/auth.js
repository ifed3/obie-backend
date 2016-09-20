const passport = require('passport'),
    LocalStrategy = require('passport-local'), 
    JWTStrategy = require('passport-jwt').Strategy,
    ExtractJWT = require('passport-jwt').ExtractJWT,
     Company =  require('../../app/models/company'),
     config = require('../../config');

module.exports = function(passport) {
    
}