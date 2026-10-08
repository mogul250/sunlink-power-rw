import express from 'express';
import {
  getAllKits,
  getKitById,
  createKit,
  updateKit,
  deleteKit,
  deleteKitImage
} from '../controllers/kitController.js';
import { authenticateToken } from '../middleware/auth.js';
import { uploadKitFiles, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAllKits);
router.get('/:id', getKitById);

// Protected routes (Admin only)
router.post(
  '/',
  authenticateToken,
  uploadKitFiles,
  handleUploadError,
  createKit
);

router.put(
  '/:id',
  authenticateToken,
  uploadKitFiles,
  handleUploadError,
  updateKit
);

router.delete('/:id', authenticateToken, deleteKit);

router.delete('/images/:imageId', authenticateToken, deleteKitImage);

export default router;
