var passportJWT = require("passport-jwt");
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = require('./jwt-options');
var User = require('../models/user');

exports.strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    // console.log('payload received', jwt_payload);
    var user = User.findOne({ _id: jwt_payload.id }, function (err, user) {
        if (user)
            next(null, user);
        else
            next(null, false);

    })

});