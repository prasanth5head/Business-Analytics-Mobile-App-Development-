const express = require('express');
const router = express.Router();
const { getMarketData, getMyBusinessData, addRevenue, getManualRevenue, clearRevenue, getAIRecommendations, addRevenueBulk } = require('../controllers/marketController');
const { protect } = require('../middleware/authMiddleware');

router.get('/data', getMarketData);
router.get('/my-data', protect, getMyBusinessData);
router.get('/revenue', protect, getManualRevenue);
router.delete('/revenue', protect, clearRevenue);
router.post('/revenue', protect, addRevenue);
router.post('/revenue-bulk', protect, addRevenueBulk);
router.post('/recommendations', protect, getAIRecommendations);

module.exports = router;

