require('dotenv').config();
const express = require('express');
const cors = require('cors');
const tutorRoutes = require('./routes/tutorRoutes');
const estudianteRoutes = require('./routes/estudianteRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/api', tutorRoutes);
app.use('/api', estudianteRoutes);

// Healthcheck
app.get('/', (req, res) => {
  res.json({ message: 'API Plataforma Educativa funcionando' });
});

// Middleware de errores
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Backend escuchando en http://localhost:${PORT}`);
});
