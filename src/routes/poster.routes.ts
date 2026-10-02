import { Router } from 'express';
import {
  createPoster,
  getPosterById,
  getUserPosters,
  regeneratePoster,
  deletePoster,
} from '../controllers/posterController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.use(authenticate);

router.post('/', createPoster);
router.get('/:id', getPosterById);
router.get('/user/:userId', getUserPosters);
router.post('/:id/regenerate', regeneratePoster);
router.delete('/:id', deletePoster);

export default router;
