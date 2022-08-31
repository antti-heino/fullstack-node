const http = require('http')
const express = require('express')
const app = express()

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

    if (!body.content) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const note = {
      content: body.content,
      important: body.important || false,
      date: new Date(),
      id: generateId(),
    }
  
    notes = notes.concat(note)
  
    response.json(note)
  })

  app.get('/api/notes', (req, res) => {
    res.json(notes)
  })

  //Puhelinmuistio
  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
  
    response.status(204).end()
  })

  app.post('/api/persons', (req, res) => {
    if (!req.body.name || !req.body.number) {
        return res.status(404).json({
            error: 'missing name'
        })
    }
    else if (!req.body.number) {
      return res.status(404).json({
          error: 'missing number'
      })
    }
    else if (persons.find(person => person.name.toLowerCase() === req.body.name.toLowerCase())) {
        return res.status(409).json({
            error: 'name must be unique'
        })
    }
    const newPerson = {
        name: req.body.name,
        number: req.body.number,
        id: generateId()
    }
    persons = persons.concat(newPerson);
    res.json(newPerson);
});

  //Info
  app.get('/info', (req,res) => {
      const dateTimeNow = new Date();
      res.send(`<p>Phonebook has info for ${persons.length} people</p><br><p>${dateTimeNow}</p>`)
  })



const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)})