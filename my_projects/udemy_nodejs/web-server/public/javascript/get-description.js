import { weatherCodeDesc, weatherIcon } from '/javascript/weathercodes.js';

export function getWeatherDesc(weatherCode) {
  const weatherDescLen = weatherCodeDesc.length;
  let weatherDescription;
  for (let i = 0; i < weatherDescLen; i++) {
    if (weatherCodeDesc[i].id == weatherCode) {
      weatherDescription = weatherCodeDesc[i].description;
    }
  }
  return weatherDescription;
}

export function getWeatherIcon(weatherCode) {
  const weatherIconLen = weatherIcon.length;
  const leadingNum = weatherCode.toString().substring(0, 1);
  let weatherIconClass;

  if (leadingNum == 7 || leadingNum == 8) {
    for (let i = 0; i < weatherIconLen; i++) {
      if (weatherIcon[i].id == weatherCode) {
        weatherIconClass = weatherIcon[i].icon;
      }
    }
  } else {
    for (let i = 0; i < weatherIconLen; i++) {
      if (weatherIcon[i].id == leadingNum) {
        weatherIconClass = weatherIcon[i].icon;
      }
    }
  }
  return weatherIconClass;
}