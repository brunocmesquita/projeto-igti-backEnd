const User = require('../models/User');
const PasswordToken = require('../models/PasswordToken');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });

const secret = process.env.SECRET_KEY;

class UserController {
  async index(req, res) {
    try {
      let users = await User.findAll();
      res.json(users);
    } catch (err) {
      console.log(err);
    }
  }

  async findUser(req, res) {
    let id = req.params.id;
    let user = await User.findById(id);
    if (user == undefined) {
      res.status(404).json({});
    } else {
      res.json(user);
    }
  }

  async create(req, res) {
    const { email, name, password } = req.body;

    if (email == undefined || email == '' || email == ' ') {
      res.status(400);
      res.json({ err: 'O e-mail é inválido!' });
      return;
    }

    let emailExists = await User.findEmail(email);

    if (emailExists) {
      res.status(406);
      res.json({ err: 'O e-mail já está cadastrado!' });
      return;
    }

    await User.new(email, password, name);

    res.status(200);
    res.send('Tudo OK!');
  }

  async edit(req, res) {
    let { id, name, email, role } = req.body;
    let result = await User.update(id, name, email, role);
    if (result != undefined) {
      if (result.status) {
        res.send('Atualização realizada com sucesso!');
      } else {
        res.status(406).send(result.err);
      }
    } else {
      res.status(406).send('Ocorreu um erro no servidor');
    }
  }

  async remove(req, res) {
    let id = req.params.id;
    let result = await User.delete(id);
    if (result.status) {
      res.send('Usuário deletado');
    } else {
      res.status(406).send(result.err);
    }
  }

  async recoverPassword(req, res) {
    const email = req.body.email;
    let result = await PasswordToken.create(email);
    if (result.status) {
      res.send('' + result.token);
    } else {
      res.status(406).send(result.err);
    }
  }

  async changePassword(req, res) {
    const token = req.body.token;
    const password = req.body.password;

    const isValidToken = await PasswordToken.validate(token);
    if (isValidToken.status) {
      await User.changePassword(
        password,
        isValidToken.token.user_id,
        isValidToken.token.token
      );
      res.send('Senha alterada');
    } else {
      res.status(406).send('Token inválido!');
    }
  }

  async login(req, res) {
    let { email, password } = req.body;

    let user = await User.findByEmail(email);

    if (user != undefined) {
      let resultado = await bcrypt.compare(password, user.password);

      if (resultado) {
        let token = jwt.sign({ email: user.email, role: user.role }, secret);

        res.status(200);
        res.json({ token: token });
      } else {
        res.status(406);
        res.json({ err: 'Senha incorreta' });
      }
    } else {
      res.status(406);
      res.json({ status: false, err: 'O usuário não existe!' });
    }
  }
}

module.exports = new UserController();
