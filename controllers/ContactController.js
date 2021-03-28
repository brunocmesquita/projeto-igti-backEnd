const Contact = require('../models/Contact');

class ContactController {
  async index(req, res) {
    try {
      let contacts = await Contact.findAll();
      res.json(contacts);
    } catch (err) {
      console.log(err);
    }
  }

  async create(req, res) {
    const { name, email, fone, insurance } = req.body;

    try {
      await Contact.new(name, email, fone, insurance);
      res.send('Tudo OK!');
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new ContactController();
