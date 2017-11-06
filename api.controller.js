var async = require('async');
var reqest = require('request');
var model = require('./api.model');
var twilio = require('./twillio');
var weatherService = require('./weather');

module.exports.screen = function(req, res, next) {
    async.waterfall(
        [
            exists,
            add,
            generateVerificationCode,
            sendVerificationCode
        ],
        respond
    )

    function exists(callback) {
        model.exists(
            req.body.phone,
            (err, user) => callback(err, user)
        );
    };

    function add(user, callback) {
        if (user) {
            return callback(null, user);
        }
        model.add(
            req.body.phone,
            (err, user) => callback(err, user)
        )
        
    };

    function generateVerificationCode(user, callback) {
        if (user.verified) {
            return callback(null, user);
        } else {
            model.generateCode(
                user.phone,
                (err, user) => {
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, user);
                }
            )
        }
    };

    function sendVerificationCode(user, callback) {
        if (user.verified) {
            return callback(null, user);
        } else {
            twilio.sendSMS(
                user.phone.toString(),
                'Your six digit verification code is ' + user.verificationCode,
                (err, message) => {
                    if (err) {
                        console.log(err);
                        return callback(err);
                    }
                    return callback(null, user);
                }
            )
        }
    };

    function respond(err, user) {
        if (err) {
            return res.status(500).jsonp({success: false});
        }
        return res.status(200).jsonp({
            user: user
        });
    };
}

module.exports.verify = function(req, res, next) {
    async.waterfall([verify], respond);

    function verify(callback) {
        model.verifyCode(
            req.body.phone,
            req.body.unverifiedCode,
            (err, user) => {
                if (!user) {
                    console.log('Code invalid')                
                    model.exists(
                        req.body.phone,
                        (err, user) => callback(err, user)
                    )
                } else {
                    console.log('Code valid', err, user)
                    return callback(err, user);
                }
            }
        );
    };

    function respond(err, user) {
        if (err) {
            return res.status(500).jsonp({success: false});
        }
        return res.status(200).jsonp({
            user: user
        });
    };
}

module.exports.weather = function(req, res, next) {
    async.waterfall(
        [
            getUser,
            getWeather,
            sendWeatherSMS
        ],
        respond
    );

    function getUser(callback) {
        model.exists(
            req.body.phone,
            (err, user) => callback(err, user)
        )
    }

    function getWeather(user, callback) {
        if (user.verified) {
            weatherService.get(
                req.body.city,
                (err, weather) => {
                    return callback(null, user, weather);
                }
            )
        } else {
            return callback('Phone number is not verified.');
        }

    }

    function sendWeatherSMS(user, weather, callback) {
        twilio.sendSMS(
            user.phone,
            `${weather.location}, Temperature: ${weather.temp}, Conditions: ${weather.description}`,
            (err, message) => {
                return callback(null);
            }
        )
    }

    function respond(err, user, weather) {
        if (err) {
            return res.status(500).jsonp({success: false});
        }
        return res.status(200).jsonp({
            user: user,
            weather: weather
        });
    };
}