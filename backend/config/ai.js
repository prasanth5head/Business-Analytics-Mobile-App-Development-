const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

const ai = new GoogleGenAI({
    apiKey: (process.env.GEMINI_API_KEY || "").trim()
});

/**
 * Simplified generation using the requested @google/genai package and model.
 * @param {string} prompt - The prompt to send to the AI.
 * @returns {Promise<string>} - The generated text.
 */
async function generateWithFallback(prompt) {
    try {
        console.log(`[AI] Generating with gemini-3-flash-preview...`);
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        });

        if (!response || !response.text) {
            throw new Error("Empty response from gemini-3-flash-preview");
        }

        console.log(`[AI SUCCESS] Response received`);
        return response.text;
    } catch (error) {
        console.error(`[AI ERROR] gemini-3-flash-preview failed:`, error.message);
        throw error;
    }
}

module.exports = { generateWithFallback };
