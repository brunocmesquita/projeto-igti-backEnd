const knex = require('../database/connection');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const PasswordToken = require('./PasswordToken');

class User {
  async findAll() {
    try {
      let result = await knex
        .select(['id', 'email', 'role', 'name'])
        .table('users');
      return result;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async findById(id) {
    try {
      let result = await knex
        .select(['id', 'email', 'role', 'name'])
        .where({ id: id })
        .table('users');

      if (result.length > 0) {
        return result[0];
      } else {
        return undefined;
      }
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  async findByEmail(email) {
    try {
      let result = await knex
        .select(['id', 'email', 'password', 'role', 'name'])
        .where({ email: email })
        .table('users');

      if (result.length > 0) {
        return result[0];
      } else {
        return undefined;
      }
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }
  async new(email, password, name, id) {
    try {
      let hash = await bcrypt.hash(password, 10);
      await knex
        .insert({ email, password: hash, name, role: 0, id: uuidv4() })
        .table('users');
    } catch (err) {
      console.log(err);
    }
  }

  async findEmail(email) {
    try {
      let result = await knex.select('*').from('users').where({ email: email });

      if (result.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async update(id, name, email, role) {
    let user = await this.findById(id);
    if (user != undefined) {
      let editUser = {};
      if (email != undefined) {
        if (email != user.email) {
          let result = await this.findEmail(email);
          if (result == false) {
            editUser.email = email;
          } else {
            return {
              status: false,
              err: 'O e-mail j?? est?? cadastrado.',
            };
          }
        }
      }
      if (name != undefined) {
        editUser.name = name;
      }
      if (role != undefined) {
        editUser.role = role;
      }
      try {
        await knex.update(editUser).where({ id: id }).table('users');
        return {
          status: true,
        };
      } catch (err) {
        return { status: false, err: err };
      }
    } else {
      return { status: false, err: 'O usu??rio n??o existe.' };
    }
  }

  async delete(id) {
    let user = await this.findById(id);
    if (user != undefined) {
      try {
        await knex.delete().where({ id: id }).table('users');
        return { status: true };
      } catch (err) {
        return {
          status: false,
          err: err,
        };
      }
    } else {
      return {
        status: false,
        err: 'O usu??rio n??o existe, portanto n??o pode ser deletado',
      };
    }
  }

  async changePassword(newPassword, id, token) {
    let hash = await bcrypt.hash(newPassword, 10);
    await knex.update({ password: hash }).where({ id: id }).table('users');
    await PasswordToken.setUsed(token);
  }
}

module.exports = new User();
