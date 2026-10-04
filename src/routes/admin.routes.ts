import { Router } from 'express';
import {
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from '../controllers/templateController';
import {
  getAdminStats,
  getAllPostersAdmin,
  flagPoster,
  deletePosterAdmin,
  getAllUsersAdmin,
} from '../controllers/adminController';
import { authenticate, requireAdmin } from '../middlewares/auth';

const router = Router();

// Protect all admin routes
router.use(authenticate);
router.use(requireAdmin);

// Dashboard & Stats
router.get('/stats', getAdminStats);

// Templates Management
router.post('/templates', createTemplate);
router.patch('/templates/:id', updateTemplate);
router.delete('/templates/:id', deleteTemplate);

// Posters Moderation
router.get('/posters', getAllPostersAdmin);
router.patch('/posters/:id/flag', flagPoster);
router.delete('/posters/:id', deletePosterAdmin);

// Users Management
router.get('/users', getAllUsersAdmin);

export default router;

