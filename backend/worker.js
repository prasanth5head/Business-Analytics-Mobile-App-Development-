const { Worker } = require('bullmq');
const { GoogleGenAI } = require("@google/genai");
const { redisConfig, redis } = require('./config/redis');
const dotenv = require('dotenv');

dotenv.config();

const worker = new Worker(process.env.AI_QUEUE_NAME || 'ai-tasks-queue', async (job) => {
    console.log(`Processing job ${job.id} of type ${job.data.type}`);
    const { type, prompt, userId, salesData, productData, summary } = job.data;
    const key = process.env.GEMINI_API_KEY;

    try {
        const ai = new GoogleGenAI({ apiKey: key });

        if (type === 'chat') {
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: prompt,
            });
            const result = { type: 'chat_result', response: response.text, userId };
            // Publish result to redis for the main server to pick up and send via socket
            await redis.publish('ai_results', JSON.stringify(result));
            return result;
        }

        if (type === 'recommendation') {
            const recommendationPrompt = `Analyze this business data and provide 3 strategic recommendations.
            Sales Summary: ${JSON.stringify(summary)}
            Sales Trend: ${JSON.stringify(salesData)}
            Product Performance: ${JSON.stringify(productData)}
            
            Return ONLY a JSON object with:
            1. "aiAnalysis": a 2-sentence summary.
            2. "recommendations": array of 3 objects with "title", "recommendation", "type", "confidence".`;

            const aiResult = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: recommendationPrompt,
            });

            const text = aiResult.text.replace(/```json|```/g, "").trim();
            const parsedData = JSON.parse(text);
            const result = { type: 'recommendation_result', response: parsedData, userId };
            await redis.publish('ai_results', JSON.stringify(result));
            return result;
        }
    } catch (error) {
        console.error(`Error processing job ${job.id}:`, error);
        throw error;
    }
}, {
    connection: redisConfig,
});

worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed:`, err);
});

console.log('AI Worker started...');
