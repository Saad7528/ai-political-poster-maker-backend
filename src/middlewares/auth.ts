import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'অননুমোদিত রিকোয়েস্ট। অনুগ্রহ করে প্রথমে লগইন করুন (Authentication token missing)',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET || 'rise_together_default_secret';

    const decoded = jwt.verify(token, jwtSecret) as { id: string };
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'ব্যবহারকারী খুঁজে পাওয়া যায়নি অথবা সেশন মেয়াদোত্তীর্ণ হয়েছে।',
      });
      return;
    }

    req.user = user;
    next();
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Invalid or expired token';
    res.status(401).json({
      success: false,
      message: 'অবৈধ অথবা মেয়াদোত্তীর্ণ টোকেন। আবার লগইন করুন।',
      error: errorMsg,
    });
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const jwtSecret = process.env.JWT_SECRET || 'rise_together_default_secret';
      const decoded = jwt.verify(token, jwtSecret) as { id: string };
      const user = await User.findById(decoded.id).select('-passwordHash');
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch {
    next();
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({
      success: false,
      message: 'এই কাজটি করার জন্য অ্যাডমিন পারমিশন প্রয়োজন।',
    });
    return;
  }
  next();
};
