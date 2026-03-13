const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function discover() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // 1. Manually try the most likely candidates with different prefixes
    const candidates = [
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-2.0-flash",
        "gemini-2.0-flash-exp",
        "models/gemini-1.5-flash",
        "models/gemini-1.5-pro"
    ];

    console.log("--- PROBING CANDIDATES ---");
    for (const name of candidates) {
        try {
            const model = genAI.getGenerativeModel({ model: name });
            const result = await model.generateContent("hi");
            console.log(`SUCCESS: ${name}`);
            process.exit(0); // Stop at first success
        } catch (e) {
            console.log(`FAIL: ${name} -> ${e.message.substring(0, 100)}`);
        }
    }
}

discover();
