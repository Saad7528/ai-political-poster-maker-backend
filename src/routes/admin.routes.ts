import { Router } from 'express';
import { createTemplate, updateTemplate, deleteTemplate } from '../controllers/templateController.js';
import { getAllPostersAdmin } from '../controllers/posterController.js';
import { authenticate, requireAdmin } from '../middlewares/auth.js';

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

router.post('/templates', createTemplate);
router.patch('/templates/:id', updateTemplate);
router.delete('/templates/:id', deleteTemplate);
router.get('/posters', getAllPostersAdmin);

export default router;
