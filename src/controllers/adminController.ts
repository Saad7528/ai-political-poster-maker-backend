import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth';
import { User } from '../models/User';
import { Poster } from '../models/Poster';
import { Template } from '../models/Template';

export const getAdminStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosters = await Poster.countDocuments();
    const completedPosters = await Poster.countDocuments({ status: 'completed' });
    const flaggedPosters = await Poster.countDocuments({ isFlagged: true });
    const totalTemplates = await Template.countDocuments();

    // Recent 5 posters
    const recentPosters = await Poster.find()
      .populate('userId', 'name emailOrPhone')
      .populate('templateId', 'banglaTitle title')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalPosters,
        completedPosters,
        flaggedPosters,
        totalTemplates,
        recentPosters,
      },
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to fetch admin stats';
    res.status(500).json({
      success: false,
      message: 'পরিসংখ্যান লোড করতে ব্যর্থ হয়েছে।',
      error: errorMsg,
    });
  }
};

export const getAllPostersAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, flagged, search } = req.query;
    const filter: Record<string, unknown> = {};

    if (status && typeof status === 'string' && status !== 'all') {
      filter.status = status;
    }

    if (flagged === 'true') {
      filter.isFlagged = true;
    }

    if (search && typeof search === 'string') {
      filter.$or = [
        { 'formData.candidateName': { $regex: search, $options: 'i' } },
        { 'formData.headline': { $regex: search, $options: 'i' } },
        { 'formData.organizationOrParty': { $regex: search, $options: 'i' } },
      ];
    }

    const posters = await Poster.find(filter)
      .populate('userId', 'name emailOrPhone role')
      .populate('templateId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posters.length,
      data: posters,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to fetch admin posters';
    res.status(500).json({
      success: false,
      message: 'পোস্টার মডারেশন তালিকা লোড করা যায়নি।',
      error: errorMsg,
    });
  }
};

export const flagPoster = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isFlagged, flagReason } = req.body;

    const poster = await Poster.findById(id);
    if (!poster) {
      res.status(404).json({ success: false, message: 'পোস্টার পাওয়া যায়নি।' });
      return;
    }

    poster.isFlagged = Boolean(isFlagged);
    if (flagReason !== undefined) {
      poster.flagReason = flagReason;
    }
    await poster.save();

    res.status(200).json({
      success: true,
      message: poster.isFlagged ? 'পোস্টারটি আপত্তিকর কনটেন্ট হিসেবে ফ্ল্যাগ করা হয়েছে।' : 'পোস্টারের ফ্ল্যাগ তুলে নেওয়া হয়েছে।',
      data: poster,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to flag poster';
    res.status(500).json({
      success: false,
      message: 'পোস্টার ফ্ল্যাগিং প্রক্রিয়ায় সমস্যা হয়েছে।',
      error: errorMsg,
    });
  }
};

export const deletePosterAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Poster.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ success: false, message: 'পোস্টার পাওয়া যায়নি।' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'পোস্টারটি স্থায়ীভাবে মুছে ফেলা হয়েছে।',
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Delete failed';
    res.status(500).json({
      success: false,
      message: 'পোস্টার মুছতে সমস্যা হয়েছে।',
      error: errorMsg,
    });
  }
};

export const getAllUsersAdmin = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to fetch users';
    res.status(500).json({
      success: false,
      message: 'ইউজার তালিকা লোড করা যায়নি।',
      error: errorMsg,
    });
  }
};
