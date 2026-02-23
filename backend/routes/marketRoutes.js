const express = require('express');
const router = express.Router();
const { getMarketData, addRevenue, getAIRecommendations } = require('../controllers/marketController');

router.get('/data', getMarketData);
router.post('/revenue', addRevenue);
router.post('/recommendations', getAIRecommendations);

module.exports = router;

