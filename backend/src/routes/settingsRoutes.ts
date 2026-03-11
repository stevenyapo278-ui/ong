import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.get('/', getSettings);
router.put('/', protect, authorize('ADMIN'), updateSettings);

export default router;
