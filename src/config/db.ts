import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  // If already connected, reuse existing connection (Serverless Best Practice)
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.warn('⚠️ MONGODB_URI is not defined in environment variables');
      return;
    }

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host} / Database: ${conn.connection.name}`);
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown database connection error';
    console.error(`❌ MongoDB Connection Error: ${errorMsg}`);
    // Do not call process.exit(1) in serverless environments
  }
};
