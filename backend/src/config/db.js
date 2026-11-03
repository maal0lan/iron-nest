import 'dotenv/config';
import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not defined in .env');
  }
  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 30000,
  });
  console.log(`MongoDB connected: ${conn.connection.host}`);
  return conn;
};

export default connectDB;
