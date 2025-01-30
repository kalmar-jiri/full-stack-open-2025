export default function Persons({ filteredPersons, deletePerson }) {
  return filteredPersons.map(person => (
    <p key={person.name}>
      {person.name} {person.number} <button onClick={() => deletePerson(person.id)}>❌</button>
    </p>
  ));
}
