const Revenue = require("../models/Revenue");
const { redis } = require('../config/redis');
const { aiQueue } = require('../config/queue');

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const generateStrategicPriorities = () => {
    const priorities = [];
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 17; // 18 years

    const themes = [
        "AI Strategy", "Fiscal Optimization", "Market Penetration", "Digital Transformation",
        "Cost Reduction", "Revenue Diversification", "Customer Retention", "Supply Chain Resilience",
        "Brand Equity", "Product Innovation", "Operational Excellence", "Sustainable Growth"
    ];

    for (let i = 0; i < 200; i++) {
        const year = startYear + Math.floor(i / (200 / 18));
        const theme = themes[i % themes.length];
        priorities.push({
            id: i + 1,
            year: year,
            title: `${theme} Initiative #${(i % 10) + 1}`,
            recommendation: `Strategic focus for ${year}: Implementing ${theme.toLowerCase()} to enhance overall business stability and profitability.`,
            type: ['Critical', 'Growth', 'Operational'][i % 3],
            confidence: 85 + (i % 15)
        });
    }
    return priorities;
};

const STRATEGIC_PRIORITIES = generateStrategicPriorities();

const calculateRisk = (price, gst, profit, loss) => {
    const revenue = profit + loss || 1; // avoid div by zero
    const profitMargin = (profit / revenue) * 100;
    const lossRatio = (loss / revenue) * 100;

    // Custom Real Risk Formula: (100 - ProfitMargin) * 0.4 + (LossRatio * 0.4) + (GST * 1.5)
    const raw = ((100 - profitMargin) * 0.4) + (lossRatio * 0.4) + (gst * 1.5);
    const score = Math.min(100, Math.max(0, Math.round(raw)));
    let level = score < 35 ? 'Safe' : score < 65 ? 'Moderate' : 'High Risk';

    return {
        score,
        level,
        calculation: `((100 - ${profitMargin.toFixed(1)}%) × 0.4) + (${lossRatio.toFixed(1)}% × 0.4) + (${gst}% × 1.5)`
    };
};

const generateTrendData = (baseSales, count = 200) => {
    const now = new Date();
    const currentMonthIndex = now.getMonth();
    const currentYear = now.getFullYear();

    return Array.from({ length: count }, (_, i) => {
        const date = new Date(currentYear, currentMonthIndex - i, 1);
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        const month = MONTH_NAMES[monthIndex];

        const sales = Math.round(baseSales * (0.9 + Math.random() * 0.2));
        const profit = Math.round(sales * (0.2 + Math.random() * 0.4));
        const loss = sales - profit;
        const price = 500 + Math.floor(Math.random() * 5000);
        const gst = [5, 12, 18, 28][Math.floor(Math.random() * 4)];

        return {
            p: month,
            monthIndex,
            year,
            sales,
            profit,
            loss,
            price,
            gst,
            complaints: Math.floor(Math.random() * 10),
            isPredictive: false
        };
    }).reverse();
};

const generateMyBusinessData = (persistentRevenue = []) => {
    const revenueMap = persistentRevenue.reduce((acc, rev) => {
        const key = `${rev.month}-${rev.year || new Date().getFullYear()}`;
        if (!acc[key]) acc[key] = { sales: 0, profit: 0, loss: 0, count: 0, month: rev.month, year: rev.year };
        acc[key].sales += rev.amount || 0;
        acc[key].profit += rev.profit || 0;
        acc[key].loss += rev.loss || 0;
        acc[key].count += 1;
        return acc;
    }, {});

    return Object.values(revenueMap).map(data => ({
        p: data.month,
        year: data.year,
        sales: data.sales,
        profit: data.profit,
        loss: data.loss,
        price: data.count > 0 ? Math.round(data.sales / data.count) : 0,
        isPredictive: false
    }));
};

