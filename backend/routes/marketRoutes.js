const express = require('express');
const router = express.Router();
const { getMarketData, getMyBusinessData, addRevenue, getManualRevenue, clearRevenue, getAIRecommendations } = require('../controllers/marketController');
const { protect } = require('../middleware/authMiddleware');

router.get('/data', getMarketData);
router.get('/my-data', protect, getMyBusinessData);
router.get('/revenue', protect, getManualRevenue);
router.delete('/revenue', protect, clearRevenue);
router.post('/revenue', protect, addRevenue);
router.post('/recommendations', protect, getAIRecommendations);

module.exports = router;

