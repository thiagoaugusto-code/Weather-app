import React, { useState } from "react";
import './App.css';

const API_KEY = "SUA_API_KEY"; // Substitua pela sua chave

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    setLoading(true);
    setError("");
    setWeather(null);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=pt_br`
      );
      if (!res.ok) throw new Error("Cidade não encontrada");
      const data = await res.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Clima Tempo</h2>
      <div className="input-group">
        <input
          type="text"
          placeholder="Digite a cidade"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchWeather} aria-label="Pesquisar">
          <span role="img" aria-label="lupa">🔍</span>
        </button>
      </div>
      {loading && <p>Carregando...</p>}
      {error && <p>{error}</p>}
      {weather && (
        <div>
          <h3>{weather.name}, {weather.sys.country}</h3>
          <p>{weather.weather[0].description}</p>
          <p>Temperatura: {weather.main.temp}°C</p>
          <p>Umidade: {weather.main.humidity}%</p>
          <p>Vento: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
}

export default App;