var MongoClient = require('mongodb').MongoClient
var assert = require('assert');
var dbs = 'test';
var url = 'mongodb://localhost:27017/' + dbs;

module.exports.exists = function(phone, callback) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        var collection = db.collection('weatheralerts');
        collection.find({phone: phone}).toArray(
            function(err, users) {
                assert.equal(err, null);
                console.log("Found the following records");
                console.dir(users);
                return callback(err, users);
            }
        );
        db.close();
    });
}

module.exports.add = function(phone, callback) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        var collection = db.collection('weatheralerts');
        collection.insert(
            {
                phone : phone,
                verified : false,
                subscription : false
            },
            function(err, results) {
                return callback(err, results["ops"].pop());
            }
        );
        db.close();
    });
}