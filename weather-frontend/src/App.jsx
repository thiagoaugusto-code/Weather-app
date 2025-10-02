import React, { useState } from "react";
import './App.css';

function App() {
  const [city, setCity] = useState(""); // Nome da cidade digitada
  const [weather, setWeather] = useState(null); // Dados do clima
  const [loading, setLoading] = useState(false); // Loading
  const [error, setError] = useState(""); // Mensagem de erro

  const fetchWeather = async () => {
    if (!city) return setError("Digite uma cidade");

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      // Chama o backend
      const res = await fetch(`http://localhost:5000/weather?city=${encodeURIComponent(city)}`);
      if (!res.ok) throw new Error("Cidade não encontrada");

      const data = await res.json();
      console.log("Dados recebidos:", data); // Debug
      setWeather(data);

      console.log("Clima recebido do backend:", data.clima);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Define a cor do card baseada no clima
    const getCardClass = (clima) => {
      if (!clima) return "cloudy"; // fallback
      const lower = clima.toLowerCase();
      if (lower.includes("céu limpo")) return "sunny";
      if (lower.includes("nuvens")) return "cloudy";
      if (lower.includes("chuva")) return "rainy";
      return "cloudy"; // fallback seguro
    };
    

  return (
    <div className={`container ${getCardClass(weather?.clima)}-bg`}>
      <h2>Clima Tempo</h2>

      {/* Input e botão de pesquisa */}
      <div className="input-group">
        <input
          type="text"
          placeholder="Digite a cidade"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
        />
        <button onClick={fetchWeather}>🔍</button>
      </div>

      {/* Mensagens de loading e erro */}
      {loading && <p className="loading">Carregando...</p>}
      {error && <p className="error">{error}</p>}

      {/* Card do clima */}
      {weather && (
        <div className={`weather-card ${getCardClass(weather.clima)}`}>
          <h3>{weather.cidade}</h3>
            <main>
              <p>Clima: {weather.clima}</p>
              <p>Temperatura: {weather.temperatura}°C</p>
              <p>Mínima: {weather.minima}°C</p>
              <p>Máxima: {weather.maxima}°C</p>
              <p>Umidade: {weather.umidade}%</p>
              <p>Vento: {weather.vento} m/s</p>
            </main>    
        </div>
      )}
    </div>
  );
}

export default App;

// Backend code for reference