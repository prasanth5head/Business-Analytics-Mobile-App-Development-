const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

// Set security headers for Google OAuth compatibility on mobile
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    return callback(null, true); // Allow all origins for now but in a more compliant way
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

const { GoogleGenerativeAI } = require("@google/generative-ai");

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/market', require('./routes/marketRoutes'));

// AI Chat Logic
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Auth Middleware (as provided in snippet)
const auth = (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1]
    : req.headers.authorization;

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
};

app.post("/chat", auth, async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || prompt.trim() === "")
      return res.status(400).json({ message: "Prompt required" });

    // Using gemini-1.5-flash which is widely available and fast
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;

    res.json({ response: response.text() });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: "Chat error" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
