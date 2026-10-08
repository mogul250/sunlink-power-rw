import express from 'express';
import {
  login,
  register,
  getProfile,
  updateProfile,
  getAllAdmins,
  updateAdminStatus,
  deleteAdmin
} from '../controllers/adminController.js';
import { authenticateToken, isSuperAdmin } from '../middleware/auth.js';
import { promisePool } from '../config/db.js';

const router = express.Router();

// Public routes
router.post('/login', login);

// Check if this is first admin registration (no auth required for first admin)
router.post('/register', async (req, res, next) => {
  try {
    const [result] = await promisePool.query('SELECT COUNT(*) as count FROM Admins');
    
    // If no admins exist, allow registration without auth
    if (result[0].count === 0) {
      next();
    } else {
      // Otherwise, require super admin authentication
      authenticateToken(req, res, () => {
        isSuperAdmin(req, res, next);
      });
    }
  } catch (error) {
    next(error);
  }
}, register);

// Protected routes (require authentication)
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

// Super admin only routes
router.get('/users', authenticateToken, isSuperAdmin, getAllAdmins);
router.put('/users/:id/status', authenticateToken, isSuperAdmin, updateAdminStatus);
router.delete('/users/:id', authenticateToken, isSuperAdmin, deleteAdmin);

export default router;
