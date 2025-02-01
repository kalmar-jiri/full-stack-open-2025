const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit();
}

const password = process.argv[2];

const url = `mongodb+srv://gallifreden:${password}@galli.30n8x.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Galli`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model('Note', noteSchema);

// CREATING A NEW NOTE AND SAVING IT TO THE DATABASE
// const note = new Note({
//   content: 'React, Node.js and MongoDB are fun so far',
//   important: true,
// });

// note.save().then(result => {
//   console.log('note saved!');
//   mongoose.connection.close();
// });

Note.find({}).then(result => {
  result.forEach(note => console.log(note));
  mongoose.connection.close();
});
