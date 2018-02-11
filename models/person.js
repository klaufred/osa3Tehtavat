const mongoose = require('mongoose')

if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI 

mongoose.connect(url)
mongoose.Promise = global.Promise


const Person = mongoose.model('Person', {
  name: String,
  number: String
})

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

personSchema.statics.format = function(person) {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}


module.exports = Person
