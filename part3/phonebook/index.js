const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

morgan.token('body', function (req) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const generateId = () => {
    const minId = 5
    const maxId = 100000
    return String(Math.floor(Math.random() * (maxId - minId + 1)) + minId)
}

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "phoneNumber": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "phoneNumber": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "phoneNumber": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "phoneNumber": "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
    const now = new Date()
    response.send(`Phonebook has info for ${persons.length} people.<br><br>${now}`)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.statusMessage = "Entry not found for this id."
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.phoneNumber) {
        return response.status(400).json({
            error: 'Name or phone number is missing.'
        })
    }

    if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'Name must be unique.'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        phoneNumber: body.phoneNumber
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})