const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });

const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    user: 'bruno',
    password: `${process.env.MYSQL_BRUNO_PASSWORD}`,
    database: 'apiusers',
  },
});

module.exports = knex;
