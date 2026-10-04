import { Router } from 'express';
import { generatePoliticalCopy } from '../controllers/aiController';
import { optionalAuth } from '../middlewares/auth';

const router = Router();

router.post('/generate-copy', optionalAuth, generatePoliticalCopy);
router.post('/generate-slogan', optionalAuth, generatePoliticalCopy);

export default router;
