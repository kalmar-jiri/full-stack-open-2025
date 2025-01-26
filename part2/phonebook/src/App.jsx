import { useState, useEffect } from 'react';
import phoneService from './services/phonebook';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    phoneService.showPhonebook().then(initialContacts => setPersons(initialContacts));
  }, []);

  const handleNameChange = event => setNewName(event.target.value);
  const handleNumberChange = event => setNewNumber(event.target.value);
  const handleSearchChange = event => setSearchName(event.target.value);

  const addPerson = event => {
    event.preventDefault();

    if (persons.some(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook. Replace the old number with the new one?`)) {
        const person = persons.find(p => p.name === newName);
        const updatedPerson = { ...person, number: newNumber };

        phoneService.updateContact(person.id, updatedPerson).then(returnedContact => {
          setPersons(persons.map(p => (p.id === person.id ? returnedContact : p)));
        });
      }
      setNewName('');
      setNewNumber('');
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      };
      phoneService.addContact(newPerson).then(returnedContact => {
        setPersons(persons.concat(returnedContact));
        setNewName('');
        setNewNumber('');
      });
    }
  };

  const deletePerson = id => {
    const personToDelete = persons.find(person => person.id === id);

    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      phoneService.deleteContact(id).then(() => {
        setPersons(persons.filter(person => person.id !== id));
      });
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
      <Persons filteredPersons={filteredPersons} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
