import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { connectDB } from './config/db';

import authRoutes from './routes/auth.routes';
import templateRoutes from './routes/template.routes';
import posterRoutes from './routes/poster.routes';
import aiRoutes from './routes/ai.routes';
import uploadRoutes from './routes/upload.routes';
import adminRoutes from './routes/admin.routes';

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for Vercel / reverse proxy environments
app.set('trust proxy', 1);

// Enable Permissive CORS for all environments & Vercel domains
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(morgan('dev'));

// Serverless DB Connection Middleware
app.use(async (_req: Request, _res: Response, next: NextFunction) => {
  try {
    await connectDB();
  } catch (err: unknown) {
    console.error('DB connect middleware error:', err);
  }
  next();
});

// Static uploads serving
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    message: 'অতিরিক্ত রিকোয়েস্ট পাঠানো হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।',
  },
});

// API Routes (Supporting both /api prefix and root rewrite)
app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/posters', apiLimiter, posterRoutes);
app.use('/api/ai', apiLimiter, aiRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

app.use('/auth', authRoutes);
app.use('/templates', templateRoutes);
app.use('/posters', apiLimiter, posterRoutes);
app.use('/ai', aiRoutes);
app.use('/upload', uploadRoutes);
app.use('/admin', adminRoutes);

// Root API Info Route
app.get('/api', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: '🇧🇩 AI Political Poster Maker API Server is running.',
    endpoints: {
      health: '/api/health',
      templates: '/api/templates',
      auth: '/api/auth',
      posters: '/api/posters',
      ai: '/api/ai',
    },
  });
});

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    project: 'AI Political Poster Maker API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (_req: Request, res: Response) => {
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

export default app;

