const Revenue = require("../models/Revenue");
const { GoogleGenAI } = require("@google/genai");

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Generate data starting from current month + next 6 predictive months
const generateTrendData = (baseSales, persistentRevenue = []) => {
    const now = new Date();
    const currentMonthIndex = now.getMonth(); // 0=Jan

    const revenueMap = persistentRevenue.reduce((acc, rev) => {
        acc[rev.month] = (acc[rev.month] || 0) + rev.amount;
        return acc;
    }, {});

    // 7 months total: Current month + 6 future months
    return Array.from({ length: 7 }, (_, i) => {
        const monthOffset = i; // Starts at 0 (current month)
        const monthIndex = (currentMonthIndex + monthOffset) % 12;
        const month = MONTH_NAMES[monthIndex];
        const isPredictive = monthOffset > 0;

        // Predictive months trend slightly upward
        const trendMultiplier = isPredictive ? (1 + monthOffset * 0.04) : 1;
        const volatility = isPredictive
            ? Math.random() * 0.15 - 0.05  // Prediction: gentler range
            : Math.random() * 0.2 - 0.1;   // Current month


        const base = baseSales * (1 + volatility) * trendMultiplier;
        const persistentAmount = revenueMap[month] || 0;
        const sales = Math.round(base + persistentAmount);

        const profit = Math.round(sales * (0.3 + Math.random() * 0.3));
        const loss = Math.round(sales * (0.05 + Math.random() * 0.1));
        const price = 90 + Math.floor(Math.random() * 80);
        const adjustedSales = price > 130 ? Math.round(sales * 0.7) : sales;

        return {
            p: month,
            sales: adjustedSales,
            profit,
            loss,
            price,
            complaints: Math.floor(Math.random() * (price > 130 ? 30 : 10)),
            competitorCheck: Math.random() > 0.7 ? 1 : 0,
            isPredictive  // Flag so frontend can render differently
        };
    });
};

// Risk score formula for a product
// Risk = (returnRate * 0.5) + ((100 - profitMargin) * 0.3) + (complaints * 0.2)
// Scale: 0-100 (higher = riskier)
const calculateRisk = (profitMargin, returnRate, complaints = 5) => {
    const raw = (returnRate * 0.5) + ((100 - profitMargin) * 0.3) + (complaints * 0.2);
    const score = Math.min(100, Math.max(0, Math.round(raw)));
    const formula = `(ReturnRate×0.5) + ((100-ProfitMargin)×0.3) + (Complaints×0.2)`;
    const calculation = `(${returnRate.toFixed(1)}×0.5) + ((100-${profitMargin})×0.3) + (${complaints}×0.2) = ${score}`;
    let level = score < 30 ? 'Low' : score < 60 ? 'Medium' : 'High';
    return { score, formula, calculation, level };
};

const getMarketData = async (req, res) => {
    try {
        const persistentRevenue = await Revenue.find({});
        const liveData = generateTrendData(4000, persistentRevenue);

        const productsRaw = [
            { name: 'Electronics', profitMargin: 15 + Math.floor(Math.random() * 20), returnRate: parseFloat((3 + Math.random() * 7).toFixed(1)), complaints: Math.floor(Math.random() * 20 + 5) },
            { name: 'Clothing', profitMargin: 35 + Math.floor(Math.random() * 25), returnRate: parseFloat((10 + Math.random() * 10).toFixed(1)), complaints: Math.floor(Math.random() * 30 + 8) },
            { name: 'Home', profitMargin: 25 + Math.floor(Math.random() * 15), returnRate: parseFloat((5 + Math.random() * 8).toFixed(1)), complaints: Math.floor(Math.random() * 15 + 3) },
            { name: 'Beauty', profitMargin: 50 + Math.floor(Math.random() * 20), returnRate: parseFloat((1 + Math.random() * 5).toFixed(1)), complaints: Math.floor(Math.random() * 10 + 1) },
        ];

        const products = productsRaw.map(p => ({
            ...p,
            risk: calculateRisk(p.profitMargin, p.returnRate, p.complaints)
        }));

        const totalSales = liveData.reduce((acc, curr) => acc + curr.sales, 0);
        const avgProfit = Math.round(liveData.reduce((acc, curr) => acc + curr.profit, 0) / liveData.length);
        const totalLoss = liveData.reduce((acc, curr) => acc + curr.loss, 0);

        res.json({
            timestamp: new Date().toISOString(),
            currentMonth: MONTH_NAMES[new Date().getMonth()],
            salesData: liveData,
            productData: products,
            summary: {
                totalSales,
                totalLoss,
                growthRate: (Math.random() * 15).toFixed(1) + "%",
                activeUsers: 2000 + Math.floor(Math.random() * 500),
                customerGrowth: "+" + (Math.random() * 5).toFixed(1) + "%",
                avgProfit,
                profitGrowth: "+" + (Math.random() * 10).toFixed(1) + "%"
            }
        });
    } catch (error) {
        console.error('Market data error:', error);
        res.status(500).json({ message: 'Error fetching market data' });
    }
};

const addRevenue = async (req, res) => {
    try {
        const { amount, profit, loss, month, product } = req.body;
        if (!amount || !month) {
            return res.status(400).json({ message: 'Amount and month are required' });
        }

        const newRevenue = new Revenue({
            amount: Number(amount),
            product: product || 'All',
            profit: Number(profit) || 0,
            loss: Number(loss) || 0,
            month
        });
        await newRevenue.save();
        res.status(201).json({ message: 'Revenue added successfully', data: newRevenue });
    } catch (error) {
        console.error('Add revenue error:', error);
        res.status(500).json({ message: 'Error adding revenue' });
    }
};

const getManualRevenue = async (req, res) => {
    try {
        const revenue = await Revenue.find({}).sort({ createdAt: -1 });
        res.json(revenue);
    } catch (error) {
        console.error('Get manual revenue error:', error);
        res.status(500).json({ message: 'Error fetching manual revenue report' });
    }
};

const getAIRecommendations = async (req, res) => {
    try {
        const { salesData, productData, summary } = req.body;

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const prompt = `Analyze this business data and provide 3 strategic recommendations.
        Sales Summary: ${JSON.stringify(summary)}
        Sales Trend: ${JSON.stringify(salesData)}
        Product Performance: ${JSON.stringify(productData)}
        
        Format the response as a JSON object with:
        1. "aiAnalysis": a 2-sentence summary of overall health.
        2. "recommendations": an array of 3 objects, each with "title", "recommendation", "type" (Critical/Actionable), and "confidence" (0-100).
        Return ONLY the JSON.`;

        const aiResult = await ai.models.generateContent({
            model: "gemini-3-flash-preview",

            contents: prompt,
        });

        const text = aiResult.text.replace(/```json|```/g, "").trim();

        const parsedData = JSON.parse(text);

        res.json(parsedData);
    } catch (error) {
        console.error('AI Recommendation Error:', error);
        res.json({
            aiAnalysis: "Market performance remains stable with consistent growth patterns across key sectors.",
            recommendations: [
                { title: "Optimize Inventory", recommendation: "Focus on high-margin products in the Beauty category to maximize current ROI.", type: "Actionable", confidence: 85 },
                { title: "Customer Retention", recommendation: "Launch targeted re-engagement campaigns for active users to maintain growth.", type: "Actionable", confidence: 90 },
                { title: "Expense Review", recommendation: "Conduct a deep dive into operation costs in Clothing sectors to improve net margins.", type: "Critical", confidence: 75 }
            ]
        });
    }
};

module.exports = {
    getMarketData,
    addRevenue,
    getManualRevenue,
    getAIRecommendations
};
