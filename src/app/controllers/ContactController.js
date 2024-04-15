const bodyParser = require("body-parser")
const ContactsRepository = require("../repositories/ContactsRepository")

class ContactController {
  async index(request,response) {
    const {orderBy} = request.query
    const contacts = await ContactsRepository.findAll(orderBy)

    response.json(contacts)
  }

  async show(request, response) {
   const {id} = request.params

    const contacts = await ContactsRepository.findById(id)

    if(!contacts) {
      return response.status(404),json({error: "User Not Found"})
    }

    response.json(contacts)
  }

 async store(request, response) {
    const {name, email, phone, category_id} = request.body

    const contactExists = await ContactsRepository.findByEmail(email)

    if(!name) {
      return  response.status(400).json({error: "Name is required"})
    }
    if(contactExists) {
      return  response.status(400).json({error: "This e-mail is already in user"})
    }

    const contact = await ContactsRepository.create({
      name,
      email,
      phone,
      category_id
    })

    response.json(contact)
  }

  async update(request, response) {
    const {id} = request.params
    const {name, email, phone, category_id} = request.body

    const contactExists = await ContactsRepository.findById(id)
    const contactEmailExists = await ContactsRepository.findByEmail(email)

    if(!contactExists) {
      return response.status(404).json({error: "User not found"})
    }

    if(!name) {
      return  response.status(400).json({error: "Name is required"})
    }

    if(contactEmailExists && contactEmailExists.id !== id) {
      return  response.status(400).json({error: "This e-mail is already in user"})
    }

    const contact = await ContactsRepository.update(id, {
      name, email, phone, category_id
    })

    response.json(contact)
  }

  async delete(request, response) {
    const {id} = request.params

    await ContactsRepository.delete(id)
    response.sendStatus(204)

  }
}

module.exports = new ContactController();
