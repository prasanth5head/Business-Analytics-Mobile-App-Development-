require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { GoogleGenerativeAI } = require("@google/generative-ai");
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

  // Render Free Tier has 512MB RAM. Multiple workers will crash the server.
  // We detects Render via the RENDER=true env var (automatically set by Render).
  const workersToFork = (process.env.RENDER || process.env.NODE_ENV === 'production')
    ? 1
    : Math.min(numCPUs, 2);

  console.log(`📡 Starting ${workersToFork} worker process(es)...`);

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

  // Synchronous Chat Handler
  const chatHandler = async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt || prompt.trim() === "")
        return res.status(400).json({ message: "Prompt required" });

      console.log("AI Prompt Received:", prompt);

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

      const result = await model.generateContent(prompt);
      const aiResponse = await result.response;
      const text = aiResponse.text();

      console.log("AI Response Generated:", text);

      res.json({ reply: text });
    }
    catch (err) {
      console.error("AI Chat Error:", err);
      res.status(500).json({ message: "AI Error: " + err.message });
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
    require('./worker');
  });
}
