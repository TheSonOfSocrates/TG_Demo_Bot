const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const flights = require('./routes/api/flights');
const users = require('./routes/api/users');

const app = express();

global.isDBConnected = false;
global.customer_email = '';
global.customer_accessToken = '';
global.customer_licenseKey = '';

//Add Cors
app.use(cors());
app.options('*', cors());
app.use(express.static('public'));

// Frontend Urls
app.use(express.static(path.resolve('./frontend/build')));
app.get('/', (req, res) => {
  res.sendFile(path.resolve('./frontend/build', 'index.html'));
});
app.get('/dashboard/flight/list', (req, res) => {
  res.sendFile(path.resolve('./frontend/build', 'index.html'));
});
app.get('/dashboard/flight/create', (req, res) => {
  res.sendFile(path.resolve('./frontend/build', 'index.html'));
});
app.get('/dashboard/flight/:id', (req, res) => {
  res.sendFile(path.resolve('./frontend/build', 'index.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.resolve('./frontend/build', 'index.html'));
});
app.get('/tg-register-9016', (req, res) => {
  res.sendFile(path.resolve('./frontend/build', 'index.html'));
});

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// Routes
app.use('/api/flight', flights);
app.use('/api/user', users);
const port = process.env.PORT || 5005;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));