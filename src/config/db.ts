import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host} / Database: ${conn.connection.name}`);
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown database connection error';
    console.error(`❌ MongoDB Connection Error: ${errorMsg}`);
    process.exit(1);
  }
};
