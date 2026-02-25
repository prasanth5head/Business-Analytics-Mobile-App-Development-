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
            { name: 'Retail Clothing (<₹1k)', profitMargin: 20, returnRate: 5.2, complaints: 15, gst: 5 },
            { name: 'Retail Clothing (>₹1k)', profitMargin: 25, returnRate: 6.0, complaints: 12, gst: 12 },
            { name: 'Electronics (Mobiles)', profitMargin: 12, returnRate: 2.1, complaints: 25, gst: 18 },
            { name: 'Electronics (Laptops)', profitMargin: 15, returnRate: 1.5, complaints: 10, gst: 18 },
            { name: 'Supermarket (Grocery)', profitMargin: 8, returnRate: 0.5, complaints: 5, gst: 5 },
            { name: 'Restaurant / Food Court', profitMargin: 55, returnRate: 1.0, complaints: 20, gst: 5 },
            { name: 'Cinema Theatre', profitMargin: 40, returnRate: 0.5, complaints: 8, gst: 18 },
            { name: 'Gaming Zone', profitMargin: 65, returnRate: 0.1, complaints: 2, gst: 18 },
            { name: 'Salon / Spa', profitMargin: 50, returnRate: 0.5, complaints: 5, gst: 18 },
            { name: 'Jewellery Shop', profitMargin: 18, returnRate: 0.2, complaints: 3, gst: 3 },
            { name: 'Footwear', profitMargin: 35, returnRate: 4.5, complaints: 14, gst: 18 },
            { name: 'Parking (Mall Income)', profitMargin: 85, returnRate: 0.0, complaints: 10, gst: 18 },
            { name: 'Mobile Accessories', profitMargin: 60, returnRate: 3.5, complaints: 12, gst: 18 },
            { name: 'Book Store', profitMargin: 30, returnRate: 1.0, complaints: 2, gst: 12 },
            { name: 'Toy Store', profitMargin: 45, returnRate: 3.0, complaints: 6, gst: 12 },
            { name: 'Optical Shop', profitMargin: 70, returnRate: 2.0, complaints: 4, gst: 12 },
            { name: 'Watch Store', profitMargin: 50, returnRate: 1.0, complaints: 3, gst: 18 },
            { name: 'Gym / Fitness Center', profitMargin: 40, returnRate: 1.0, complaints: 5, gst: 18 },
            { name: 'Gift Shop', profitMargin: 45, returnRate: 2.5, complaints: 4, gst: 18 },
            { name: 'Ice Cream Shop', profitMargin: 55, returnRate: 0.2, complaints: 3, gst: 18 },
            { name: 'Pharmacy', profitMargin: 22, returnRate: 0.5, complaints: 2, gst: 12 },
            { name: 'ATM / Banking', profitMargin: 100, returnRate: 0.0, complaints: 15, gst: 18 },
            { name: 'Tattoo Shop', profitMargin: 75, returnRate: 1.0, complaints: 1, gst: 18 },
            { name: 'Photo Studio', profitMargin: 60, returnRate: 0.5, complaints: 2, gst: 18 },
            { name: 'Pet Shop', profitMargin: 30, returnRate: 1.5, complaints: 5, gst: 12 },
            { name: 'Sweet Shop', profitMargin: 40, returnRate: 0.5, complaints: 3, gst: 5 },
            { name: 'Flower Shop', profitMargin: 50, returnRate: 2.0, complaints: 1, gst: 0 }
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

const clearRevenue = async (req, res) => {
    try {
        await Revenue.deleteMany({});
        res.json({ message: 'All manual revenue data cleared successfully' });
    } catch (error) {
        console.error('Clear revenue error:', error);
        res.status(500).json({ message: 'Error clearing revenue data' });
    }
};

const getAIRecommendations = async (req, res) => {
    try {
        const { salesData, productData, summary } = req.body;

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const prompt = `Analyze this business data and provide 3 strategic recommendations.
        Sales Summary: ${JSON.stringify(summary)}
        Sales Trend: ${JSON.stringify(salesData)}
        Product Performance (including GST %): ${JSON.stringify(productData)}
        
        Consider the impact of GST rates on the profit margins when making recommendations. Format the response as a JSON object with:
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
    clearRevenue,
    getAIRecommendations
};
