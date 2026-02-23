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

    const modelsToTry = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.0-flash-lite", "gemini-flash-latest"];
    let lastError = null;

    for (const modelName of modelsToTry) {
      try {
        console.log(`DEBUG: Trying model ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        result = await model.generateContent(prompt);
        console.log(`DEBUG: Success with model ${modelName}!`);
        break; // Success! Exit the loop.
      } catch (e) {
        lastError = e;
        if (e.status === 404 || e.message?.toLowerCase().includes("not found")) {
          console.log(`DEBUG: Model ${modelName} not found or not allowed. Trying next...`);
          continue;
        } else {
          throw e; // Rethrow if it's a completely different error e.g. 403
        }
      }
    }

    if (!result) {
      throw lastError; // All models failed or loop ended without result
    }

    const response = await result.response;
    res.json({ response: response.text() });
  }
  catch (err) {
    console.error("AI Chat Error:", err);

    // If it's STILL a 404 after trying everything, let's fetch what models are actually available!
    let availableModelsDetails = "";
    if (err.status === 404 || err.message?.toLowerCase().includes("not found")) {
      try {
        const axios = require('axios');
        const key = process.env.GEMINI_API_KEY;
        const modelsResponse = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const modelsList = modelsResponse.data.models.map(m => m.name.replace('models/', '')).join(', ');
        availableModelsDetails = ` We checked your key. The models available to you are: ${modelsList}.`;
        console.log("DEBUG Available Models:", modelsList);
      } catch (diagError) {
        console.log("DEBUG: Diagnosis failed", diagError.message);
        availableModelsDetails = " Could not fetch the exact list of available models.";
      }
    }

    const errStatus = err.status || 500;
    res.status(errStatus).json({
      message: "Chat Error: " + (err.message || "Unknown error") + availableModelsDetails,
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

