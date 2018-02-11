const mongoose = require('mongoose')

const url = 'mongodb://kayttaja:salainen@ds129428.mlab.com:29428/puhluettelo'

mongoose.connect(url)


var args = process.argv.slice(2);



const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })
  
  const Person = mongoose.model('Person', personSchema);

  const person = new Person({
    name: args[0],
    number: args[1]
  })

if (args[0] !== undefined && args[1] !== undefined) {
  person
    .save()
    .then(response => {
      console.log('person saved!')
      mongoose.connection.close()
    })
} else {
  Person
  .find({})
  .then(result => {
    console.log('puhelinluettelo:')
    result.forEach(person => {
      console.log(person.name + " " +  person.number)
    })
    mongoose.connection.close()
  })
}


  
