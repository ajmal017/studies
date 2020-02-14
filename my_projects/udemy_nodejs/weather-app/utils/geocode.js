const request = require('request');

function geocode(address, callback) {
  const token = 'pk.eyJ1IjoiamFzb240OCIsImEiOiJjazZlcnl4eGwyMHUyM21xamZsNmN3cGkyIn0.qBroraDthSNvDDPZDvs_rA';
  const url = `http://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${token}`;

  request({
    url,
    json: true
  }, (err, {
    body
  }) => {
    if (err) {
      callback('Unable to connect to location services!', undefined);
    } else if (body.features.length === 0) {
      callback('Unable to find location. Try another search.', undefined);
    } else {
      const longitude = body.features[0].center[0];
      const latitude = body.features[0].center[1];
      const placeName = body.features[0].place_name;
      callback(undefined, {
        latitude,
        longitude,
        placeName
      })
    }
  });
}

module.exports = geocode;