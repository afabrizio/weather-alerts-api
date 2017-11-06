var request = require('request');
const apiKey = 'f50d000e39def7257067250c2d4640a6';
const apiUri = 'http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=' + apiKey; 

module.exports.get = function(city, callback) {
    console.log('Getting weather for ', city);
    request(
        {
            method: 'GET',
            uri: apiUri + '&q=' + city,
            headers: {
            }
        },
        (error, response, stringifiedBody) => {
            if (stringifiedBody) {
                const body = JSON.parse(stringifiedBody);
                const current = body.list[0];
                const weather = {
                    location: body.city.name + ', ' + body.city.country,
                    description: current.weather[0] ? current.weather[0]['description'] : '',
                    temp: current.main.hasOwnProperty('temp') ? Math.round((9/5)*(current.main.temp - 273)+32) + ' F' : ''
                };
                return callback(error, weather);
            } else {
                return callback('Could not retrieve weather for ' + city + '.');
            }
        }
    );
}

