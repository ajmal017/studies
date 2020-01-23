class Weather {
  constructor() {
    this.url = 'https://api.openweathermap.org/data/2.5/weather';
    this.apiKey = '7dd35a56b9eda4eb3ea9842fcc24ca33';
  }

  async getWeather(cityName) {
    const currentWeather = await fetch(`${this.url}?q=${cityName}&appid=${this.apiKey}`);

    return currentWeather.json();
  }
}
