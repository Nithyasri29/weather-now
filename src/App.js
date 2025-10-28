import React, { useState } from "react";
import './App.css';

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    setError("");
    setWeather(null);

    
    const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;
    try {
      const geoRes = await fetch(geoURL);
      if (!geoRes.ok) throw new Error("Geocoding API error");
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found. Try another city.");
        return;
      }

      const { latitude, longitude } = geoData.results[0];

      
      const weatherURL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
      const weatherRes = await fetch(weatherURL);
      if (!weatherRes.ok) throw new Error("Weather API error");
      const weatherData = await weatherRes.json();
      setWeather({
        ...weatherData.current_weather,
        time: weatherData.current_weather.time  
      });

      setWeather(weatherData.current_weather);
    } catch (err) {
      setError("Could not fetch weather. Try again.");
    }
  };

  return (
    <div className="app-container">
      <h2>Weather Now</h2>
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={e => setCity(e.target.value)}
      />
      <button onClick={fetchWeather}>Get Weather</button>
      {error && <div className="error">{error}</div>}
      {weather && (
        <div className="weather-info">
          <div>Temperature: {weather.temperature}°C</div>
          <div>Wind Speed: {weather.windspeed} km/h</div>
          {weather.time && (
        <div>
        Last Update: {new Date(weather.time + 'Z').toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
        </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;