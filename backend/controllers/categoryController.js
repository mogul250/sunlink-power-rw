import { promisePool } from '../config/db.js';

const CATEGORY_PRIORITY_ORDER = [
  'solar-panels',
  'batteries',
  'hybrid-inverters',
  'string-inverters',
  'off-grid-inverters',
  'microinverters',
  'solar-street-lights',
  'solar-flood-lights',
  'solar-garden-lights',
  'solar-strip-lights',
  'solar-batten-lights',
  'solar-fans',
  'solar-water-pumps',
  'ev-chargers',
  'charge-controllers',
  'combiner-boxes',
  'power-conversion-systems',
  'bipv-carports',
  'energy-management-systems',
  'accessories'
];

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getAllCategories = async (req, res, next) => {
  try {
    const priorityCase = CATEGORY_PRIORITY_ORDER
      .map((slug, index) => `WHEN '${slug}' THEN ${index}`)
      .join(' ');

    const [categories] = await promisePool.query(
      `SELECT *
       FROM Categories
       ORDER BY
         CASE slug
           ${priorityCase}
           ELSE 999
         END,
         name ASC`
    );

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category by slug with products
// @route   GET /api/categories/:slug
// @access  Public
const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // Get category
    const [categories] = await promisePool.query(
      'SELECT * FROM Categories WHERE slug = ? or id = ?',
      [slug, slug]
    );

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const category = categories[0];

    // Get products in this category
    const [products] = await promisePool.query(
      'SELECT * FROM Products WHERE category_id = ? ORDER BY name ASC',
      [category.id]
    );

    res.status(200).json({
      success: true,
      data: {
        ...category,
        products
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
  try {
    const { name, description, slug } = req.body;
    let image_url = req.body.image_url;

    // If file was uploaded, use the uploaded file path
    if (req.file) {
      image_url = `/uploads/categories/${req.file.filename}`;
    }

    // Validate required fields
    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and slug'
      });
    }

    // Insert category
    const [result] = await promisePool.query(
      'INSERT INTO Categories (name, description, image_url, slug) VALUES (?, ?, ?, ?)',
      [name, description, image_url, slug]
    );

    // Get the created category
    const [newCategory] = await promisePool.query(
      'SELECT * FROM Categories WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: newCategory[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, slug } = req.body;
    let image_url = req.body.image_url;

    // If file was uploaded, use the uploaded file path
    if (req.file) {
      image_url = `/uploads/categories/${req.file.filename}`;
    }

    // Check if category exists
    const [existing] = await promisePool.query(
      'SELECT * FROM Categories WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (name) {
      updates.push('name = ?');
      values.push(name);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (image_url) {
      updates.push('image_url = ?');
      values.push(image_url);
    }
    if (slug) {
      updates.push('slug = ?');
      values.push(slug);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    values.push(id);

    await promisePool.query(
      `UPDATE Categories SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    // Get updated category
    const [updated] = await promisePool.query(
      'SELECT * FROM Categories WHERE id = ?',
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: updated[0]
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const [existing] = await promisePool.query(
      'SELECT * FROM Categories WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has products
    const [products] = await promisePool.query(
      'SELECT COUNT(*) as count FROM Products WHERE category_id = ?',
      [id]
    );

    if (products[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing products. Please delete or reassign products first.'
      });
    }

    // Delete category
    await promisePool.query('DELETE FROM Categories WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
};
