import express from 'express';
import {
  getApprovedTestimonials,
  getAllTestimonials,
  createTestimonial,
  approveTestimonial,
  deleteTestimonial
} from '../controllers/testimonialController.js';
import { authenticateToken } from '../middleware/auth.js';
import { uploadTestimonialFiles, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getApprovedTestimonials); // For TrustSection
router.post(
  '/', 
  uploadTestimonialFiles, 
  handleUploadError, 
  createTestimonial
); // For Submission Form

// Admin routes
router.get('/all', authenticateToken, getAllTestimonials); // For Admin Dashboard
router.put('/:id/approve', authenticateToken, approveTestimonial);
router.delete('/:id', authenticateToken, deleteTestimonial);

export default router;