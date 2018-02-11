const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan(':method :url :content :status :res[content-length] - :response-time ms'))

morgan.token('content', function getContent (request) {
  return JSON.stringify(request.body)
})

const formatPerson = (person) => {
  console.log(person)
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

/*
let persons = [
    {
      id: 1,
      name: 'mina',
      number: '040-2214555',
    },
    {
      id: 2,
      name: 'sina',
      number: '040-2214666',
    },
    {
      id: 3,
      name: 'han',
      number: '040-2214777',
    },
    {
      id: 4,
      name: 'me',
      number: '040-2214888',
    },
    {
      id: 5,
      name: 'te',
      number: '040-2214999',
    },
]
*/

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(formatPerson(person))
      } else {
        response.status(404).end()
      }
    }).catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
    /*
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id )
    if ( person ) {
        response.json(person)
      } else {
        response.status(404).end()
      }
      */
  }) 

  app.delete('/api/persons/:id', (request, response) => {
    Person
      .findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => {
        response.status(400).send({ error: 'malformatted id' })
      })
    /*
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
    */
  })
  

app.get('/', (request, response) => {
  response.send('<h1>Welcome!</h1>')
  })
  
  app.get('/api/persons', (request, response) => {
    Person
      .find({})
      .then(persons => {
        response.json(persons.map(formatPerson))
      }).catch(error => {
        console.log(error)
        response.status(404).end()
      })
    // response.json(persons)
  })

  app.put('/api/persons/:id', (request, response) => {
    const body = request.body
  
    const person = new Person({
      name: body.name,
      number: body.number,
    })
  
    Person
      .findByIdAndUpdate(request.params.id, person, { new: false } )
      .then(updatedPerson => {
        response.json(formatPerson(updatedPerson))
      })
      .catch(error => {
        console.log(error)
        response.status(400).send({ error: 'malformatted id' })
      })
  })

  app.get('/info', (request, response) => {
    Person
      .find({})
      .then(persons => {
        response.send('<p>luettelossa on '+ persons.length + ' henkilön tiedot </p>'
    +
    new Date())
      }).catch(error => {
        console.log(error)
        response.status(404).end()
      })

  })
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (body.name === undefined) {
      return response.status(400).json({error: 'name missing '})
    }

    if (body.number === undefined) {
      return response.status(400).json({error: 'number missing '})
    }
/*
    if (body.name === persons.find(person => person.name === body.name )) {
      return response.status(400).json({error: 'name used '})
    }
  */
    const person = new Person({
      name: body.name,
      number: body.number
    })
  
    person
      .save()
      .then(savedPerson => {
        response.json(formatPerson(savedPerson))
      })
  })

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })