var async = require('async');
var reqest = require('request');
var model = require('./api.model');

module.exports.screen = function(req, res, next) {
    async.waterfall(
        [
            exists,
            add,
            sendVerificationCode
        ],
        respond
    )

    function exists(callback) {
        model.exists(req.body.phone, (err, users) => {
            if (err) {
                return callback(err);
            }
            return callback(null, users.pop());
        });
    }

    function add(user, callback) {
        if (user) {
            return callback(null, user);
        }
        model.add(req.body.phone, (err, user) => {
            if (err) {
                return callback(err);
            }
            return callback(null, user);
        })
        
    }

    function sendVerificationCode(user, callback) {
        if (user.verified) {
            return callback(null, user);
        } else {
            // send the twillio verification code
            return callback(null, user);
        }
    }

    function respond(err, user) {
        if (err) {
            return res.status(500).jsonp({success: false});
        }
        return res.status(200).jsonp({
            success: true,
            payload: user
        });
    }
}

module.exports.weather = function(req, res, next) {
    res.send({});
}