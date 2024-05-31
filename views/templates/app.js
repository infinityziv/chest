require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const startBot = require('./services/telegramService');

const app = express();

connectDB();
startBot();

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/chests', require('./routes/chestRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
