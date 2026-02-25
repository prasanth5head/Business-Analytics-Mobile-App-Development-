const express = require('express');
const router = express.Router();
const { getMarketData, getMyBusinessData, addRevenue, getManualRevenue, clearRevenue, getAIRecommendations } = require('../controllers/marketController');

router.get('/data', getMarketData);
router.get('/my-data', getMyBusinessData);
router.get('/revenue', getManualRevenue);
router.delete('/revenue', clearRevenue);
router.post('/revenue', addRevenue);
router.post('/recommendations', getAIRecommendations);

module.exports = router;

