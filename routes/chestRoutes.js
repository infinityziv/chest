// routes/chestRoutes.js
const express = require('express');
const router = express.Router();
const { openChest, upgradeChest } = require('../controllers/chestController');

router.post('/open', openChest);
router.post('/upgrade', upgradeChest);

module.exports = router;
