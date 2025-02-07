require('dotenv').config();
const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;
// console.log(`connecting to ${url}`);

mongoose.set('strictQuery', false);
mongoose
  .connect(url)
  .then(res => {
    console.log('connected to MongoDB');
  })
  .catch(error => console.log(`error connecting to the database: ${error.message}`));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: function (v) {
        return /(\d\d+)-(\d+)/.test(v) || /\+420\s\d{3}\s\d{3}\s\d{3}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`,
    },
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
