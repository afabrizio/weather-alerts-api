var MongoClient = require('mongodb').MongoClient
var assert = require('assert');
var dbs = 'test';
var url = 'mongodb://localhost:27017/' + dbs;

module.exports.exists = function(phone, callback) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Checking for user");
        var collection = db.collection('weatheralerts');
        collection.findOne(
            {
                phone: phone
            },
            (err, user) => callback(err, user)
        );
        db.close();
    });
}

module.exports.add = function(phone, callback) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Adding a new user");
        var collection = db.collection('weatheralerts');
        collection.insertOne(
            {
                phone : phone,
                verified : false,
                subscription : false
            },
            (err, result) => {
                return callback(err, result["ops"].pop())
            }
        );
        db.close();
    });
}

module.exports.generateCode = function(phone, callback) {
    const code = (Math.floor(Math.random()*900000) + 100000).toString();

    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Generating a verifiaction code");
        var collection = db.collection('weatheralerts');
        collection.findOneAndUpdate(
            {
                phone: phone,
            },
            {
                $set: {
                    verificationCode: code,
                    verified: false
                }
            },
            {
                returnOriginal: false
            },
            (err, user) => callback(err, user.value)
        )

        db.close();
    });

}

module.exports.verifyCode = function(phone, unverifedCode, callback) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Verifying code");
        var collection = db.collection('weatheralerts');
        collection.findOneAndUpdate(
            {
                phone: phone,
                verificationCode: unverifedCode
            },
            {
                $set: {
                    verified: true
                },
                $unset: {
                    verificationCode: ""
                } 
            },
            {
                returnOriginal: false
            },
            (err, user) => callback(err, user.value)
        );

        db.close();
    });
}

