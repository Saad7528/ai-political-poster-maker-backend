import { Router } from 'express';
import { generatePoliticalCopy } from '../controllers/aiController.js';
import { optionalAuth } from '../middlewares/auth.js';

const router = Router();

router.post('/generate-copy', optionalAuth, generatePoliticalCopy);
router.post('/generate-slogan', optionalAuth, generatePoliticalCopy);

export default router;
