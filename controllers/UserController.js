const User = require('../models/User');

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
    const { name, email, password } = req.body;
    if (email === undefined) {
      res.status(400).json({ err: 'E-mail inválido' });
      return;
    } else {
      let emailExists = await User.findEmail(email);
      if (emailExists) {
        res.status(406).json({ err: 'O email já está cadastrado' });
        return;
      }

      await User.new(email, password, name);
      res.status(200).send('Cadastro realizado!');
    }
  }
}

module.exports = new UserController();
