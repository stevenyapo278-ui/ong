import { Router } from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Liste des catégories (public pour le filtre actualités et les formulaires)
router.get('/', getCategories);

// CRUD réservé aux admins et éditeurs
router.post('/', protect, authorize('ADMIN', 'EDITOR'), createCategory);
router.put('/:id', protect, authorize('ADMIN', 'EDITOR'), updateCategory);
router.delete('/:id', protect, authorize('ADMIN', 'EDITOR'), deleteCategory);

export default router;
