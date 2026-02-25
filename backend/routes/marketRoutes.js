const express = require('express');
const router = express.Router();
const { getMarketData, addRevenue, getManualRevenue, clearRevenue, getAIRecommendations } = require('../controllers/marketController');

router.get('/data', getMarketData);
router.get('/revenue', getManualRevenue);
router.delete('/revenue', clearRevenue);
router.post('/revenue', addRevenue);
router.post('/recommendations', getAIRecommendations);

module.exports = router;

