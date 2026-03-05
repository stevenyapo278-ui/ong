import { Router } from 'express';
import { getUsers, createUser, deleteUser } from '../controllers/userController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Toutes ces routes sont protégées et réservées aux admins
router.get('/', protect, authorize('ADMIN'), getUsers);
router.post('/', protect, authorize('ADMIN'), createUser);
router.delete('/:id', protect, authorize('ADMIN'), deleteUser);

export default router;
