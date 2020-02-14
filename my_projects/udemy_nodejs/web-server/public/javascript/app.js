const weatherForm = document.querySelector('#search-form');

function getWeatherData(location) {
  const url = `http://127.0.0.1:3000/weather?address=${location}`;
  fetch(url).then(res => {
    res.json().then(data => {
      if (data.geoErr) {
        popUpErrorMsg(data.geoErr);
      } else if (data.forecastErr) {
        popUpErrorMsg(data.forecastErr);
      } else {
        showWeatherData(data);
      }
    });
  });
}

function popUpErrorMsg(errorMsg) {
  const errorMsgDiv = document.querySelector('#error-msg-container');
  errorMsgDiv.textContent = errorMsg;
  errorMsgDiv.style.display = 'flex';
  // Clear all previous timeouts if the user inputs wrong location consecutively
  let id = window.setTimeout(function () { }, 0);
  while (id--) {
    window.clearTimeout(id); // will do nothing if no timeout with id is present
  }
  setTimeout(() => {
    errorMsgDiv.style.display = 'none';
  }, 2500);
}

function showWeatherData(weatherData) {
  const resultDiv = document.querySelector('#weather-data');
  resultDiv.textContent = `${weatherData.placeName}\xA0\xA0\xA0Current Temp: ${weatherData.forecastData}\xA0\xB0C`;
}


weatherForm.addEventListener('submit', (e) => {
  const searchInput = document.querySelector('#search-box');
  const location = searchInput.value;
  getWeatherData(location);
  e.preventDefault();
});