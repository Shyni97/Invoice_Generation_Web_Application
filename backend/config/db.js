const mongoose = require('mongoose');

const connectDB = async (mongoUri) => {
  const uri = mongoUri || process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is not set');
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw err;
  }
};

module.exports = connectDB;
