const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { GoogleGenAI } = require("@google/genai");
const jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require('socket.io');
const compression = require('compression');
const helmet = require('helmet');
const morgan = require('morgan');
const { aiQueue } = require('./config/queue');
const { redis } = require('./config/redis');

dotenv.config();

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
  console.log('Client connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their private channel`);
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

// Simple Auth Middleware
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

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
      userId: req.user.id
    });

    res.json({ message: "Job queued", jobId: job.id });
  }
  catch (err) {
    console.error("AI Queue Error:", err);
    res.status(500).json({ message: "Queue Error: " + err.message });
  }
};

// Support both routes for compatibility
app.post("/api/chat", auth, chatHandler);
app.post("/chat", auth, chatHandler);

app.get('/', (req, res) => {
  res.send('Scaleable API is running...');
});

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/market', require('./routes/marketRoutes'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


