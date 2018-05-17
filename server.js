const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const https = require('https');
const port = 3000;

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

//Controllers
const signupController = require('./controllers/signup.js');
app.use('/signup', signupController);

const loginController = require('./controllers/login.js');
app.use('/login', loginController);

const bookingController = require('./controllers/booking.js');
app.use('/booking', bookingController);

//Routes
app.post('/data', (request, result) => {
  let origin = request.body.origin;
  let destination = request.body.destination;
  let departure_date = request.body.departure_date;
  let adults = request.body.adults;
  let childern = request.body.childern;
  const url =
    'https://api.sandbox.amadeus.com/v1.2/flights/low-fare-search?apikey='
    + 'k2T3GZdaayI2VO5RRY276f0ibNvsGTcI'
    + '&' + 'origin=' + origin
    + '&' + 'destination=' + destination
    + '&' + 'departure_date=' + departure_date
    + '&' + 'adults=' + adults
    if(childern > 0){
      url + '&' + 'childern=' + childern
    }
  https.get(url, res => {
    res.setEncoding("utf8");
    let body = "";
    res.on("data", data => {
      body += data;
    });
    res.on("end", () => {
      body = JSON.parse(body);
      result.json(body)
      console.log(body);
    });
  });
});

app.post('/autocomplete', (request, result) => {
  let term = request.body.term;
  const url =
    'https://api.sandbox.amadeus.com/v1.2/airports/autocomplete?apikey='
    + 'k2T3GZdaayI2VO5RRY276f0ibNvsGTcI'
    + '&' + 'term=' + term
  https.get(url, res => {
    res.setEncoding("utf8");
    let body = "";
    res.on("data", data => {
      body += data;
    });
    res.on("end", () => {
      body = JSON.parse(body);
      result.json(body)
      console.log(body);
    });
  });
});


const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/' + 'flight-finder';
mongoose.connect(mongoURI);
mongoose.connection.once('open', () => {
  console.log('connected to mongod');
});

//Listener
app.listen(port, () => {
  console.log('listening on port' , port);
});
