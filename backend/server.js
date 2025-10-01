import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get("/weather", async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: "city required" });
  }

  const apiKey = process.env.OPENWEATHER_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API Key não configurada" });
  }

  // Constrói a URL corretamente, encoding de cidade e país BR
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},BR&appid=${apiKey}&units=metric&lang=pt_br`;
  console.log("Chamando URL:", url);

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Se o status não for 2xx, retorna o erro da API
    if (!response.ok) {
      console.error("Erro da API:", data.message, "Status:", response.status);
      return res.status(response.status).json({ error: data.message });
    }

    console.log("JSON recebido:", data);

    res.json({
      cidade: data.name,
      clima: data.weather[0].description,
      temperatura: data.main.temp,
      minima: data.main.temp_min,
      maxima: data.main.temp_max,
    });

  } catch (err) {
    console.error("Erro interno do servidor:", err);
    res.status(500).json({ error: "Erro interno ao buscar dados do clima", detalhes: err.message });
  }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

// Para rodar: node backend/server.js
// Certifique-se de ter o arquivo .env com OPENWEATHER_KEY configurado