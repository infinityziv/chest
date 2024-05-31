const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  chestLevel: { type: Number, default: 1 },
  timerLevel: { type: Number, default: 1 }, // Оставляем только одно объявление поля timerLevel
  coins: { type: Number, default: 0 },
  lastOpened: { type: Date, default: null },
  nextChestOpenTime: { type: Date, default: null },
  token: { type: String } // Добавляем поле для хранения токена
});

module.exports = mongoose.model('User', UserSchema);
