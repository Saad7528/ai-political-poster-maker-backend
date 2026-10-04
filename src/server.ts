import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { connectDB } from './config/db.js';

import authRoutes from './routes/auth.routes.js';
import templateRoutes from './routes/template.routes.js';
import posterRoutes from './routes/poster.routes.js';
import aiRoutes from './routes/ai.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import adminRoutes from './routes/admin.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, postman, curl)
      if (!origin) return callback(null, true);
      const frontendUrl = process.env.FRONTEND_URL;
      if (
        origin === 'http://localhost:3000' ||
        origin === 'http://localhost:3001' ||
        (frontendUrl && origin === frontendUrl) ||
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(morgan('dev'));

// Static uploads serving
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'অতিরিক্ত রিকোয়েস্ট পাঠানো হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।',
  },
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/posters', apiLimiter, posterRoutes);
app.use('/api/ai', apiLimiter, aiRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    project: 'AI Political Poster Maker API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Root Route
app.get('/', (_req: Request, res: Response) => {
  res.send('🇧🇩 AI Political Poster Maker API Server is running.');
});

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'এপিআই এন্ডপয়েন্টটি খুঁজে পাওয়া যায়নি (Endpoint Not Found)',
  });
});

// Global Error Handler
interface CustomError extends Error {
  status?: number;
}

app.use((err: CustomError, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'সার্ভারে অভ্যন্তরীণ ত্রুটি দেখা দিয়েছে।',
  });
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}

export default app;
