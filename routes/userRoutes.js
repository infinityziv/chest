const express = require('express');
const { getUserProfile, createToken } = require('../controllers/userController'); // Добавляем функцию createToken
const router = express.Router();

router.get('/profile', getUserProfile);
router.post('/token', createToken); // Добавляем новый маршрут для создания токена

module.exports = router;
