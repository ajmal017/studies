const request = require('request');

function forecast(longitude, latitude, callback) {
  const key = '7dd35a56b9eda4eb3ea9842fcc24ca33';
  const url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`;

  request({
    url,
    json: true
  }, (err, {
    body
  }) => {
    if (err) {
      callback('Unable to connect to weather service!', undefined);
    } else if (body.cod === '400') {
      callback('WEATHER ERR: Unable to find location. Try search again.', undefined);
    } else {
      const currentTemp = body.main.temp;
      callback(undefined, currentTemp);
    }
  })
}

module.exports = forecast;