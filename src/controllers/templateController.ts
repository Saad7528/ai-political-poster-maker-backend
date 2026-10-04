import { Request, Response } from 'express';
import { Template } from '../models/Template';

export const getTemplates = async (req: Request, res: Response): Promise<void> => {
  try {
    const { occasion } = req.query;
    const filter: Record<string, unknown> = { isActive: true };

    if (occasion && typeof occasion === 'string' && occasion !== 'all') {
      filter.occasionType = occasion;
    }

    const templates = await Template.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: templates.length,
      data: templates,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to fetch templates';
    res.status(500).json({
      success: false,
      message: 'টেমপ্লেট তালিকা লোড করা যায়নি।',
      error: errorMsg,
    });
  }
};

export const getTemplateById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const template = await Template.findById(id);

    if (!template) {
      res.status(404).json({
        success: false,
        message: 'টেমপ্লেটটি খুঁজে পাওয়া যায়নি।',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: template,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to fetch template';
    res.status(500).json({
      success: false,
      message: 'টেমপ্লেট লোড করতে সমস্যা হয়েছে।',
      error: errorMsg,
    });
  }
};

export const createTemplate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, banglaTitle, occasionType, thumbnailUrl, layoutConfig, recommendedParties } = req.body;

    if (!title || !banglaTitle || !occasionType || !layoutConfig) {
      res.status(400).json({ success: false, message: 'প্রয়োজনীয় ফিল্ডগুলো পূরণ করুন।' });
      return;
    }

    const template = await Template.create({
      title,
      banglaTitle,
      occasionType,
      thumbnailUrl: thumbnailUrl || '',
      layoutConfig,
      recommendedParties: recommendedParties || [],
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'টেমপ্লেট সফলভাবে তৈরি হয়েছে!',
      data: template,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to create template';
    res.status(500).json({ success: false, message: 'টেমপ্লেট তৈরিতে ত্রুটি।', error: errorMsg });
  }
};

export const updateTemplate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await Template.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      res.status(404).json({ success: false, message: 'টেমপ্লেট পাওয়া যায়নি।' });
      return;
    }

    res.status(200).json({ success: true, message: 'টেমপ্লেট আপডেট হয়েছে!', data: updated });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to update template';
    res.status(500).json({ success: false, message: 'টেমপ্লেট আপডেটে ত্রুটি।', error: errorMsg });
  }
};

export const deleteTemplate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Template.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ success: false, message: 'টেমপ্লেট পাওয়া যায়নি।' });
      return;
    }

    res.status(200).json({ success: true, message: 'টেমপ্লেট সফলভাবে মুছে ফেলা হয়েছে।' });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Failed to delete template';
    res.status(500).json({ success: false, message: 'টেমপ্লেট মুছতে ত্রুটি।', error: errorMsg });
  }
};
