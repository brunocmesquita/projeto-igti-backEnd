var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var router = require('./routes/routes');
const dotenv = require('dotenv');

// load config
dotenv.config({ path: './config/config.env' });
const PORT = process.env.PORT || 8687;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use('/', router);

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`
  );
});
