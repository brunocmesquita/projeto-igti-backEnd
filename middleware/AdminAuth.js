const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });

const secret = process.env.SECRET_KEY;

module.exports = function (req, res, next) {
  const authToken = req.headers['authorization'];
  if (authToken != undefined) {
    const bearer = authToken.split(' ');
    let token = bearer[1];
    try {
      let decoded = jwt.verify(token, secret);
      if (decoded.role == 1) {
        next();
      } else {
        res.status(403).send('Você não tem permissão');
        return;
      }
    } catch (err) {
      res.status(403).send('Você não está autenticado');
      return;
    }
  } else {
    res.status(403).send('Você não está autenticado');
    return;
  }
};
