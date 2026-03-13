const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function check() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        // There is no listModels in the standard SDK, but we can try to get them via the API directly
        // However, let's just try the most basic ones.
        const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
        for(let m of models) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                await model.generateContent("hi");
                console.log("WORKING:", m);
            } catch(e) {
                console.log("FAILED:", m, e.message);
            }
        }
    } catch (err) {
        console.error(err);
    }
}
check();
