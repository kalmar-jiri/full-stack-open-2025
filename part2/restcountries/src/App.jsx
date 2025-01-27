import { useEffect, useState } from 'react';
import axios from 'axios';
import CountryList from './components/CountryList';

function App() {
  const [country, setCountry] = useState('');
  const [allCountries, setAllCountries] = useState(null);

  const handleCountryChange = event => setCountry(event.target.value);

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all').then(response => setAllCountries(response.data));
  }, []);

  if (!allCountries) {
    return null;
  }

  const countriesToShow = allCountries.filter(c => c.name.common.toLowerCase().includes(country.toLowerCase()));

  return (
    <>
      Find countries:
      <input value={country} onChange={handleCountryChange} />
      <CountryList countries={countriesToShow} />
    </>
  );
}

export default App;
