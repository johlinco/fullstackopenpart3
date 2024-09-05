const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as arguments')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://johlinco:${password}@fullstackopen.ntw6g.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=fullstackopen`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length > 3) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(mongoose.connection.close())
} else {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}

