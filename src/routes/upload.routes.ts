import { Router } from 'express';
import { upload } from '../middlewares/upload';
import { handleSingleUpload, handleMultipleUpload } from '../controllers/uploadController';

const router = Router();

router.post('/', upload.single('photo'), handleSingleUpload);
router.post('/single', upload.single('photo'), handleSingleUpload);
router.post('/multiple', upload.array('photos', 5), handleMultipleUpload);

export default router;
