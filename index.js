const http = require('http')
const logger = require('morgan')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/Person')


const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(logger('tiny'));

let persons = [
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "sdfdfsdfs",
    number: "w3231",
    id: 6
  },
  {
    name: "qwe",
    number: "23432423",
    id: 8
  },
  {
    name: "adsadqfewf",
    number: "32424234",
    id: 10
  },
  {
    name: "asdasd",
    number: "3242",
    id: 11
  }
]

let notes = [
    {
      id: 1,
      content: "HTML is easy",
      date: "2022-01-10T17:30:31.098Z",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only Javascript",
      date: "2022-01-10T18:39:34.091Z",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2022-01-10T19:20:14.298Z",
      important: true
    }
  ]

  const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id))
      : 0
    return maxId + 1
  }
  const generatePersonId = () => {
    let newId = Math.floor(Math.random()*1111);
    const currentIds = persons.map(person => person.id);
    while (currentIds.find(usedId => usedId === newId)) {
        newId = Math.floor(Math.random() * 1001);
    }
    return newId;
}

  //MongoDB stuff
  /*const password = 'fsasdfgh'
  const url =
  `mongodb+srv://fs:${password}@cluster0.jdoqvrv.mongodb.net/phonebook?retryWrites=true&w=majority`

  mongoose.connect(url)*/

  const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
  })
  
  const Note = mongoose.model('Note', noteSchema)

  /*const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })
  const Person = mongoose.model('Person', personSchema)
  */

  app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })

  //Notes
  app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id === id)
    if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
  })

  app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end()
  })

  app.post('/api/notes', (request, response) => {
    const body = request.body

    if (body.content === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }

    const note = new Note({
      content: body.content,
      important: body.important || false,
      date: new Date(),
    })

    note.save().then(savedNote => {
      response.json(savedNote)
    })
  })

  app.get('/api/notes', (req, res) => {
    Note.find({}).then(notes => {
      response.json(notes)
  })
})

  //Puhelinmuistio
  app.get('/info', (req, res) => {
    const date = new Date()
    Person.find({})
    .then(persons => {
      res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${date}</p>`)
    })
    .catch(error => next(error))
  })
  
  app.get("/api/persons", (request, response, next) =>
    Person.find({})
      .then(persons => response.json(persons))
      .catch(error => next(error))
  );

  app.get("/api/persons/:id", (request, response, next) =>
    Person.findById(request.params.id)
      .then((person) => {
        if (person) {
          response.json(person);
        } else {
          response.status(404).end();
        }
      })
      .catch(error => next(error))
  );
  
  app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
      .then(() => response.status(204).end())
      .catch(error => next(error));
  });
  
  app.post("/api/persons", (request, response, next) => {
    const body = request.body;
    const person = Person({
      name: body.name,
      number: body.number,
    });
  
    person.save()
      .then(newPerson => response.json(newPerson))
      .catch(error => next(error));
  });
  
  app.put("/api/persons/:id", (request, response, next) => {

    const body = request.body
    const person = {
      name: body.name,
      number: body.number
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true, new: true, runValidators: true, context: 'query'  })
      .then(updatedPerson => response.json(updatedPerson))
      .catch(error => next(error))
  });
  
  const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
  }

  app.use(unknownEndpoint)
  
  // Handler for request errors
  const errorHandler = (error, req, response, next) => {
    console.log(error.message)
  
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return response.status(400).send({ error:'malformatted id' })
    }
    else if (error.name === 'ValidationError') {
      return response.status(400).send({ error: error.message })
    }
  
    next(error)
  }
  app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)})