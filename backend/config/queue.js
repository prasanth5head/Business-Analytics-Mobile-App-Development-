const { Queue } = require('bullmq');
const { redisConfig } = require('./redis');

const aiQueue = new Queue(process.env.AI_QUEUE_NAME || 'ai-tasks-queue', {
    connection: redisConfig,
});

module.exports = { aiQueue };
