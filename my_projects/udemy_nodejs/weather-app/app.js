const geocode = require('./utils/geocode.js');
const forecast = require('./utils/forecast.js');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Input Your Location: ', (userLocation) => {
  geocode(userLocation, (geoErr, {
    latitude,
    longitude,
    placeName
  }) => {
    if (geoErr) {
      return console.log(geoErr);
    }
    forecast(longitude, latitude, (castErr, castData) => {
      if (castErr) {
        return console.log(castErr);
      }
      console.log(`location: ${placeName}`);
      console.log(`Current Temp: ${castData}`);
    });
  });

  rl.close();
});