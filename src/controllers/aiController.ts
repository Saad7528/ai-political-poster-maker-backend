import { Response } from 'express';
import { GeminiService } from '../services/geminiService.js';
import { AuthRequest } from '../middlewares/auth.js';

export const generatePoliticalCopy = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      promptText,
      occasionType,
      candidateName,
      designation,
      party,
      district,
      unionOrThana,
      constituencyName,
      customKeywords,
    } = req.body;

    if (!promptText && (!occasionType || !party)) {
      res.status(400).json({
        success: false,
        message: 'অনুগ্রহ করে প্রম্পট লিখুন অথবা উপলক্ষ ও রাজনৈতিক দল নির্বাচন করুন।',
      });
      return;
    }

    const aiResult = await GeminiService.generatePoliticalCopy(
      {
        promptText,
        occasionType: occasionType || 'election_campaign',
        candidateName: candidateName || 'মো: রফিকুল ইসলাম',
        designation: designation || 'জননেতা ও সমাজসেবক',
        party: party || 'বাংলাদেশ জাতীয়তাবাদী দল',
        district,
        unionOrThana,
        constituencyName,
        customKeywords,
      },
      req.user?._id?.toString()
    );

    res.status(200).json({
      success: true,
      message: 'Gemini AI সফলভাবে রাজনৈতিক স্লোগান ও কন্টেন্ট তৈরি করেছে!',
      data: aiResult,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'AI Generation failed';
    res.status(500).json({
      success: false,
      message: 'এআই কন্টেন্ট জেনারেশন ব্যর্থ হয়েছে।',
      error: errorMsg,
    });
  }
};
