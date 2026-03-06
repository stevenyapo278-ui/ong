import { Router } from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  getPostBySlug,
  submitPostForReview,
  validatePost,
  deletePost,
  duplicatePost,
} from '../controllers/postController';
import { updatePost } from '../controllers/postUpdateController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getPosts);
router.get('/slug/:slug', getPostBySlug);
router.get('/:id', getPostById);

// Protected routes
router.post('/', protect, authorize('ADMIN', 'EDITOR', 'CONTRIBUTOR'), createPost);
router.put('/:id', protect, authorize('ADMIN', 'EDITOR', 'CONTRIBUTOR'), updatePost);
router.put('/:id/submit', protect, authorize('ADMIN', 'EDITOR', 'CONTRIBUTOR'), submitPostForReview);
router.put('/:id/validate', protect, authorize('ADMIN'), validatePost);
router.post('/:id/duplicate', protect, authorize('ADMIN', 'EDITOR', 'CONTRIBUTOR'), duplicatePost);
router.delete('/:id', protect, authorize('ADMIN', 'EDITOR'), deletePost);

export default router;
