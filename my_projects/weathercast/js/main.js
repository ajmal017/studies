const weather = new Weather;



weather.getWeather('busan')
  .then(data => {
    console.log(data)
  })