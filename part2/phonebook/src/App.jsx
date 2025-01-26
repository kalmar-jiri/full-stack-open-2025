import axios from 'axios';
import { useState, useEffect } from 'react';

const Filter = ({ searchName, handleSearchChange }) => {
  return (
    <div>
      🔎
      <input value={searchName} onChange={handleSearchChange} />
    </div>
  );
};

const PersonForm = ({ addPerson, newName, handleNameChange, newNumber, handleNumberChange }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ filteredPersons }) => {
  return filteredPersons.map(person => (
    <p key={person.name}>
      {person.name} {person.number}
    </p>
  ));
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/persons').then(response => {
      setPersons(response.data);
    });
  }, []);

  const handleNameChange = event => setNewName(event.target.value);
  const handleNumberChange = event => setNewNumber(event.target.value);
  const handleSearchChange = event => setSearchName(event.target.value);

  const addPerson = event => {
    event.preventDefault();

    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`);
      setNewName('');
      setNewNumber('');
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      };
      setPersons(persons.concat(newPerson));
      setNewName('');
      setNewNumber('');
    }
  };

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(searchName.toLowerCase()));

  return (
    <div>
      <h1>PHONEBOOK ☎️</h1>
      <Filter searchName={searchName} handleSearchChange={handleSearchChange} />
      <h2>Add a new 📝</h2>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} />
    </div>
  );
};

export default App;
