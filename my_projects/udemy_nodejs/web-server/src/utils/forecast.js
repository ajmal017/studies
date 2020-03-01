const request = require('request');

function forecast(longitude, latitude, callback) {
  const key = '7dd35a56b9eda4eb3ea9842fcc24ca33';
  const url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`;
  request({
    url,
    json: true
  }, (err, { body }) => {
    if (err) {
      callback('Unable to connect to weather service!', undefined);
    } else if (body.cod === '400') {
      callback('WEATHER ERR: Unable to find location. Try search again.', undefined);
    } else {
      const weatherCode = body.weather[0].id;
      const weatherDesc = body.weather[0].description;
      const currentTemp = body.main.temp;
      const feelsLike = body.main.feels_like;
      const windSpeed = body.wind.speed;
      const windDegree = body.wind.deg;
      callback(undefined, {
        weatherCode,
        weatherDesc,
        currentTemp,
        feelsLike,
        windSpeed,
        windDegree
      });
    }
  });
}

module.exports = forecast;