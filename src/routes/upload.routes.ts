import { Router } from 'express';
import { upload } from '../middlewares/upload.js';
import { handleSingleUpload, handleMultipleUpload } from '../controllers/uploadController.js';

const router = Router();

router.post('/', upload.single('photo'), handleSingleUpload);
router.post('/single', upload.single('photo'), handleSingleUpload);
router.post('/multiple', upload.array('photos', 5), handleMultipleUpload);

export default router;
