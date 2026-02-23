const Revenue = require("../models/Revenue");
const { GoogleGenAI } = require("@google/genai");



// Helper to generate noisy data around a baseline
const generateTrendData = (baseSales, count, persistentRevenue = []) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Create a map of persistent revenue by month
    const revenueMap = persistentRevenue.reduce((acc, rev) => {
        acc[rev.month] = (acc[rev.month] || 0) + rev.amount;
        return acc;
    }, {});

    return Array.from({ length: count }, (_, i) => {
        const month = monthNames[i % 12];
        const volatility = Math.random() * 0.4 - 0.2; // -20% to +20%
        const base = baseSales * (1 + volatility);

        // Add persistent revenue from DB for this month
        const persistentAmount = revenueMap[month] || 0;
        const sales = Math.round(base + persistentAmount);

        const profit = Math.round(sales * (0.3 + Math.random() * 0.3)); // 30-60% margin
        const price = 90 + Math.floor(Math.random() * 80);
        // Simulate high price causing low sales link
        const adjustedSales = price > 130 ? Math.round(sales * 0.7) : sales;

        return {
            p: month,
            sales: adjustedSales,
            profit,
            price,
            complaints: Math.floor(Math.random() * (price > 130 ? 30 : 10)),
            competitorCheck: Math.random() > 0.7 ? 1 : 0
        };
    });
};

const getMarketData = async (req, res) => {
    try {
        // Fetch persistent revenue from DB
        const persistentRevenue = await Revenue.find({});

        // Generating dynamic recent market data with persistent additions
        const liveData = generateTrendData(4000, 12, persistentRevenue);

        const products = [
            { name: 'Electronics', profitMargin: 15 + Math.floor(Math.random() * 20), returnRate: 3 + Math.random() * 7 },
            { name: 'Clothing', profitMargin: 35 + Math.floor(Math.random() * 25), returnRate: 10 + Math.random() * 10 },
            { name: 'Home', profitMargin: 25 + Math.floor(Math.random() * 15), returnRate: 5 + Math.random() * 8 },
            { name: 'Beauty', profitMargin: 50 + Math.floor(Math.random() * 20), returnRate: 1 + Math.random() * 5 },
        ];

        const totalSales = liveData.reduce((acc, curr) => acc + curr.sales, 0);
        const avgProfit = Math.round(liveData.reduce((acc, curr) => acc + curr.profit, 0) / liveData.length);

        res.json({
            timestamp: new Date().toISOString(),
            salesData: liveData,
            productData: products,
            summary: {
                totalSales,
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
        const { amount, month } = req.body;
        if (!amount || !month) {
            return res.status(400).json({ message: 'Amount and month are required' });
        }

        const newRevenue = new Revenue({
            amount: Number(amount),
            month
        });

        await newRevenue.save();
        res.status(201).json({ message: 'Revenue added successfully', data: newRevenue });
    } catch (error) {
        console.error('Add revenue error:', error);
        res.status(500).json({ message: 'Error adding revenue' });
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
            model: "gemini-2.0-flash",
            contents: prompt,
        });

        const text = aiResult.text.replace(/```json|```/g, "").trim();

        const parsedData = JSON.parse(text);

        res.json(parsedData);
    } catch (error) {
        console.error('AI Recommendation Error:', error);
        // Fallback recommendations if AI fails
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
    getAIRecommendations
};

