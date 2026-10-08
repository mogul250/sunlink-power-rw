import { promisePool } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      });
    }

    // Check if admin exists
    const [admins] = await promisePool.query(
      'SELECT * FROM Admins WHERE username = ? AND is_active = 1',
      [username]
    );

    if (admins.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const admin = admins[0];
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await promisePool.query(
      'UPDATE Admins SET last_login = NOW() WHERE id = ?',
      [admin.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        role: admin.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE || '7d'
      }
    );

    // Remove password from response
    delete admin.password_hash;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      data: admin
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register new admin (first admin or super admin only)
// @route   POST /api/admin/register
// @access  Private/Super Admin
const register = async (req, res, next) => {
  try {
    const { username, password, email, full_name, role } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      });
    }

    // Check if this is the first admin
    const [existingAdmins] = await promisePool.query(
      'SELECT COUNT(*) as count FROM Admins'
    );

    const isFirstAdmin = existingAdmins[0].count === 0;

    // If not first admin, check if requester is super admin
    if (!isFirstAdmin && req.admin && req.admin.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super admins can create new admin accounts'
      });
    }

    // Check if username already exists
    const [existing] = await promisePool.query(
      'SELECT id FROM Admins WHERE username = ?',
      [username]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Set role (first admin is always super_admin)
    const adminRole = isFirstAdmin ? 'super_admin' : (role || 'admin');

    // Insert new admin
    const [result] = await promisePool.query(
      `INSERT INTO Admins (username, password_hash, email, full_name, role) 
       VALUES (?, ?, ?, ?, ?)`,
      [username, password_hash, email, full_name, adminRole]
    );

    // Get the created admin
    const [newAdmin] = await promisePool.query(
      'SELECT id, username, email, full_name, role, is_active, created_at FROM Admins WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      data: newAdmin[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private/Admin
const getProfile = async (req, res, next) => {
  try {
    const [admins] = await promisePool.query(
      'SELECT id, username, email, full_name, role, is_active, last_login, created_at FROM Admins WHERE id = ?',
      [req.admin.id]
    );

    if (admins.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.status(200).json({
      success: true,
      data: admins[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private/Admin
const updateProfile = async (req, res, next) => {
  try {
    const { email, full_name, current_password, new_password } = req.body;

    // Build update query
    const updates = [];
    const values = [];

    if (email) {
      updates.push('email = ?');
      values.push(email);
    }

    if (full_name) {
      updates.push('full_name = ?');
      values.push(full_name);
    }

    // Handle password change
    if (new_password) {
      if (!current_password) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required to set a new password'
        });
      }

      // Verify current password
      const [admins] = await promisePool.query(
        'SELECT password_hash FROM Admins WHERE id = ?',
        [req.admin.id]
      );

      const isPasswordValid = await bcrypt.compare(
        current_password,
        admins[0].password_hash
      );

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(new_password, salt);

      updates.push('password_hash = ?');
      values.push(password_hash);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(req.admin.id);

    await promisePool.query(
      `UPDATE Admins SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Get updated profile
    const [updated] = await promisePool.query(
      'SELECT id, username, email, full_name, role, is_active, last_login, created_at FROM Admins WHERE id = ?',
      [req.admin.id]
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updated[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all admins
// @route   GET /api/admin/users
// @access  Private/Super Admin
const getAllAdmins = async (req, res, next) => {
  try {
    const [admins] = await promisePool.query(
      'SELECT id, username, email, full_name, role, is_active, last_login, created_at FROM Admins ORDER BY created_at DESC'
    );

    res.status(200).json({
      success: true,
      count: admins.length,
      data: admins
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update admin status
// @route   PUT /api/admin/users/:id/status
// @access  Private/Super Admin
const updateAdminStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (is_active === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide is_active status'
      });
    }

    // Prevent deactivating yourself
    if (parseInt(id) === req.admin.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own account'
      });
    }

    // Check if admin exists
    const [existing] = await promisePool.query(
      'SELECT id FROM Admins WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Update status
    await promisePool.query(
      'UPDATE Admins SET is_active = ? WHERE id = ?',
      [is_active ? 1 : 0, id]
    );

    // Get updated admin
    const [updated] = await promisePool.query(
      'SELECT id, username, email, full_name, role, is_active, last_login, created_at FROM Admins WHERE id = ?',
      [id]
    );

    res.status(200).json({
      success: true,
      message: `Admin ${is_active ? 'activated' : 'deactivated'} successfully`,
      data: updated[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete admin
// @route   DELETE /api/admin/users/:id
// @access  Private/Super Admin
const deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent deleting yourself
    if (parseInt(id) === req.admin.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    // Check if admin exists
    const [existing] = await promisePool.query(
      'SELECT id FROM Admins WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Delete admin
    await promisePool.query('DELETE FROM Admins WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export {
  login,
  register,
  getProfile,
  updateProfile,
  getAllAdmins,
  updateAdminStatus,
  deleteAdmin
};
