const express = require('express');
const app = express();
const {convertItinerary, getApi, showHomePage} = require('./controllers/convertItinerary');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
let session = require('express-session');



app.use(session({secret: "Me@nw00d4L14e", resave: false, saveUninitialized: true, ephemeral: true}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.set('view engine', 'ejs');

app.get('/', showHomePage)
app.use('/', express.static('public'));


app.post('/',convertItinerary);
app.post('/api/', getApi)
app.use('/api/', express.static('public/api.html'));
app.use('/termsandconditions', express.static('public/termsandconditions.html'));
module.exports = app;