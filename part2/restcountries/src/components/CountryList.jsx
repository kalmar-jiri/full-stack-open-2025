import CountryDetail from './CountryDetail';

export default function CountryList({ countries }) {
  if (countries.length === 1) {
    console.log(countries);
    return (
      <>
        <CountryDetail country={countries[0]} />
      </>
    );
  } else if (countries.length <= 10) {
    return (
      <ul>
        {countries.map(c => (
          <li key={c.name.common}>{c.name.common}</li>
        ))}
      </ul>
    );
  }
}
