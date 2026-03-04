const Revenue = require("../models/Revenue");
const { redis } = require('../config/redis');
const { aiQueue } = require('../config/queue');

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const generateTrendData = (baseSales) => {
    const now = new Date();
    const currentMonthIndex = now.getMonth();
    return Array.from({ length: 7 }, (_, i) => {
        const monthOffset = i;
        const monthIndex = (currentMonthIndex + monthOffset) % 12;
        const month = MONTH_NAMES[monthIndex];
        const isPredictive = monthOffset > 0;
        const trendMultiplier = isPredictive ? (1 + monthOffset * 0.04) : 1;
        const volatility = isPredictive ? Math.random() * 0.15 - 0.05 : Math.random() * 0.2 - 0.1;
        const base = baseSales * (1 + volatility) * trendMultiplier;
        const sales = Math.round(base);
        const profit = Math.round(sales * (0.3 + Math.random() * 0.3));
        const loss = Math.round(sales * (0.05 + Math.random() * 0.1));
        const price = 90 + Math.floor(Math.random() * 80);
        return {
            p: month, sales, profit, loss, price,
            complaints: Math.floor(Math.random() * (price > 130 ? 30 : 10)),
            competitorCheck: Math.random() > 0.7 ? 1 : 0,
            isPredictive
        };
    });
};

const generateMyBusinessData = (persistentRevenue = []) => {
    const revenueMap = persistentRevenue.reduce((acc, rev) => {
        if (!acc[rev.month]) acc[rev.month] = { sales: 0, profit: 0, loss: 0, count: 0 };
        acc[rev.month].sales += rev.amount || 0;
        acc[rev.month].profit += rev.profit || 0;
        acc[rev.month].loss += rev.loss || 0;
        acc[rev.month].count += 1;
        return acc;
    }, {});
    const currentMonthIndex = new Date().getMonth();

    // Sort month names to ensure chronological order in the result
    return MONTH_NAMES
        .map((month, idx) => ({ month, idx }))
        .filter(({ month }) => revenueMap[month]) // ONLY include months the user actually added
        .map(({ month, idx }) => {
            const data = revenueMap[month];
            return {
                p: month, sales: data.sales, profit: data.profit, loss: data.loss,
                price: data.count > 0 ? Math.round(data.sales / data.count) : 0,
                complaints: data.count > 0 ? Math.floor(Math.random() * 5) : 0,
                isPredictive: false // Manual entries are historical, not predictive
            };
        });
};

const calculateRisk = (profitMargin, returnRate, complaints = 5) => {
    const raw = (returnRate * 0.5) + ((100 - profitMargin) * 0.3) + (complaints * 0.2);
    const score = Math.min(100, Math.max(0, Math.round(raw)));
    let level = score < 30 ? 'Low' : score < 60 ? 'Medium' : 'High';
    return { score, level };
};

const getMarketData = async (req, res) => {
    try {
        const cacheKey = 'market_data_global';
        const cached = await redis.get(cacheKey);
        if (cached) return res.json(JSON.parse(cached));

        const liveData = generateTrendData(4000);
        const productsRaw = [
            { name: 'Retail Clothing (<₹1k)', profitMargin: 20, returnRate: 5.2, complaints: 15, gst: 5 },
            { name: 'Electronics (Mobiles)', profitMargin: 12, returnRate: 2.1, complaints: 25, gst: 18 },
            { name: 'Supermarket (Grocery)', profitMargin: 8, returnRate: 0.5, complaints: 5, gst: 5 },
            { name: 'Gaming Zone', profitMargin: 65, returnRate: 0.1, complaints: 2, gst: 18 },
        ];
        const products = productsRaw.map(p => ({ ...p, risk: calculateRisk(p.profitMargin, p.returnRate, p.complaints) }));
        const result = { salesData: liveData, productData: products, timestamp: new Date() };
        await redis.setex(cacheKey, 900, JSON.stringify(result));
        res.json(result);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

const getMyBusinessData = async (req, res) => {
    try {
        const userId = req.user._id;
        const cacheKey = `my_business_${userId}`;
        let cached = null;
        try {
            cached = await redis.get(cacheKey);
        } catch (e) {
            console.error("Redis Get Error:", e.message);
        }

        if (cached) return res.json(JSON.parse(cached));

        const revenue = await Revenue.find({ userId });
        const myData = generateMyBusinessData(revenue);
        const result = { salesData: myData, timestamp: new Date() };

        try {
            await redis.setex(cacheKey, 300, JSON.stringify(result));
        } catch (e) {
            console.error("Redis Set Error:", e.message);
        }

        res.json(result);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

const addRevenue = async (req, res) => {
    try {
        const { amount, profit, loss, month, product } = req.body;
        const newRevenue = new Revenue({ userId: req.user._id, amount, profit, loss, month, product });
        await newRevenue.save();

        try {
            await redis.del(`my_business_${req.user._id}`);
        } catch (e) {
            console.error("Redis Del Error:", e.message);
        }

        res.status(201).json(newRevenue);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

const getAIRecommendations = async (req, res) => {
    try {
        const job = await aiQueue.add('recommendation', { ...req.body, userId: req.user._id, type: 'recommendation' });
        res.json({ jobId: job.id, status: 'queued' });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

const getManualRevenue = async (req, res) => {
    try {
        const revs = await Revenue.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(revs);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

const clearRevenue = async (req, res) => {
    try {
        await Revenue.deleteMany({ userId: req.user._id });

        try {
            await redis.del(`my_business_${req.user._id}`);
        } catch (e) {
            console.error("Redis Del Error:", e.message);
        }

        res.json({ message: 'Cleared' });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getMarketData, getMyBusinessData, addRevenue, getAIRecommendations, getManualRevenue, clearRevenue };
