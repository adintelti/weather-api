const express = require("express");
const axios = require("axios");
const redis = require("redis");
const Bottleneck = require("bottleneck");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

console.log('conexão do redis');
// Configuração do Redis
const redisClient = redis.createClient();
redisClient.connect().catch(console.error);

// Configuração do Bottleneck
const limiter = new Bottleneck({
  maxConcurrent: 5, // Limita a 5 threads simultâneas
  minTime: 2000, // Delay mínimo entre requisições (2000ms)
});

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Weather API",
      version: "1.0.0",
      description: "API para buscar condições climáticas atuais",
    },
  },
  apis: ["./index.js"], // Caminho para os endpoints documentados
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /weather/{location}:
 *   get:
 *     summary: Retorna as condições climáticas atuais de uma localidade
 *     parameters:
 *       - in: path
 *         name: location
 *         required: true
 *         description: Nome da localidade (cidade ou lugar)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dados climáticos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 location:
 *                   type: string
 *                 temperature:
 *                   type: number
 *                 condition:
 *                   type: string
 *       500:
 *         description: Erro no servidor
 */
app.get("/weather/:location", limiter.wrap(async (req, res) => {
    console.log(req.params);
  const { location } = req.params;

  try {
    // Verifica o cache no Redis
    const cachedData = await redisClient.get(location);
    if (cachedData) {
      console.log('found cache data');
      return res.json(JSON.parse(cachedData));
    }
    console.log('cache data not found');

    // Faz a chamada à API de terceiros (exemplo: OpenWeatherMap)
    const API_KEY = process.env.WEATHER_API_KEY; // Chave da API
    console.log(API_KEY);
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
      params: {
        q: location,
        appid: API_KEY,
        units: "metric",
        lang: "pt_br",
      },
    });

    const weatherData = {
      location: response.data.name,
      temperature: response.data.main.temp,
      condition: response.data.weather[0].description,
    };

    // Armazena no cache do Redis por 10 minutos (600 segundos)
    await redisClient.set(location, JSON.stringify(weatherData), {
      EX: 5, // Tempo de expiração em segundos
    });

    res.json(weatherData);
  } catch (error) {
    res.status(500).json({
      error: "Não foi possível obter as condições climáticas.",
      details: error.message,
    });
  }
}));

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Documentação disponível em http://localhost:${PORT}/api-docs`);
});
