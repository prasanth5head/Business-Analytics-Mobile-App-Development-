const dotenv = require('dotenv');
dotenv.config(); // Load this FIRST

const Redis = require('ioredis');

const redisOptions = {
    maxRetriesPerRequest: null, // Critical for BullMQ
    // If using rediss:// (TLS), ensure ioredis handles it
    tls: process.env.REDIS_URL?.startsWith('rediss://') ? { rejectUnauthorized: false } : undefined
};

// Log the connection attempt for debugging
if (process.env.REDIS_URL) {
    const obscuredUrl = process.env.REDIS_URL.split('@').pop();
    console.log(`📡 Attempting to connect to Online Redis: ${obscuredUrl}`);
} else {
    console.log(`⚠️  WARNING: REDIS_URL not found! Falling back to localhost:6379.`);
    console.log(`👉 If you are on Render, PLEASE add REDIS_URL to your Environment Variables.`);
}

// Use REDIS_URL if available (Render/Production), otherwise fallback to host/port (Local)
const redis = process.env.REDIS_URL
    ? new Redis(process.env.REDIS_URL, redisOptions)
    : new Redis({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
        ...redisOptions
    });

// BullMQ needs the connection configuration
const redisConfig = process.env.REDIS_URL
    ? {
        url: process.env.REDIS_URL,
        ...redisOptions
    }
    : {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
        ...redisOptions
    };

redis.on('connect', () => {
    console.log('✅ Redis connected successfully');
});

redis.on('error', (err) => {
    console.error('❌ Redis connection error:', err.message);
});

module.exports = { redis, redisConfig };
