const express = require('express');
const app = express();
const {convertItinerary, getApi, showHomePage} = require('./controllers/convertItinerary');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
let session = require('express-session');










// Lots of other express stuff (app.use()'s)






app.use(session({secret: "Me@nw00d4L14e", resave: false, saveUninitialized: true, ephemeral: true}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.set('view engine', 'ejs');

app.get('/', showHomePage)
app.use('/', express.static('public'));


app.post('/',convertItinerary);
app.post('/api/', getApi)
app.use('/api-introduction', express.static('public/api.html'));
app.use('/aboutus', express.static('public/aboutus.html'));
app.use('/blog/', express.static('public/blog/index.html'));
app.use('/how-it-works/', express.static('public/howitworks.html'));



app.use('/termsandconditions', express.static('public/termsandconditions.html'));



module.exports = app;