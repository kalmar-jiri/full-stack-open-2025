import { useState, useEffect } from 'react';
import phoneService from './services/phonebook';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchName, setSearchName] = useState('');
  const [notification, setNotification] = useState(null);
  const [notificationColor, setNotificationColor] = useState('green');

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

        phoneService
          .updateContact(person.id, updatedPerson)
          .then(returnedContact => {
            setPersons(persons.map(p => (p.id === person.id ? returnedContact : p)));
            setNotification(`Updated number for ${person.name}`);
            setTimeout(() => setNotification(null), 5000);
          })
          .catch(error => {
            setNotificationColor('red');
            setNotification(`Information about ${person.name} has already been removed from server`);
            setPersons(persons.filter(p => p.id !== person.id));
            setTimeout(() => {
              setNotification(null);
              setNotificationColor('green');
            }, 5000);
          });
      }
      setNewName('');
      setNewNumber('');
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
      };
      phoneService
        .addContact(newPerson)
        .then(returnedContact => {
          setPersons(persons.concat(returnedContact));
          setNewName('');
          setNewNumber('');
          setNotification(`Added ${newPerson.name}`);
          setTimeout(() => setNotification(null), 5000);
        })
        .catch(error => {
          setNotificationColor('red');
          setNotification(error.response.data.error);
          setTimeout(() => {
            setNotification(null);
            setNotificationColor('green');
          }, 5000);
        });
    }
  };

  const deletePerson = id => {
    const personToDelete = persons.find(person => person.id === id);

    if (window.confirm(`Delete ${personToDelete.name}?`)) {
      phoneService.deleteContact(id).then(() => {
        setPersons(persons.filter(person => person.id !== id));
        setNotificationColor('red');
        setNotification(`Removed ${personToDelete.name}`);
        setTimeout(() => {
          setNotification(null);
          setNotificationColor('green');
        }, 5000);
      });
    }
  };

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(searchName.toLowerCase()));

  return (
    <div>
      <h1>PHONEBOOK ☎️</h1>
      <Notification message={notification} color={notificationColor} />
      <Filter searchName={searchName} handleSearchChange={handleSearchChange} />
      <h2>Add a new 📝</h2>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} deletePerson={deletePerson} />
    </div>
  );
};

export default App;
