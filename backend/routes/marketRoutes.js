const express = require('express');
const router = express.Router();
const { getMarketData, getAiRecommendations, addRevenue } = require('../controllers/marketController');

router.get('/data', getMarketData);
router.post('/recommendations', getAiRecommendations);
router.post('/revenue', addRevenue);

module.exports = router;
