require('dotenv').config();
module.exports = {
  development: {
    username: 'root',
    password: process.env.DATABASE_PASSWORD,
    database: 'raqeeb_db',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  test: {
    username: 'root',
    password: null,
    database: 'raqeeb_db_test',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    username: 'root',
    password: null,
    database: 'raqeeb_db_prod',
    host: '127.0.0.1',
    dialect: 'mysql'
  }
};
