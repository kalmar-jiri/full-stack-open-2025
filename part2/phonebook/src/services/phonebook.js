import axios from 'axios';

const baseUrl = 'http://localhost:3001/persons';

const showPhonebook = () => {
  const request = axios.get(baseUrl);
  return request.then(response => response.data);
};

const addContact = newContact => {
  const request = axios.post(baseUrl, newContact);
  return request.then(response => response.data);
};

const deleteContact = id => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then(response => console.log(response));
};

const updateContact = (id, updatedPerson) => {
  const request = axios.put(`${baseUrl}/${id}`, updatedPerson);
  return request.then(response => response.data);
};

export default { showPhonebook, addContact, deleteContact, updateContact };
