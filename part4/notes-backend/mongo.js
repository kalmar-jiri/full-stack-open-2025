const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.TEST_MONGODB_URI;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model('Note', noteSchema);

// CREATING A NEW NOTE AND SAVING IT TO THE DATABASE
const note = new Note({
  content: 'Another one for the test database',
  important: true,
});

note.save().then(() => {
  console.log('note saved!');
  mongoose.connection.close();
});

// Note.find({}).then(result => {
//   result.forEach(note => console.log(note));
//   mongoose.connection.close();
// });
