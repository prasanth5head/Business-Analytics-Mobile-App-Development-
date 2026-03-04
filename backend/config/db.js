const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected to Worker ${process.pid}: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error for Worker ${process.pid}: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
