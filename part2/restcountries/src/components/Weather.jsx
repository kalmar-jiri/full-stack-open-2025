import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Weather({ country }) {
  const api_key = import.meta.env.VITE_API_KEY;
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${api_key}`).then(response => setWeather(response.data));
  }, [country, api_key]);

  if (!weather) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Weather in {country.capital}</h2>
      <p>Temperature: {Math.round(weather.main.temp - 273.15)} °C</p>
      {weather.weather.map(icon => (
        <img key={icon.icon} src={`https://openweathermap.org/img/wn/${icon.icon}@2x.png`} alt="current weather icon"></img>
      ))}
      <p>Wind speed: {weather.wind.speed} m/s</p>
    </div>
  );
}
