const { Worker } = require('bullmq');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { redisConfig, redis } = require('./config/redis');
const dotenv = require('dotenv');

dotenv.config();

const worker = new Worker(process.env.AI_QUEUE_NAME || 'ai-tasks-queue', async (job) => {
    const { type, prompt, userId, salesData, productData, summary } = job.data;
    console.log(`[AI WORKER] Processing job ${job.id} of type ${type} for user ${userId}`);

    const key = process.env.GEMINI_API_KEY;

    try {
        const genAI = new GoogleGenerativeAI(key);
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        if (type === 'chat') {
            console.log(`[AI CHAT] Sending prompt to gemini-3-flash-preview: "${prompt.substring(0, 50)}..."`);
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            console.log(`[AI CHAT] Received response (${text.length} chars)`);
            const chatResult = { type: 'chat_result', response: text, userId };
            await redis.publish('ai_results', JSON.stringify(chatResult));
            return chatResult;
        }

        if (type === 'recommendation') {
            const recommendationPrompt = `Analyze this business data and provide 3 strategic recommendations.
            Sales Summary: ${JSON.stringify(summary)}
            Sales Trend: ${JSON.stringify(salesData)}
            Product Performance: ${JSON.stringify(productData)}
            
            Return ONLY a JSON object with:
            1. "aiAnalysis": a 2-sentence summary.
            2. "recommendations": array of 3 objects with "title", "recommendation", "type", "confidence".`;

            console.log(`[AI GEN] Sending data-driven recommendation prompt to gemini-3-flash-preview`);
            const aiResult = await model.generateContent(recommendationPrompt);
            const response = await aiResult.response;
            const rawText = response.text().replace(/```json|```/g, "").trim();

            console.log(`[AI GEN] Raw Text Received: ${rawText.substring(0, 100)}...`);

            try {
                const parsedData = JSON.parse(rawText);
                const result = { type: 'recommendation_result', response: parsedData, userId };
                await redis.publish('ai_results', JSON.stringify(result));
                console.log(`[AI GEN] Successfully parsed and published results for job ${job.id}`);
                return result;
            } catch (pErr) {
                console.error(`[AI GEN] JSON Parse Error:`, pErr.message, "Raw Text:", rawText);
                throw new Error("AI returned invalid JSON format");
            }
        }
    } catch (error) {
        console.error(`[AI WORKER ERROR] Job ${job.id} failed:`, error.message);
        throw error;
    }
}, {
    connection: redisConfig,
});

worker.on('completed', (job) => {
    console.log(`[AI WORKER] Job ${job.id} marked as COMPLETED`);
});

worker.on('failed', (job, err) => {
    console.error(`[AI WORKER] Job ${job.id} marked as FAILED:`, err.message);
});

console.log('AI Worker (gemini-3-flash-preview) initialized and listening...');
