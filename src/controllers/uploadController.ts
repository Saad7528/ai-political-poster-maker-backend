import { Request, Response } from 'express';

export const handleSingleUpload = (req: Request, res: Response): void => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'কোনো ফাইল আপলোড করা হয়নি।' });
      return;
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(200).json({
      success: true,
      message: 'ফাইল সফলভাবে আপলোড হয়েছে!',
      data: {
        url: fileUrl,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Upload failed';
    res.status(500).json({
      success: false,
      message: 'ফাইল আপলোড ব্যর্থ হয়েছে।',
      error: errorMsg,
    });
  }
};

export const handleMultipleUpload = (req: Request, res: Response): void => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      res.status(400).json({ success: false, message: 'কোনো ফাইল পাওয়া যায়নি।' });
      return;
    }

    const uploadedFiles = files.map((file) => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
    }));

    res.status(200).json({
      success: true,
      message: `${files.length} টি ফাইল সফলভাবে আপলোড হয়েছে!`,
      data: uploadedFiles,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Multiple upload failed';
    res.status(500).json({
      success: false,
      message: 'একাধিক ফাইল আপলোড ব্যর্থ হয়েছে।',
      error: errorMsg,
    });
  }
};