const getMarketData = async (req, res) => {
    try {
        const cacheKey = 'market_data_global_v2';
        const cached = await redis.get(cacheKey);
        if (cached) return res.json(JSON.parse(cached));

        const liveData = generateTrendData(50000);
        const productsRaw = [
            { name: 'Retail Clothing (<₹1k)', price: 800, gst: 5, profit: 200, loss: 50 },
            { name: 'Electronics (Mobiles)', price: 15000, gst: 18, profit: 2000, loss: 500 },
            { name: 'Supermarket (Grocery)', price: 2000, gst: 5, profit: 300, loss: 100 },
            { name: 'Gaming Zone', price: 500, gst: 18, profit: 350, loss: 50 },
            { name: 'Luxury Watches', price: 45000, gst: 28, profit: 15000, loss: 2000 },
        ];

        const productData = productsRaw.map(p => ({
            ...p,
            profitMargin: Math.round((p.profit / p.price) * 100),
            risk: calculateRisk(p.price, p.gst, p.profit, p.loss)
        }));

        const totalSales = liveData.reduce((sum, d) => sum + d.sales, 0);
        const totalProfit = liveData.reduce((sum, d) => sum + d.profit, 0);
        const totalLoss = liveData.reduce((sum, d) => sum + d.loss, 0);

        const summary = {
            totalSales, totalProfit, totalLoss,
            avgProfit: Math.round(totalProfit / liveData.length),
            growthRate: "+15.2% ▲",
            activeUsers: 4500,
            customerGrowth: "+6.8% ▲",
            profitGrowth: "+10.1% ▲"
        };

        const result = {
            salesData: liveData,
            productData,
            summary,
            strategicPriorities: STRATEGIC_PRIORITIES,
            timestamp: new Date()
        };
        await redis.setex(cacheKey, 900, JSON.stringify(result));
        res.json(result);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

const getMyBusinessData = async (req, res) => {
    try {
        const userId = req.user._id;
        const cacheKey = `my_business_v2_${userId}`;
        let cached = await redis.get(cacheKey).catch(() => null);
        if (cached) return res.json(JSON.parse(cached));

        const revenue = await Revenue.find({ userId, isDeleted: { $ne: true } });
        const myData = generateMyBusinessData(revenue);

        const totalSales = revenue.reduce((sum, r) => sum + (r.amount || 0), 0);
        const totalProfit = revenue.reduce((sum, r) => sum + (r.profit || 0), 0);
        const totalLoss = revenue.reduce((sum, r) => sum + (r.loss || 0), 0);

        const summary = {
            totalSales, totalProfit, totalLoss,
            avgProfit: myData.length > 0 ? Math.round(totalProfit / myData.length) : 0,
            growthRate: "8.5% ▲",
            activeUsers: Math.floor(totalSales / 1000),
            customerGrowth: "4.1% ▲",
            profitGrowth: "6.7% ▲"
        };

        const usedProducts = [...new Set(revenue.map(r => r.product || 'All'))];
        const productData = usedProducts.map(name => {
            const prodRevenue = revenue.filter(r => (r.product || 'All') === name);
            const sales = prodRevenue.reduce((sum, r) => sum + (r.amount || 0), 0);
            const profit = prodRevenue.reduce((sum, r) => sum + (r.profit || 0), 0);
            const loss = sales - profit;
            const price = prodRevenue.length > 0 ? Math.round(sales / prodRevenue.length) : 0;
            const gst = name.includes('Electronics') ? 18 : 5;

            return {
                name, price, gst, profit, loss,
                profitMargin: sales > 0 ? Math.round((profit / sales) * 100) : 0,
                risk: calculateRisk(price, gst, profit, loss)
            };
        });

        if (productData.length === 0) {
            productData.push({
                name: 'Sample Product', price: 1000, gst: 12, profit: 300, loss: 100,
                profitMargin: 30, risk: calculateRisk(1000, 12, 300, 100)
            });
        }

        const totalRecords = await Revenue.countDocuments({ userId, isDeleted: { $ne: true } });
        const result = {
            salesData: myData,
            productData,
            summary,
            totalRecords,
            strategicPriorities: STRATEGIC_PRIORITIES, // Also return for personal business
            timestamp: new Date()
        };
        await redis.setex(cacheKey, 300, JSON.stringify(result));
        res.json(result);
    } catch (err) { res.status(500).json({ message: err.message }); }
};

const addRevenue = async (req, res) => {
    try {
        let { amount, profit, month, product, year } = req.body;
        console.log(`[DATA INSERTION] Attempting to save single revenue record for user ${req.user._id}: ${month}/${year}, Product: ${product}, Amt: ${amount}`);

        const loss = amount - profit;
        const newRevenue = new Revenue({
            userId: req.user._id,
            amount, profit, loss, month, product,
            year: year || new Date().getFullYear()
        });
        await newRevenue.save();

        console.log(`[DATA INSERTION] Success: Saved record ID ${newRevenue._id}`);
        await redis.del(`my_business_v2_${req.user._id}`).catch(() => null);
        res.status(201).json(newRevenue);
    } catch (err) {
        console.error(`[DATA INSERTION] Failed to save single record for user ${req.user._id}:`, err.message);
        res.status(500).json({ message: err.message });
    }
};

const addRevenueBulk = async (req, res) => {
    try {
        const { records } = req.body;
        console.log(`[BULK INSERTION] Received ${records?.length} records for user ${req.user._id}`);

        const toSave = records.map(rec => {
            const revenueVal = Number(rec.amount || rec.revenue || 0);
            const profitVal = Number(rec.profit || 0);
            return {
                ...rec,
                userId: req.user._id,
                amount: revenueVal,
                profit: profitVal,
                loss: revenueVal - profitVal,
                year: rec.year || new Date().getFullYear()
            };
        });
        const result = await Revenue.insertMany(toSave);
        console.log(`[BULK INSERTION] Success: Inserted ${result.length} records into MongoDB`);

        await redis.del(`my_business_v2_${req.user._id}`).catch(() => null);
        res.status(201).json({ message: `${records.length} records saved` });
    } catch (err) {
        console.error(`[BULK INSERTION] Failed into insert many for user ${req.user._id}:`, err.message);
        res.status(500).json({ message: err.message });
    }
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
        await Revenue.updateMany({ userId: req.user._id }, { isDeleted: true });
        await redis.del(`my_business_v2_${req.user._id}`).catch(() => null);
        res.json({ message: 'History cleared globally but preserved in your entry logs.' });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

const restoreRevenue = async (req, res) => {
    try {
        await Revenue.updateMany({ userId: req.user._id, isDeleted: true }, { isDeleted: false });
        await redis.del(`my_business_v2_${req.user._id}`).catch(() => null);
        res.json({ message: 'All deleted revenue history restored successfully.' });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getMarketData, getMyBusinessData, addRevenue, addRevenueBulk, getAIRecommendations, getManualRevenue, clearRevenue, restoreRevenue };
