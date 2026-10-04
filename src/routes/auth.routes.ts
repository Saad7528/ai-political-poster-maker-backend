import { Router } from 'express';
import { register, login, getMe, syncOAuthUser } from '../controllers/authController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/sync-oauth', syncOAuthUser);
router.get('/me', authenticate, getMe);

export default router;

