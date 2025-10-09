import React, { useState, useEffect } from "react";
import './App.css';

function App() {
  const [city, setCity] = useState(""); // Nome da cidade digitada
  const [weather, setWeather] = useState(null); // Dados do clima
  const [loading, setLoading] = useState(false); // Loading
  const [error, setError] = useState(""); // Mensagem de erro

  // useEffect: busca automática com base na localização do usuário
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        setLoading(true); // mostra "Carregando..." enquanto busca
        try {
          const res = await fetch(`http://localhost:5000/weather?lat=${latitude}&lon=${longitude}`);
          if (!res.ok) throw new Error("Não foi possível obter o clima da sua localização.");

          const data = await res.json();
          setWeather(data);
          setCity(data.cidade);
        } catch (err) {
          console.error("Erro ao buscar clima pela localização:", err);
          setError("Não foi possível obter sua localização.");
        } finally {
          setLoading(false);
        }
      });
    } else {
      setError("Seu navegador não suporta geolocalização.");
    }
  }, []); // roda apenas uma vez ao carregar o app

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
      if (!clima) return ""; // fallback
      const lower = clima.toLowerCase();
      if (lower.includes("limpo") || lower.includes("sol")) return "sunny";
      if (lower.includes("nublado") || lower.includes("nuvens")) return "cloudy";
      if (lower.includes("chuva") || lower.includes("tempestade")) return "rainy";
      return "";
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