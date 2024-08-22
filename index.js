const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(morgan('combined'))

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
    response.json(persons)
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

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons.filter(person => id !== person.id) 
  response.status(204).end
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(request.body)

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
  })
  }

  if (!body.number) {
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

  const person = {
    id: Math.floor(Math.random() * 1000000),
    name: body.name,
    number: body.number,
  }

  persons.concat(person)

  response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
