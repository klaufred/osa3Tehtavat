const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan(':method :url :content :status :res[content-length] - :response-time ms'))

morgan.token('content', function getContent (request) {
  return JSON.stringify(request.body)
})
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

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id )
    if ( person ) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  }) 

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })
  

app.get('/', (request, response) => {
  response.send('<h1>Welcome!</h1>')
  })
  
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  app.get('/info', (request, response) => {
    response.send('<p>luettelossa on '+ persons.length + ' henkilön tiedot </p>'
    +
    new Date())
  })

  const generateId = () => {
    return Math.floor(Math.random() * (200 - persons.length) + persons.length)
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (body.name === undefined) {
      return response.status(400).json({error: 'name missing '})
    }

    if (body.number === undefined) {
      return response.status(400).json({error: 'number missing '})
    }

    if (body.name === persons.find(person => person.name === body.name )) {
      return response.status(400).json({error: 'name used '})
    }
  
    const person = {
      name: body.name,
      number: body.number,
      content: body.content,
      id: generateId()
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })