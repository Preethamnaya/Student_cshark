const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  const dbUri = process.env.MONGODB_URI || 'mongodb+srv://preetham:mongodb123@ourproject.lh011ok.mongodb.net/student_cshark?retryWrites=true&w=majority&appName=ourproject';

  if (!dbUri) {
    console.error('Error: MONGODB_URI is not defined in the environment variables and no fallback exists.');
    if (process.env.VERCEL) {
      throw new Error('MONGODB_URI is missing');
    }
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(dbUri);
    cachedConnection = conn;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    if (process.env.VERCEL) {
      throw error;
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
