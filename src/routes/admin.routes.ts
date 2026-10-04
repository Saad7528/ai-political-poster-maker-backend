import { Router } from 'express';
import { createTemplate, updateTemplate, deleteTemplate } from '../controllers/templateController';
import { getAllPostersAdmin } from '../controllers/posterController';
import { authenticate, requireAdmin } from '../middlewares/auth';

const router = Router();

router.use(authenticate);
router.use(requireAdmin);

router.post('/templates', createTemplate);
router.patch('/templates/:id', updateTemplate);
router.delete('/templates/:id', deleteTemplate);
router.get('/posters', getAllPostersAdmin);

export default router;
