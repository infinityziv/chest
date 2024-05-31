require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const startBot = require('./services/telegramService');

const app = express();

// Middleware для обработки JSON
app.use(express.json());

// Подключение к базе данных
connectDB();

// Запуск Telegram бота
startBot();

// Подключение маршрутов
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/chests', require('./routes/chestRoutes'));
app.use('/api/timer', require('./routes/timerRoutes'));

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
