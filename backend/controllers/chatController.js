const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const chatWithGemini = async (req, res) => {
    try {
        const { message, history, marketContext } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Build a system instruction to make Gemini aware of the business context
        const systemInstruction = `
            You are "Analytics Pro AI", a high-performance business intelligence assistant.
            You help users analyze their market data, sales, profits, and strategic risks.
            
            Current Business Context:
            - Business Name: Analytics Pro
            - Dashboard Features: Descriptive, Diagnostic, Predictive, Prescriptive, and Reports.
            - Active Market Data Summary: ${JSON.stringify(marketContext || "Data not available")}
            
            Personality:
            - Professional, insightful, and proactive.
            - Use bullet points for readability.
            - Focus on data-driven insights.
            - If data is missing, offer general strategic advice based on industry standards.
        `;

        const chat = model.startChat({
            history: history || [],
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const fullPrompt = `${systemInstruction}\n\nUser Question: ${message}`;
        const result = await chat.sendMessage(fullPrompt);
        const response = await result.response;
        const text = response.text();

        res.json({ text });
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: "Failed to connect to Gemini AI. Check your API key or connection." });
    }
};

module.exports = { chatWithGemini };
