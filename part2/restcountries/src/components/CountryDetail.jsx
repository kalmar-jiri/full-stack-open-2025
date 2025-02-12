import Weather from './Weather';

export default function CountryDetail({ country, onBack }) {
  const formatNumber = number => {
    return new Intl.NumberFormat('en-US', {
      useGrouping: true,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(number)
      .replace(/,/g, ' ');
  };

  return (
    <div>
      <button onClick={onBack}>←</button>
      <h1>{country.name.common}</h1>
      <p>Official title: {country.name.official}</p>
      <p>Capital: {country.capital}</p>
      <p>Population: {formatNumber(country.population)}</p>
      <p>
        Area: {formatNumber(country.area)} km<sup>2</sup>
      </p>
      <strong>Languages:</strong>
      <ul>{country.languages && Object.keys(country.languages).map(lang => <li key={lang}>{country.languages[lang]}</li>)}</ul>
      <img src={country.flags.png} alt={country.flags.alt} />
      <Weather country={country} />
    </div>
  );
}
