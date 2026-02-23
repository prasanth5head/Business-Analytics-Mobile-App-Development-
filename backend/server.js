const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
// Moved genAI initialization inside routes to ensure it picks up Render's environment updates


// Database Connection
connectDB();

// Middleware - Apply BEFORE routes
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Set security headers for Google OAuth compatibility on mobile
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
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

// Chat Handler Function
const chatHandler = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || prompt.trim() === "")
      return res.status(400).json({ message: "Prompt required" });

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return res.status(503).json({ message: "Server configuration error: API Key missing." });
    }

    const genAI = new GoogleGenerativeAI(key);
    let result;

    try {
      // Try 1.5 Flash first (Faster)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      result = await model.generateContent(prompt);
    } catch (e) {
      // If Flash is not found (404), fall back to Gemini Pro
      if (e.status === 404 || e.message?.toLowerCase().includes("not found")) {
        console.log("DEBUG: Fallback to gemini-pro...");
        const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro" });
        result = await fallbackModel.generateContent(prompt);
      } else {
        throw e;
      }
    }

    const response = await result.response;
    res.json({ response: response.text() });
  }
  catch (err) {
    console.error("AI Chat Error:", err);
    const errStatus = err.status || 500;
    res.status(errStatus).json({
      message: "Chat Error: " + (err.message || "Unknown error"),
      status: errStatus
    });
  }
};

// Support both routes for compatibility with cached frontend versions
app.post("/api/chat", auth, chatHandler);
app.post("/chat", auth, chatHandler);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/market', require('./routes/marketRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

