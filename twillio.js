var request = require('request');
var twilio = require('twilio')
const twilioBase = 'https://api.twilio.com/2010-04-01/Accounts/';
const twilioSID = 'ACf5ccb724326a0d062e3a56af379490b2';
const twilioAuthToken = 'ade319b20663013c0921c2dde3e5225d';
const twilioSender = '+16572454285';
var twilioService = new twilio(twilioSID, twilioAuthToken);

module.exports.sendSMS = function(recipient, body, callback) {
    const to = recipient.replace(/[^\d]/g, '');
    if (to && to.length === 10) {
        twilioService.messages.create(
            {
                body: body,
                to: '+1' + to,
                from: twilioSender
            },
            (err, message) => callback(err, message)
        )
    }
}