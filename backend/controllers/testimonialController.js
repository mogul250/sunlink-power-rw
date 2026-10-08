import { promisePool } from '../config/db.js';

// @desc    Get approved testimonials (Public)
// @route   GET /api/testimonials
// @access  Public
const getApprovedTestimonials = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    
    const [testimonials] = await promisePool.query(
      'SELECT * FROM Testimonials WHERE is_approved = TRUE ORDER BY rating DESC, created_at DESC LIMIT ?',
      [parseInt(limit)]
    );

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all testimonials (Admin)
// @route   GET /api/testimonials/all
// @access  Private/Admin
const getAllTestimonials = async (req, res, next) => {
  try {
    const [testimonials] = await promisePool.query(
      'SELECT * FROM Testimonials ORDER BY created_at DESC'
    );

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new testimonial
// @route   POST /api/testimonials
// @access  Public
const createTestimonial = async (req, res, next) => {
  try {
    const { client_name, country, content, rating, video_url } = req.body;
    
    let before_image_url = null;
    let after_image_url = null;

    // Handle file uploads
    if (req.files) {
      if (req.files.before_image) {
        before_image_url = `/uploads/testimonials/${req.files.before_image[0].filename}`;
      }
      if (req.files.after_image) {
        after_image_url = `/uploads/testimonials/${req.files.after_image[0].filename}`;
      }
    }

    if (!client_name || !content || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, content and rating'
      });
    }

    const [result] = await promisePool.query(
      `INSERT INTO Testimonials 
       (client_name, country, content, rating, video_url, before_image_url, after_image_url, is_approved) 
       VALUES (?, ?, ?, ?, ?, ?, ?, FALSE)`,
      [client_name, country, content, rating, video_url, before_image_url, after_image_url]
    );

    res.status(201).json({
      success: true,
      message: 'Testimonial submitted successfully and pending approval',
      data: { id: result.insertId }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a testimonial
// @route   PUT /api/testimonials/:id/approve
// @access  Private/Admin
const approveTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;

    await promisePool.query(
      'UPDATE Testimonials SET is_approved = TRUE WHERE id = ?',
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'Testimonial approved'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
const deleteTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;

    await promisePool.query(
      'DELETE FROM Testimonials WHERE id = ?',
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted'
    });
  } catch (error) {
    next(error);
  }
};

export {
  getApprovedTestimonials,
  getAllTestimonials,
  createTestimonial,
  approveTestimonial,
  deleteTestimonial
};