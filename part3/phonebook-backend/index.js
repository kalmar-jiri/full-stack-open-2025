const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');

let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.use(express.json());
app.use(cors());
app.use(express.static('dist'));
// app.use(morgan('tiny'));

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

app.get('/', (request, response) => {
  response.send(/*html*/ `
    <h1>Phonebook Server</h1>
    <p>for the list of available data please visit <a href="http://localhost:3001/api/persons">this link</a></p>
    <p>For the information about phonebook go <a href="http://localhost:3001/info">here</a></p>`);
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/info', (request, response) => {
  response.send(/*html*/ `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
        <a href="http://localhost:3001/">back</a>
        `);
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find(p => p.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  persons = persons.filter(p => p.id !== id);
  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Name or Number is missing.',
    });
  } else if (persons.some(p => p.name === body.name)) {
    return response.status(400).json({
      error: `${body.name} is already in the phonebook`,
    });
  }
  const newPerson = {
    id: Math.floor(Math.random() * 1000),
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(newPerson);
  response.json(newPerson);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
