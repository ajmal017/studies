import { getWeatherDesc, getWeatherIcon } from './get-description.js'
const weatherForm = document.querySelector('#search-form');


function getWeatherData(location) {
  const url = `/weather?address=${location}`;
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

  const placeName = weatherData.placeName;
  const weatherCode = weatherData.forecastData.weatherCode;
  const currentTemp = weatherData.forecastData.currentTemp;
  const tempFeelsLike = weatherData.forecastData.feelsLike;
  const windSpeed = weatherData.forecastData.windSpeed;
  const windDeg = weatherData.forecastData.windDegree;

  const weatherDescription = getWeatherDesc(weatherCode);
  const weatherIconClass = getWeatherIcon(weatherCode);

  resultDiv.style.display = 'grid';
  const content = `
    <div id="place-name">${placeName}</div>
    <div id="current-temp">${currentTemp}<i class="wi wi-celsius"></i></div>
    <div id="weather-desc">${weatherDescription}<i class="${weatherIconClass}"></i></div>
    <div id="temp-feels-like">Feeling Temperature: ${tempFeelsLike} <i class="wi wi-celsius"></i></div>
    <div id="wind-speed">${windSpeed} m/s</div>
    <div id="wind-direction"><i class="wi wi-wind towards-0-deg" style="transform: rotate(${windDeg}deg)"></i></div>
  `
  resultDiv.innerHTML = content;
}


weatherForm.addEventListener('submit', (e) => {
  const searchInput = document.querySelector('#search-box');
  const location = searchInput.value;
  getWeatherData(location);
  e.preventDefault();
});