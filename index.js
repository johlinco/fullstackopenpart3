require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const mongoose = require('mongoose')
const app = express()


const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)

app.use(cors())
app.use(express.static('dist'))


morgan.token('body', req => {
  return JSON.stringify(req.body)
})

app.use(express.json())
app.use(morgan(':method :url :body'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
})

app.get('/api/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people.</p><p>${new Date()}</p>`
  )
}) 

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error = next(error))
})

app.post('/api/persons', (request, response) => {
  console.log(request.body)
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({
      error: 'name missing'
  })
  }

  if (body.number === undefined) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  for (const personEntry of persons) {
    if (personEntry.name === body.name) {
      return response.status(400).json({
        error: 'name already in phonebook'
      })
    }
  }

  const person = new Person ({
    name: body.name,
    number: body.number,
  })
  console.log(person)
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
