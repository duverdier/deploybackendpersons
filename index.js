const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(express.static('build'))
app.use(cors())
app.use(morgan('tiny'))
  
let persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: "040-123456"
      },
      {
        id: 2,
        name: 'Ada Lovelace',
        number: "39-44-5323523"
      },
      {
        id: 3,
        name: 'Dan Abramov',
        number: "12-43-234345"
      },
      {
        id: 4,
        name: 'Mary Poppendieck',
        number: "39-23-6423122"
      }
  ]
  app.use(morgan(`:method :url :status :res[content-length] - :response-time ms  {"name": ${persons[0].name}, "number": ${persons[0].number}}`))
 
  const generateId = () => {
    const maxId = persons.length > 0
    ? Math.max(...persons.map(p => p.id))
    : 0
    return maxId + 1
}

app.get('/info', (request, response) =>{
    response.send(
        '<p>Phonebook has info for ' + generateId() + ' people</p><p>'+ Date() +'</p>')
})

app.get('/api/persons', (request, response) =>{
    response.json(persons)
})
app.post('/api/persons', (request, response) =>{
    const personne = request.body
    const name = persons.find(person => person.name === personne.name)
    if ((!personne.name && !personne.number) || (name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: Math.round(Math.random(generateId) + 5),
        name: personne.name,
        number: personne.number
    }
    const poster = (request, response) => {
        response.status(200 || 201).send({ name: personne.name,  number: personne.number})
    }
    app.use(morgan(`:method :url :status :res[content-length] - :response-time ms  {"name": ${person.name}, "number": ${person.number}}`))
    //persons = persons.concat(person)
    response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) =>{
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})
  
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})