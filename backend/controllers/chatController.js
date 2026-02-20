const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const chatWithGemini = async (req, res) => {
    try {
        const { message, history, marketContext } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemInstruction = `
            You are "Analytics Pro AI", a high-performance, conversational business intelligence assistant.
            
            Personality & Behavior:
            - Be friendly, professional, and helpful.
            - If the user greets you (e.g., "hi", "hello"), respond naturally and warmly before asking how you can help with their analytics.
            - Do not jump into a full data analysis unless the user asks a question about their data or business performance.
            - Use bullet points for complex data but keep greetings concise.
            
            Contextual Awareness:
            - Business: Analytics Pro
            - You have access to the user's live dashboard data: ${JSON.stringify(marketContext || "Data pending...")}
            - If data is requested, lead with the most important insight first.
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
