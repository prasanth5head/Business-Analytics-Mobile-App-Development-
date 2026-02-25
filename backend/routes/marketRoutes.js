const express = require('express');
const router = express.Router();
const { getMarketData, addRevenue, getManualRevenue, getAIRecommendations } = require('../controllers/marketController');

router.get('/data', getMarketData);
router.get('/revenue', getManualRevenue);
router.post('/revenue', addRevenue);
router.post('/recommendations', getAIRecommendations);

module.exports = router;

