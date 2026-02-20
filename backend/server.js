const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
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

const path = require('path');

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/market', require('./routes/marketRoutes'));

// Serve static files from the frontend build folder
const buildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(buildPath));

// Handle SPA routing - deliver index.html for any unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
