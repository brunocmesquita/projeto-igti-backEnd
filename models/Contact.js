const knex = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

class Contact {
  async findAll() {
    try {
      let result = await knex
        .select(['name', 'email', 'fone', 'insurance'])
        .table('contacts');
      return result;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async new(name, email, fone, insurance, contacted, id) {
    try {
      await knex
        .insert({ name, email, fone, insurance, contacted: 0, id: uuidv4() })
        .table('contacts');
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new Contact();
