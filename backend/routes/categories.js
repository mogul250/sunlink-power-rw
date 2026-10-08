import express from 'express';
import {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { authenticateToken } from '../middleware/auth.js';
import { uploadSingleImage, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAllCategories);
router.get('/:slug', getCategoryBySlug);

// Protected routes (Admin only)
router.post(
  '/',
  authenticateToken,
  uploadSingleImage,
  handleUploadError,
  createCategory
);

router.put(
  '/:id',
  authenticateToken,
  uploadSingleImage,
  handleUploadError,
  updateCategory
);

router.delete('/:id', authenticateToken, deleteCategory);

export default router;
