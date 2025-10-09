// Importações
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // Lê variáveis do .env

const app = express();
const PORT = process.env.PORT || 5000;

// Permitir que o frontend acesse o backend
app.use(cors());

// Rota para buscar dados do clima
app.get("/weather", async (req, res) => {
  const {city, lat, lon} = req.query;

  const apiKey = process.env.OPENWEATHER_KEY;
  let url = ""; // URL da API do OpenWeather

  if (lat && lon) {
    //busca pelo GPS
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${apiKey}`;
  } else if (city) {
    // busca pela cidade
    url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&lang=pt_br&appid=${apiKey}`;
  } else {
    // Nenhum parâmetro fornecido
    return res.status(400).json({ error: "Informe cidade ou cordenandas" });
  }


  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      return res.status(data.cod).json({ error: data.message });
    }

    // Retorna apenas os dados necessários para o frontend
    res.json({
      cidade: data.name,
      clima: data.weather[0].description,
      temperatura: data.main.temp,
      minima: data.main.temp_min,
      maxima: data.main.temp_max,
      vento: data.wind.speed,
      umidade: data.main.humidity
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar dados do clima" });
  }
});

// Inicia servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));



// Para rodar: node backend/server.js
// Certifique-se de ter o arquivo .env com OPENWEATHER_KEY configurado