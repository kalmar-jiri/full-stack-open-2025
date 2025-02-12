const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
const Person = require('./models/person');

app.use(express.json());
app.use(cors());
app.use(express.static('dist'));
// app.use(morgan('tiny'));

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
  console.log(error.message);
  if (error.name === 'CastError') {
    return res.status(404).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

morgan.token('postContent', req => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
});

app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
      tokens.postContent(req, res),
    ].join(' ');
  })
);

app.get('/', (req, res) => {
  res.send(/*html*/ `
    <h1>Phonebook Server</h1>
    <p>for the list of available data please visit <a href="/api/persons">this link</a></p>
    <p>For the information about phonebook go <a href="/info">here</a></p>`);
});

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => res.json(persons));
});

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    res.send(/*html*/ `
      <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
        <a href="/">back</a>
      `);
  });
});

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(returnedPerson => res.json(returnedPerson));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      console.log(`${result.name} was deleted.`);
      res.status(204).end();
    })
    .catch(error => next(error));
});

app.post('/api/persons', (req, res, next) => {
  const body = req.body;
  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({ error: 'name or number are missing' });
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });

  newPerson
    .save()
    .then(returnedPerson => res.json(returnedPerson))
    .catch(error => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body;

  Person.findByIdAndUpdate(req.params.id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => res.json(updatedPerson))
    .catch(error => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
