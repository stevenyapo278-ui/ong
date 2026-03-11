import { Router } from 'express';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Public route - Get testimonials
router.get('/', getTestimonials);

// Admin/Editor routes
router.post('/', protect, authorize('ADMIN', 'EDITOR'), createTestimonial);
router.put('/:id', protect, authorize('ADMIN', 'EDITOR'), updateTestimonial);
router.delete('/:id', protect, authorize('ADMIN', 'EDITOR'), deleteTestimonial);

export default router;
