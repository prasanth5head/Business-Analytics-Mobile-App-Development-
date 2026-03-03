const Redis = require('ioredis');
const dotenv = require('dotenv');

dotenv.config();

const redisOptions = {
    maxRetriesPerRequest: null, // Critical for BullMQ
};

// Use REDIS_URL if available (Render/Production), otherwise fallback to host/port (Local)
const redis = process.env.REDIS_URL
    ? new Redis(process.env.REDIS_URL, redisOptions)
    : new Redis({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
        ...redisOptions
    });

const redisConfig = process.env.REDIS_URL
    ? process.env.REDIS_URL
    : {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
    };

redis.on('connect', () => {
    console.log('Redis connected successfully');
});

redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});

module.exports = { redis, redisConfig };
