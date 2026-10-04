import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthRequest } from '../middlewares/auth';

const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || 'rise_together_default_secret';
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'];
  return jwt.sign({ id: userId }, secret, { expiresIn });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, emailOrPhone, password } = req.body;

    if (!name || !emailOrPhone || !password) {
      res.status(400).json({
        success: false,
        message: 'অনুগ্রহ করে নাম, ইমেইল/ফোন নম্বর এবং পাসওয়ার্ড প্রদান করুন।',
      });
      return;
    }

    const existingUser = await User.findOne({ emailOrPhone: emailOrPhone.toLowerCase() });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'এই ইমেইল বা ফোন নম্বর দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট রয়েছে।',
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      emailOrPhone: emailOrPhone.toLowerCase(),
      passwordHash,
      role: 'user',
    });

    const token = generateToken(newUser._id.toString());

    res.status(201).json({
      success: true,
      message: 'সফলভাবে অ্যাকাউন্ট তৈরি হয়েছে!',
      data: {
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          emailOrPhone: newUser.emailOrPhone,
          role: newUser.role,
        },
      },
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Registration error';
    res.status(500).json({
      success: false,
      message: 'রেজিস্ট্রেশন প্রক্রিয়ায় সমস্যা হয়েছে।',
      error: errorMsg,
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      res.status(400).json({
        success: false,
        message: 'ইমেইল/ফোন এবং পাসওয়ার্ড প্রদান করুন।',
      });
      return;
    }

    const user = await User.findOne({ emailOrPhone: emailOrPhone.toLowerCase() });
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'ভুল ইমেইল/ফোন বা পাসওয়ার্ড!',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'ভুল ইমেইল/ফোন বা পাসওয়ার্ড!',
      });
      return;
    }

    const token = generateToken(user._id.toString());

    res.status(200).json({
      success: true,
      message: 'সফলভাবে লগইন হয়েছে!',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          emailOrPhone: user.emailOrPhone,
          role: user.role,
        },
      },
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Login error';
    res.status(500).json({
      success: false,
      message: 'লগইন ব্যর্থ হয়েছে।',
      error: errorMsg,
    });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'অননুমোদিত রিকোয়েস্ট' });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: req.user._id,
        name: req.user.name,
        emailOrPhone: req.user.emailOrPhone,
        role: req.user.role,
        avatarUrl: req.user.avatarUrl,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'User fetch error';
    res.status(500).json({
      success: false,
      message: 'ইউজার তথ্য লোড করতে ব্যর্থ হয়েছে।',
      error: errorMsg,
    });
  }
};

export const syncOAuthUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, avatarUrl } = req.body;

    if (!email) {
      res.status(400).json({ success: false, message: 'ইমেইল আবশ্যক।' });
      return;
    }

    let user = await User.findOne({ emailOrPhone: email.toLowerCase() });

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(Math.random().toString(36), salt);
      user = await User.create({
        name: name || email.split('@')[0],
        emailOrPhone: email.toLowerCase(),
        passwordHash,
        avatarUrl: avatarUrl || '',
        role: email.toLowerCase() === 'admin@politicalposter.bd' ? 'admin' : 'user',
      });
    } else {
      if (avatarUrl && !user.avatarUrl) {
        user.avatarUrl = avatarUrl;
        await user.save();
      }
    }

    const token = generateToken(user._id.toString());

    res.status(200).json({
      success: true,
      message: 'OAuth ইউজার সফলভাবে সিঙ্ক হয়েছে।',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          emailOrPhone: user.emailOrPhone,
          role: user.role,
          avatarUrl: user.avatarUrl,
        },
      },
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'OAuth sync error';
    res.status(500).json({
      success: false,
      message: 'OAuth সিঙ্ক্রোনাইজেশনে সমস্যা হয়েছে।',
      error: errorMsg,
    });
  }
};

