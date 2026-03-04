require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { GoogleGenAI } = require("@google/genai");
const jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require('socket.io');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const cluster = require('cluster');
const os = require('os');
const { aiQueue } = require('./config/queue');
const { redis } = require('./config/redis');

// Cluster logic: Scale across CPU cores
if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(`🚀 Master process ${process.pid} is running`);

  // Fork workers - limit to 4 in dev or use all in production
  const workersToFork = process.env.NODE_ENV === 'production' ? numCPUs : Math.min(numCPUs, 2);

  for (let i = 0; i < workersToFork; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`⚠️ Worker ${worker.process.pid} died. Forking a new one...`);
    cluster.fork();
  });

} else {
  // WORKER PROCESS: Runs both the Server and the AI Worker

  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Database Connection
  connectDB();

  // Middlewares
  app.use(helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
  }));
  app.use(compression());
  app.use(morgan('dev'));
  app.use(cors({
    origin: "*",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(express.json());

  // Socket.io connection
  io.on('connection', (socket) => {
    console.log(`Client connected to worker ${process.pid}:`, socket.id);

    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their private channel on worker ${process.pid}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  // Redis Pub/Sub to Socket.io bridge
  // Each worker process listens to redis. When a job is done, it emits to connected clients.
  const sub = redis.duplicate();
  sub.on('message', (channel, message) => {
    if (channel === 'ai_results') {
      const { type, response, userId } = JSON.parse(message);
      io.to(userId).emit(type, response);
    }
  });
  sub.subscribe('ai_results');

  // Pass io to request object
  app.use((req, res, next) => {
    req.io = io;
    next();
  });

  const { protect } = require('./middleware/authMiddleware');

  // Queue-based Chat Handler
  const chatHandler = async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt || prompt.trim() === "")
        return res.status(400).json({ message: "Prompt required" });

      // Push to queue
      const job = await aiQueue.add('chat-task', {
        type: 'chat',
        prompt,
        userId: req.user._id // Using _id from the fetched user object
      });

      res.json({ message: "Job queued", jobId: job.id });
    }
    catch (err) {
      console.error("AI Queue Error:", err);
      res.status(500).json({ message: "Queue Error: " + err.message });
    }
  };

  app.post("/api/chat", protect, chatHandler);
  app.post("/chat", protect, chatHandler);

  app.get('/', (req, res) => {
    res.send(`Scaleable API is running on worker ${process.pid}`);
  });

  app.use('/api/users', require('./routes/userRoutes'));
  app.use('/api/market', require('./routes/marketRoutes'));

  const PORT = process.env.PORT || 5000;

  server.listen(PORT, () => {
    console.log(`Worker ${process.pid} started server on port ${PORT}`);

    // START THE AI WORKER LOGIC
    // This makes this process handle both incoming web requests AND background tasks
    require('./worker');
  });
}


