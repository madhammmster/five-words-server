// Load required packages
var User = require('../models/user');

var jwtOptions = require('../passport/jwt-options');
var jwt = require('jsonwebtoken');

module.exports = function (passport) {
    var mod = {};

    // Create endpoint /api/users for POST
    mod.postUsers = function (req, res) {
        var user = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        });

        user.save(function (err) {
            if (err)
                res.send(err);

            res.json({ message: 'New user added!' });
        });
    };    

    // Create endpoint /api/users for GET
    mod.getUsers = function (req, res) {
        User.find(function (err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });
    };

    mod.login = function (req, res) {
        var name, password;
        if (req.body.name && req.body.password) {
            name = req.body.name;
            password = req.body.password;
        }

        User.find({ username: name }, function (err, users) {
            var user = users[0];

            if (user == undefined) {
                res.status(401).json({ message: "no such user found" });
            }

            if (user.password === password) {
                var payload = { id: user.id };
                var token = jwt.sign(payload, jwtOptions.secretOrKey);
                res.json({ message: "ok", token: token });
            } else {
                res.status(401).json({ message: "passwords did not match" });
            }

        })



    };

    return mod;

}