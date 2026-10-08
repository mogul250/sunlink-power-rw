import express from 'express';
import {
  getAllResources,
  getDownloadResources,
  createResource,
  updateResource,
  deleteResource
} from '../controllers/resourceController.js';
import { authenticateToken } from '../middleware/auth.js';
import { uploadResourceFiles, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAllResources);
router.get('/downloads', getDownloadResources);

// Protected routes
router.post(
  '/',
  authenticateToken,
  uploadResourceFiles,
  handleUploadError,
  createResource
);

router.put(
  '/:id',
  authenticateToken,
  uploadResourceFiles,
  handleUploadError,
  updateResource
);

router.delete('/:id', authenticateToken, deleteResource);

export default router;
