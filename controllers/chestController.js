const User = require('../models/User');

// Функция для открытия сундука
exports.openChest = async (req, res) => {
  try {
    // Получаем токен пользователя из заголовка запроса
    const userToken = req.headers.authorization;
    
    // Находим пользователя по токену в базе данных
    const user = await User.findOne({ token: userToken });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Логика для открытия сундука
    if (user.nextChestOpenTime && new Date() < new Date(user.nextChestOpenTime)) {
      return res.status(400).json({ msg: 'Chest is not available yet' });
    }

    const minCoins = 1000 * (user.chestLevel - 1) || 100;
    const maxCoins = 1000 * user.chestLevel;
    const randomCoins = Math.floor(Math.random() * (maxCoins - minCoins + 1)) + minCoins;
    
    user.coins += randomCoins;
    user.lastOpened = new Date();
    user.nextChestOpenTime = new Date(Date.now() + 3600000); // 1 час с текущего момента
    await user.save();
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Функция для создания токена пользователя
exports.createToken = async (req, res) => {
  try {
    // Получаем данные о пользователе из запроса
    const { telegramId } = req.body;

    // Проверяем, существует ли пользователь с таким telegramId в базе данных
    let user = await User.findOne({ telegramId });

    // Если пользователь не найден, создаем нового пользователя и генерируем токен для него
    if (!user) {
      // Здесь можно создать логику для генерации уникального токена
      // Например, используя библиотеку uuid или генерацию случайной строки
      const userToken = generateToken(); // Функция для создания уникального токена
      // Создаем нового пользователя с telegramId и сохраняем токен
      user = new User({ telegramId, token: userToken });
      await user.save();
      // Отправляем токен клиенту для сохранения
      res.json({ token: userToken });
    } else {
      // Если пользователь уже существует, отправляем существующий токен
      res.json({ token: user.token });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
