const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode.js');
const forecast = require('./utils/forecast');

const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));


app.get('/', (req, res) => {
  res.render('index.hbs', {
    title: 'Weather App',
    creatorName: 'Jason Hudson'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    title: 'Weather App/About',
    creatorName: 'Jason Hudson'
  });
});

app.get('/help', (req, res) => {
  res.render('help.hbs', {
    title: 'Weather App/Help',
    creatorName: 'Jason Hudson',
    helpText: 'This is some helpful text.'
  });
});

app.get('/help/*', (req, res) => {
  res.render('404.hbs', {
    title: '404 Page Not Found',
    creatorName: 'Jason Hudson',
    errorMessage: 'Help article not found.'
  });
});

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send('You must provide an address term.');
  }
  const userAddress = req.query.address;
  geocode(userAddress, (geoErr, {
    latitude,
    longitude,
    placeName
  } = {}) => {
    if (geoErr) {
      return res.send({
        geoErr
      });
    }
    forecast(longitude, latitude, (forecastErr, forecastData) => {
      if (forecastErr) {
        return res.send({
          forecastErr
        });
      }
      res.send({
        placeName,
        forecastData,
        address: userAddress
      });
    });
  });
});

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term.'
    });
  }
  console.log(req.query.search);
  res.send({
    products: []
  });
});

app.get('*', (req, res) => {
  res.render('404.hbs', {
    title: '404 Page Not Found',
    creatorName: 'Jason Hudson',
    errorMessage: 'Page Not Found!'
  });
});

app.listen(3000, () => {
  console.log('Server is up on port 3000.');
});