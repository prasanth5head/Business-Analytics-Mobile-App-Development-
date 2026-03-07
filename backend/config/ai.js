const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * List of models to try in order.
 * - gemini-3-flash-preview: Cutting-edge, high demand.
 * - gemini-2.0-flash-exp: Next-gen experimental, high speed.
 * - gemini-1.5-flash: Stable workhorse, generous quota.
 */
const MODELS = [
    "gemini-3-flash-preview",
    "gemini-2.0-flash-exp",
    "gemini-1.5-flash"
];

/**
 * Generates content with automatic fallback to secondary models if the primary model fails.
 * Also implements retry logic for temporary service outages (503).
 * 
 * @param {string} prompt - The prompt to send to the AI.
 * @param {number} retriesPerModel - Number of times to retry a single model on 503 error.
 * @returns {Promise<string>} - The generated text.
 */
async function generateWithFallback(prompt, retriesPerModel = 2) {
    let lastError = null;

    for (const modelName of MODELS) {
        try {
            console.log(`[AI] Attempting generation with: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });

            for (let attempt = 1; attempt <= (retriesPerModel + 1); attempt++) {
                try {
                    const result = await model.generateContent(prompt);
                    const response = await result.response;
                    const text = response.text();

                    if (!text) throw new Error("Empty response from AI");

                    console.log(`[AI Success] Model: ${modelName}`);
                    return text;
                } catch (err) {
                    lastError = err;
                    const message = err.message || "Unknown error";
                    const isServiceUnavailable = message.includes("503") || message.includes("Service Unavailable");
                    const isQuotaExceeded = message.includes("429") || message.includes("Quota exceeded") || message.includes("Too Many Requests");

                    console.error(`[AI Error] Model ${modelName} | Attempt ${attempt} | Error: ${message.substring(0, 100)}`);

                    // If quota exceeded, don't bother retrying this model, move to next.
                    if (isQuotaExceeded) {
                        console.warn(`[AI] Quota hit for ${modelName}. Fallback to next model...`);
                        break;
                    }

                    // If service unavailable, retry with backoff.
                    if (isServiceUnavailable && attempt <= retriesPerModel) {
                        const backoff = attempt * 1500;
                        console.log(`[AI] 503 Busy. Retrying ${modelName} in ${backoff}ms...`);
                        await new Promise(r => setTimeout(r, backoff));
                        continue;
                    }

                    // For any other error or if retries exhausted, try next model.
                    console.warn(`[AI] ${modelName} failed. Trying next model...`);
                    break;
                }
            }
        } catch (outerErr) {
            console.error(`[AI Outer Error] Critical failure for ${modelName}:`, outerErr.message);
            lastError = outerErr;
        }
    }

    throw lastError || new Error("All configured AI models failed to respond.");
}

module.exports = { generateWithFallback };
