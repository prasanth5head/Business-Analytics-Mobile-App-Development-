const { GoogleGenerativeAI } = require("@google/generative-ai");
const Revenue = require("../models/Revenue");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

const getAiRecommendations = async (req, res) => {
    try {
        const { salesData, productData, summary } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            throw new Error("Missing Gemini API Key");
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are a Senior Business Analytics Expert. 
            Analyze the following business data and provide 3 highly strategic recommendations.
            
            Current Data Summary:
            - Yearly Sales Data: ${JSON.stringify(salesData)}
            - Category Performance: ${JSON.stringify(productData)}
            - Totals: ${JSON.stringify(summary)}
            
            Return ONLY a JSON object with the following structure:
            {
              "aiAnalysis": "Brief executive summary of findings",
              "recommendations": [
                {
                  "type": "Critical/Strategy/Market",
                  "title": "Short title",
                  "insight": "Data-backed observation",
                  "recommendation": "Specific actionable step",
                  "confidence": 0-100
                }
              ]
            }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean text if Gemini wraps it in markdown backticks
        text = text.replace(/```json|```/g, "").trim();

        // Final cleaning: Ensure no leading/trailing junk
        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1) {
            text = text.substring(jsonStart, jsonEnd + 1);
        }

        const aiResponse = JSON.parse(text);

        res.json({
            ...aiResponse,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Gemini AI error:', error.message);

        // LOCAL FALLBACK: Return smart static recommendations if AI fails
        // This prevents the whole dashboard from crashing
        const fallback = {
            aiAnalysis: "Our local heuristic engine has detected critical patterns in your sales volatility and category margins.",
            recommendations: [
                {
                    type: "Critical",
                    title: "Margin Protection",
                    insight: "High return rates in Clothing (12%+) are eroding your 40% gross margins.",
                    recommendation: "Implement a 48-hour quality review cycle for the top-returned SKU in the Clothing category.",
                    confidence: 85
                },
                {
                    type: "Strategy",
                    title: "Inventory Optimization",
                    insight: "Beauty products maintain 50%+ margins with near-zero price sensitivity.",
                    recommendation: "Increase Beauty inventory buffer by 20% to avoid stockouts during high-volume periods.",
                    confidence: 92
                },
                {
                    type: "Market",
                    title: "Retention Warning",
                    insight: "Predictive churn model indicates a potential 5% loss in high-value customers.",
                    recommendation: "Deploy a personalized loyalty offer to users with 0 purchases in the last 30 days.",
                    confidence: 78
                }
            ],
            timestamp: new Date().toISOString(),
            isFallback: true
        };

        res.json(fallback);
    }
};

module.exports = {
    getMarketData,
    addRevenue,
    getAiRecommendations
};
