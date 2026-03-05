import { Router } from 'express';
import { register, login, changePassword, forgotPassword, resetPassword } from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/change-password', protect, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
