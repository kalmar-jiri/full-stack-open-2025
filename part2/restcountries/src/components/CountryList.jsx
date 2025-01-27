import { useState } from 'react';
import CountryDetail from './CountryDetail';

export default function CountryList({ countries, setCountry }) {
  const [selectedCountry, setSelectedCountry] = useState(null);

  if (selectedCountry) {
    return (
      <CountryDetail
        country={selectedCountry}
        onBack={() => {
          setSelectedCountry(null);
          setCountry('');
        }}
      />
    );
  }

  if (countries.length === 1) {
    return (
      <CountryDetail
        country={countries[0]}
        onBack={() => {
          setSelectedCountry(null);
          setCountry('');
        }}
      />
    );
  } else if (countries.length <= 10) {
    return (
      <ul>
        {countries.map(c => (
          <li key={c.name.common}>
            {c.name.common} <button onClick={() => setSelectedCountry(c)}>→</button>
          </li>
        ))}
      </ul>
    );
  }
  return null;
}
