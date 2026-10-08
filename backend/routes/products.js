import express from 'express';
import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage
} from '../controllers/productController.js';
import { authenticateToken } from '../middleware/auth.js';
import { uploadProductFiles, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.get('/category/:categoryId', getProductsByCategory);

// Protected routes (Admin only)
router.post(
  '/',
  authenticateToken,
  uploadProductFiles,
  handleUploadError,
  createProduct
);

router.put(
  '/:id',
  authenticateToken,
  uploadProductFiles,
  handleUploadError,
  updateProduct
);

router.delete('/:id', authenticateToken, deleteProduct);

router.delete('/images/:imageId', authenticateToken, deleteProductImage);

export default router;
