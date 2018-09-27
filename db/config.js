process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const test = {
  port: 5432,
  host: 'localhost',
  database: 'airline_master_test'
};

const development = {
  port: 5432,
  host: 'localhost',
  database: 'airline_master'
}

const config = { test, development }

module.exports = config[process.env.NODE_ENV];