const User = require('../models/User');

exports.createInitialToken = async (req, res) => {
  try {
    // Здесь генерируйте токен пользователя и сохраняйте его в базе данных
    const newUser = new User({ telegramId: req.body.telegramId }); // Пример создания нового пользователя с Telegram ID из запроса
    const savedUser = await newUser.save(); // Сохранение пользователя в базе данных

    res.status(200).json({ message: 'Initial token created successfully', user: savedUser });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};
