const express = require('express');
const router = express.Router();
const { getMarketData, addRevenue } = require('../controllers/marketController');

router.get('/data', getMarketData);
router.post('/revenue', addRevenue);

module.exports = router;
