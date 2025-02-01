const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('include password as a parameter');
  process.close();
}

const args = process.argv;
const password = args[2];

mongoose.set('strictQuery', false);
mongoose.connect(`mongodb+srv://gallifreden:${password}@galli.30n8x.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Galli`);

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', contactSchema);

if (args[3] && args[4]) {
  const person = new Person({
    name: args[3],
    number: args[4],
  });
  person.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log('phonebook:');
  Person.find({}).then(persons => {
    persons.forEach(p => console.log(`${p.name} ${p.number}`));
    mongoose.connection.close();
  });
}
