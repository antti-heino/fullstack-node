const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fs:${password}@cluster0.jdoqvrv.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

console.log(process.argv)
if (process.argv.length < 4) {
  Person.find({}).then(result => {
    result.forEach(person => console.log(person.name, person.number))
    mongoose.connection.close()
  })
}
else
{
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })
  person.save().then(() => {
    console.log(`Added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })

}

console.log('exit')




