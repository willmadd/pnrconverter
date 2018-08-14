const express = require('express');
const app = express();
const {convertItinerary} = require('./controllers/convertItinerary');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use('/', express.static('public'));

app.post('/',convertItinerary);


module.exports = app;