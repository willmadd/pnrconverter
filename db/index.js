const DB = require('./config.js');
const pgp = require('pg-promise')({ promiseLib: Promise });
module.exports = pgp(DB);
