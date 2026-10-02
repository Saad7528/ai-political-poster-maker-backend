import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.js';
import { Poster } from '../models/Poster.js';
import { Template } from '../models/Template.js';
import { PosterRenderService } from '../services/renderService.js';

export const createPoster = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'অননুমোদিত রিকোয়েস্ট' });
      return;
    }

    const {
      templateId,
      formData,
      topLeadersPhotos,
      candidatePhotoUrl,
      partySymbolUrl,
      aiEnhanced,
    } = req.body;

    if (!templateId || !formData || !formData.candidateName || !formData.headline) {
      res.status(400).json({
        success: false,
        message: 'প্রয়োজনীয় ফিল্ডগুলো পূরণ করুন (নাম, হেডলাইন, টেমপ্লেট ইত্যাদি)।',
      });
      return;
    }

    const template = await Template.findById(templateId);
    if (!template) {
      res.status(404).json({
        success: false,
        message: 'নির্বাচিত টেমপ্লেট খুঁজে পাওয়া যায়নি।',
      });
      return;
    }

    const newPoster = await Poster.create({
      userId,
      templateId,
      formData,
      topLeadersPhotos: topLeadersPhotos || [],
      candidatePhotoUrl: candidatePhotoUrl || '',
      partySymbolUrl: partySymbolUrl || '',
      status: 'generating',
      aiEnhanced: !!aiEnhanced,
    });

    try {
      const generatedImageUrl = await PosterRenderService.renderPoster(newPoster, template);
      newPoster.generatedImageUrl = generatedImageUrl;
      newPoster.status = 'completed';
      await newPoster.save();

      res.status(201).json({
        success: true,
        message: 'পোস্টার সফলভাবে তৈরি হয়েছে!',
        data: newPoster,
      });
    } catch (renderError: unknown) {
      const renderErrorMsg = renderError instanceof Error ? renderError.message : 'Render failed';
      console.error('Poster Render Pipeline error:', renderErrorMsg);
      newPoster.status = 'failed';
      newPoster.errorMessage = renderErrorMsg;
      await newPoster.save();

      res.status(500).json({
        success: false,
        message: 'পোস্টার ইমেজ রেন্ডারিং ব্যর্থ হয়েছে।',
        error: renderErrorMsg,
        data: newPoster,
      });
    }
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Poster creation failed';
    res.status(500).json({
      success: false,
      message: 'পোস্টার রিকোয়েস্ট প্রসেস করতে ব্যর্থ হয়েছে।',
      error: errorMsg,
    });
  }
};

export const getPosterById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const poster = await Poster.findById(id).populate('templateId');

    if (!poster) {
      res.status(404).json({
        success: false,
        message: 'পোস্টারটি খুঁজে পাওয়া যায়নি।',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: poster,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to fetch poster';
    res.status(500).json({
      success: false,
      message: 'পোস্টার লোড করতে সমস্যা হয়েছে।',
      error: errorMsg,
    });
  }
};

export const getUserPosters = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId || req.user?._id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'অননুমোদিত রিকোয়েস্ট' });
      return;
    }

    const posters = await Poster.find({ userId })
      .populate('templateId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posters.length,
      data: posters,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to fetch user posters';
    res.status(500).json({
      success: false,
      message: 'পোস্টার হিস্ট্রি লোড করা যায়নি।',
      error: errorMsg,
    });
  }
};

export const regeneratePoster = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { formData, topLeadersPhotos, candidatePhotoUrl, partySymbolUrl } = req.body;

    const poster = await Poster.findById(id);
    if (!poster) {
      res.status(404).json({
        success: false,
        message: 'পোস্টারটি পাওয়া যায়নি।',
      });
      return;
    }

    if (poster.retryCount >= 10) {
      res.status(400).json({
        success: false,
        message: 'আপনি এই পোস্টারের জন্য সর্বোচ্চ রিজেনারেশন সীমা অতিক্রম করেছেন।',
      });
      return;
    }

    if (formData) poster.formData = { ...poster.formData, ...formData };
    if (topLeadersPhotos) poster.topLeadersPhotos = topLeadersPhotos;
    if (candidatePhotoUrl) poster.candidatePhotoUrl = candidatePhotoUrl;
    if (partySymbolUrl) poster.partySymbolUrl = partySymbolUrl;

    poster.retryCount += 1;
    poster.status = 'generating';
    await poster.save();

    const template = await Template.findById(poster.templateId);
    const generatedImageUrl = await PosterRenderService.renderPoster(poster, template);

    poster.generatedImageUrl = generatedImageUrl;
    poster.status = 'completed';
    await poster.save();

    res.status(200).json({
      success: true,
      message: 'পোস্টার সফলভাবে পুনরায় তৈরি (Regenerate) হয়েছে!',
      data: poster,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Regenerate failed';
    res.status(500).json({
      success: false,
      message: 'পোস্টার রিজেনারেট করতে সমস্যা হয়েছে।',
      error: errorMsg,
    });
  }
};

export const deletePoster = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const poster = await Poster.findById(id);

    if (!poster) {
      res.status(404).json({ success: false, message: 'পোস্টার পাওয়া যায়নি।' });
      return;
    }

    await Poster.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'পোস্টারটি সফলভাবে মুছে ফেলা হয়েছে।',
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

export const getAllPostersAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const posters = await Poster.find()
      .populate('userId', 'name emailOrPhone')
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
      message: 'মডারেশন তালিকা লোড করা যায়নি।',
      error: errorMsg,
    });
  }
};
