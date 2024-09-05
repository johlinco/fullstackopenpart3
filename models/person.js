const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to:', url)

mongoose.connect(url)
  .then(console.log('connected to MongoDB'))
  .catch(error => {
    console.log('error connecting to MongoDBL', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function(input) {
        return /\d{2}-\d/.test(input) || /\d{3}-\d/.test(input)
      },
      message: props => `${props.value} is not a valid phone number. Use format 00-00000 or 000-00000`
    },
    required: [true, 'Must provide phone number for phone book entry']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)

