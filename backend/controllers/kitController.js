import { promisePool } from '../config/db.js';

const validateSelectedModels = async (products) => {
  for (const product of products) {
    if (!product.product_model_id) continue;
    const [matches] = await promisePool.query(
      'SELECT id FROM ProductModels WHERE id = ? AND product_id = ?',
      [product.product_model_id, product.product_id]
    );
    if (matches.length === 0) {
      const error = new Error('A selected model does not belong to its product family');
      error.statusCode = 400;
      throw error;
    }
  }
};

const normalizeTechnicalSpecs = (value) => {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;

  let parsed;
  try {
    parsed = typeof value === 'string' ? JSON.parse(value) : value;
  } catch {
    const error = new Error('Technical specifications must contain valid JSON');
    error.statusCode = 400;
    throw error;
  }
  if (Array.isArray(parsed) || typeof parsed !== 'object') {
    const error = new Error('Technical specifications must be a JSON object');
    error.statusCode = 400;
    throw error;
  }
  return JSON.stringify(parsed);
};

const parseProductsPayload = (value, fallback = undefined) => {
  if (value === undefined) return fallback;
  if (value === null || value === '') return [];
  if (typeof value === 'string') return JSON.parse(value);
  return value;
};

// @desc    Get all kits
// @route   GET /api/kits
// @access  Public
const getAllKits = async (req, res, next) => {
  try {
    const { featured, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM Kits WHERE 1=1';
    const params = [];

    if (featured === 'true') {
      query += ' AND is_featured = 1';
    }

    query += ' ORDER BY is_featured DESC, created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [kits] = await promisePool.query(`
      SELECT k.*, COUNT(DISTINCT kp.product_id) as products_count
      FROM Kits k 
      LEFT JOIN KitProducts kp ON k.id = kp.kit_id 
      WHERE 1=1 ${featured === 'true' ? 'AND k.is_featured = 1' : ''}
      GROUP BY k.id
      ORDER BY k.is_featured DESC, k.created_at DESC 
      LIMIT ? OFFSET ?
    `, params);

    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM Kits WHERE 1=1`;
    if (featured === 'true') {
      countQuery += ' AND is_featured = 1';
    }
    const [countResult] = await promisePool.query(countQuery);

    res.status(200).json({
      success: true,
      count: kits.length,
      total: countResult[0].total,
      data: kits
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get kit by ID with products
// @route   GET /api/kits/:id
// @access  Public
const getKitById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get kit
    const [kits] = await promisePool.query(
      'SELECT * FROM Kits WHERE id = ? OR slug = ?',
      [id, id]
    );

    if (kits.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Kit not found'
      });
    }

    const kit = kits[0];

    // Get products in this kit
    const [kitProducts] = await promisePool.query(
      `SELECT p.*, kp.quantity, kp.sort_order, kp.product_model_id,
              pm.model_code, pm.display_name AS model_name, pm.nominal_power AS model_nominal_power
       FROM KitProducts kp
       JOIN Products p ON kp.product_id = p.id
       LEFT JOIN ProductModels pm ON kp.product_model_id = pm.id
       WHERE kp.kit_id = ?
       ORDER BY kp.sort_order ASC, p.name ASC`,
      [kit.id]
    );

    // Get kit gallery images
    const [kitImages] = await promisePool.query(
      'SELECT * FROM KitImages WHERE kit_id = ? ORDER BY sort_order ASC',
      [kit.id]
    );

    res.status(200).json({
      success: true,
      data: {
        ...kit,
        products: kitProducts,
        gallery_images: kitImages
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new kit
// @route   POST /api/kits
// @access  Private/Admin
const createKit = async (req, res, next) => {
  try {
    let { name, description, slug } = req.body;
    let products = parseProductsPayload(req.body.products, []);
    const technicalSpecs = normalizeTechnicalSpecs(req.body.technical_specs);
    let image_url = req.body.image_url;
    // Handle main image upload
    if (req.files && req.files['image']) {
      image_url = `/uploads/kits/${req.files['image'][0].filename}`;
    } else if (req.file) { // Fallback for single upload
      image_url = `/uploads/kits/${req.file.filename}`;
    }

    // Validate required fields
    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and slug'
      });
    }

    // Insert kit
    const [result] = await promisePool.query(
      'INSERT INTO Kits (name, description, image_url, slug, technical_specs) VALUES (?, ?, ?, ?, ?)',
      [name, description, image_url, slug, technicalSpecs || null]
    );

    const kitId = result.insertId;

    // Add products to kit if provided
    if (products.length > 0) {
      await validateSelectedModels(products);
      const productInserts = products.map((product, index) => [
        kitId,
        product.product_id,
        product.product_model_id || null,
        product.quantity || 1,
        index
      ]);

      await promisePool.query(
        'INSERT INTO KitProducts (kit_id, product_id, product_model_id, quantity, sort_order) VALUES ?',
        [productInserts]
      );
    }

    // Add gallery images if provided
    if (req.files && req.files['gallery_images']) {
      const imageInserts = req.files['gallery_images'].map((file, index) => [
        kitId,
        `/uploads/kits/${file.filename}`,
        `${name} - Gallery Image ${index + 1}`,
        index
      ]);

      if (imageInserts.length > 0) {
        await promisePool.query(
          'INSERT INTO KitImages (kit_id, image_url, alt_text, sort_order) VALUES ?',
          [imageInserts]
        );
      }
    }

    // Get the created kit with products
    const [newKit] = await promisePool.query(
      'SELECT * FROM Kits WHERE id = ?',
      [kitId]
    );

    const [kitProds] = await promisePool.query(
      `SELECT p.*, kp.quantity, kp.sort_order, kp.product_model_id,
              pm.model_code, pm.display_name AS model_name, pm.nominal_power AS model_nominal_power
       FROM KitProducts kp
       JOIN Products p ON kp.product_id = p.id
       LEFT JOIN ProductModels pm ON kp.product_model_id = pm.id
       WHERE kp.kit_id = ?
       ORDER BY kp.sort_order ASC`,
      [kitId]
    );

    const [kitImages] = await promisePool.query(
      'SELECT * FROM KitImages WHERE kit_id = ? ORDER BY sort_order ASC',
      [kitId]
    );

    res.status(201).json({
      success: true,
      message: 'Kit created successfully',
      data: {
        ...newKit[0],
        products: kitProds,
        gallery_images: kitImages
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update kit
// @route   PUT /api/kits/:id
// @access  Private/Admin
const updateKit = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { name, description, slug } = req.body;
    const products = parseProductsPayload(req.body.products);
    const technicalSpecs = normalizeTechnicalSpecs(req.body.technical_specs);
    let image_url = req.body.image_url;

    // Handle main image
    if (req.files && req.files['image']) {
      image_url = `/uploads/kits/${req.files['image'][0].filename}`;
    } else if (req.file) { // Fallback for single upload
      image_url = `/uploads/kits/${req.file.filename}`;
    }
    // Check if kit exists
    const [existing] = await promisePool.query(
      'SELECT * FROM Kits WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Kit not found'
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
    if (technicalSpecs !== undefined) {
      updates.push('technical_specs = ?');
      values.push(technicalSpecs);
    }

    if (updates.length > 0) {
      values.push(id);
      await promisePool.query(
        `UPDATE Kits SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    // Update kit products
    if (products !== undefined) {
      await validateSelectedModels(products);
      // Delete existing products
      await promisePool.query(
        'DELETE FROM KitProducts WHERE kit_id = ?',
        [id]
      );

      // Insert new products
      if (products.length > 0) {
        const productInserts = products.map((product, index) => [
          id,
          product.product_id,
          product.product_model_id || null,
          product.quantity || 1,
          index
        ]);

        await promisePool.query(
          'INSERT INTO KitProducts (kit_id, product_id, product_model_id, quantity, sort_order) VALUES ?',
          [productInserts]
        );
      }
    }

    // Add NEW gallery images if provided (append to existing)
    if (req.files && req.files['gallery_images']) {
      const [currentImages] = await promisePool.query('SELECT MAX(sort_order) as max_sort FROM KitImages WHERE kit_id = ?', [id]);
      let startSort = currentImages[0].max_sort !== null ? currentImages[0].max_sort + 1 : 0;

      const imageInserts = req.files['gallery_images'].map((file, index) => [
        id,
        `/uploads/kits/${file.filename}`,
        `${name || existing[0].name} - Gallery Image ${startSort + index + 1}`,
        startSort + index
      ]);

      if (imageInserts.length > 0) {
        await promisePool.query(
          'INSERT INTO KitImages (kit_id, image_url, alt_text, sort_order) VALUES ?',
          [imageInserts]
        );
      }
    }

    // Get updated kit
    const [updated] = await promisePool.query(
      'SELECT * FROM Kits WHERE id = ?',
      [id]
    );

    const [kitProds] = await promisePool.query(
      `SELECT p.*, kp.quantity, kp.sort_order, kp.product_model_id,
              pm.model_code, pm.display_name AS model_name, pm.nominal_power AS model_nominal_power
       FROM KitProducts kp
       JOIN Products p ON kp.product_id = p.id
       LEFT JOIN ProductModels pm ON kp.product_model_id = pm.id
       WHERE kp.kit_id = ?
       ORDER BY kp.sort_order ASC`,
      [id]
    );

    const [kitImages] = await promisePool.query(
      'SELECT * FROM KitImages WHERE kit_id = ? ORDER BY sort_order ASC',
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'Kit updated successfully',
      data: {
        ...updated[0],
        products: kitProds,
        gallery_images: kitImages
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete kit
// @route   DELETE /api/kits/:id
// @access  Private/Admin
const deleteKit = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if kit exists
    const [existing] = await promisePool.query(
      'SELECT * FROM Kits WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Kit not found'
      });
    }

    // Delete kit (cascade delete will remove kit products)
    await promisePool.query(
      'DELETE FROM Kits WHERE id = ?',
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'Kit deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete kit gallery image
// @route   DELETE /api/kits/images/:imageId
// @access  Private/Admin
const deleteKitImage = async (req, res, next) => {
  try {
    const { imageId } = req.params;

    const [existing] = await promisePool.query(
      'SELECT * FROM KitImages WHERE id = ?',
      [imageId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    await promisePool.query('DELETE FROM KitImages WHERE id = ?', [imageId]);

    res.status(200).json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export {
  getAllKits,
  getKitById,
  createKit,
  updateKit,
  deleteKit,
  deleteKitImage
};
