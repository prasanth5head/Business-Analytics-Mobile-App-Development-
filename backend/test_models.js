const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    try {
        // The SDK doesn't have a direct listModels but we can try to see what's available
        // via the underlying REST API if needed, but usually we just try the standard ones.
        // Actually, let's just test the three most common ones.
        
        const modelsToTest = [
            "gemini-2.0-flash",
            "gemini-1.5-flash",
            "gemini-1.5-pro",
            "gemini-pro"
        ];
        
        for (const m of modelsToTest) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                await model.generateContent("test");
                console.log(`✅ ${m}: WORKING`);
            } catch (err) {
                console.log(`❌ ${m}: FAILED - ${err.message}`);
            }
        }
    } catch (error) {
        console.error("Critical Error:", error.message);
    }
}

listModels();
