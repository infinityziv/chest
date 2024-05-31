const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Импортируем модель пользователя

// Маршрут для улучшения таймера
router.post('/upgrade', (req, res) => {
  const userId = req.user.id; // Предполагается, что пользователь авторизован и его ID доступен в req.user.id
  const newTimerLevel = req.body.level;

  // Логика для уменьшения монет и увеличения уровня таймера
  User.findById(userId)
    .then(user => {
      const timerUpgradeCosts = [0, 2000, 8000, 16000, 32000, 128000];
      const cost = timerUpgradeCosts[newTimerLevel - 1];

      if (user.coins >= cost) {
        user.coins -= cost;
        user.timerLevel = newTimerLevel;
        user.save()
          .then(updatedUser => res.json(updatedUser))
          .catch(err => res.status(500).json({ error: 'Ошибка сохранения пользователя' }));
      } else {
        res.status(400).json({ error: 'Недостаточно монет' });
      }
    })
    .catch(err => res.status(500).json({ error: 'Ошибка поиска пользователя' }));
});

module.exports = router;
