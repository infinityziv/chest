const mongoose = require('mongoose');

const ChestSchema = new mongoose.Schema({
    level: { type: Number, required: true },
    minCoins: { type: Number, required: true },
    maxCoins: { type: Number, required: true },
});

module.exports = mongoose.model('Chest', ChestSchema);
