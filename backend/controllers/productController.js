import { promisePool } from '../config/db.js';

const parseJsonPayload = (value, fallback) => {
  if (value === undefined) return undefined;
  if (value === null || value === '') return fallback;
  if (typeof value !== 'string') return value;

  try {
    return JSON.parse(value);
  } catch {
    const error = new Error('Models and specifications must contain valid JSON');
    error.statusCode = 400;
    throw error;
  }
};

const syncProductConfiguration = async (db, productId, rawModels, rawSpecifications) => {
  if (rawModels === undefined && rawSpecifications === undefined) return;

  const models = parseJsonPayload(rawModels, []);
  const specifications = parseJsonPayload(rawSpecifications, []);

  if (!Array.isArray(models) || !Array.isArray(specifications)) {
    const error = new Error('Models and specifications must be arrays');
    error.statusCode = 400;
    throw error;
  }

  const modelCodes = models.map((model) => String(model.model_code || '').trim());
  if (modelCodes.some((code) => !code) || new Set(modelCodes).size !== modelCodes.length) {
    const error = new Error('Every model needs a unique model code');
    error.statusCode = 400;
    throw error;
  }

  const [kitModelAssignments] = await db.query(
    `SELECT kp.id AS kit_product_id, pm.model_code
     FROM KitProducts kp
     JOIN ProductModels pm ON kp.product_model_id = pm.id
     WHERE kp.product_id = ?`,
    [productId]
  );

  await db.query('DELETE FROM ProductSpecifications WHERE product_id = ?', [productId]);
  await db.query('DELETE FROM ProductModels WHERE product_id = ?', [productId]);

  const insertedModelIds = {};
  for (const [index, model] of models.entries()) {
    const [result] = await db.query(
      `INSERT INTO ProductModels
       (product_id, model_code, display_name, nominal_power, is_default, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        productId,
        modelCodes[index],
        model.display_name || modelCodes[index],
        model.nominal_power || null,
        model.is_default ? 1 : 0,
        Number.isInteger(model.sort_order) ? model.sort_order : index,
      ]
    );
    insertedModelIds[modelCodes[index]] = result.insertId;
  }

  for (const assignment of kitModelAssignments) {
    await db.query(
      'UPDATE KitProducts SET product_model_id = ? WHERE id = ?',
      [insertedModelIds[assignment.model_code] || null, assignment.kit_product_id]
    );
  }

  for (const [index, specification] of specifications.entries()) {
    const valueMode = specification.value_mode === 'custom' ? 'custom' : 'shared';
    const modelValues = valueMode === 'custom' ? (specification.model_values || {}) : null;

    await db.query(
      `INSERT INTO ProductSpecifications
       (product_id, section_name, spec_key, label, unit, value_mode, shared_value, model_values, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        productId,
        specification.section_name || 'General',
        specification.spec_key || `spec_${index + 1}`,
        specification.label || specification.spec_key || `Specification ${index + 1}`,
        specification.unit || null,
        valueMode,
        valueMode === 'shared' ? (specification.shared_value || '') : null,
        modelValues ? JSON.stringify(modelValues) : null,
        Number.isInteger(specification.sort_order) ? specification.sort_order : index,
      ]
    );
  }
};

const attachProductConfiguration = async (db, product) => {
  const [models] = await db.query(
    'SELECT * FROM ProductModels WHERE product_id = ? ORDER BY sort_order ASC, id ASC',
    [product.id]
  );
  const [specifications] = await db.query(
    'SELECT * FROM ProductSpecifications WHERE product_id = ? ORDER BY sort_order ASC, id ASC',
    [product.id]
  );

  product.models = models;
  product.specifications = specifications.map((specification) => {
    if (specification.model_values && typeof specification.model_values === 'string') {
      try {
        specification.model_values = JSON.parse(specification.model_values);
      } catch {
        specification.model_values = {};
      }
    }
    return specification;
  });
};

const attachModelsToProducts = async (db, products) => {
  if (!products.length) return;
  const productIds = products.map((product) => product.id);
  const [models] = await db.query(
    'SELECT * FROM ProductModels WHERE product_id IN (?) ORDER BY product_id ASC, sort_order ASC, id ASC',
    [productIds]
  );
  const modelsByProduct = models.reduce((groups, model) => {
    if (!groups[model.product_id]) groups[model.product_id] = [];
    groups[model.product_id].push(model);
    return groups;
  }, {});
  products.forEach((product) => {
    product.models = modelsByProduct[product.id] || [];
  });
};

// @desc    Get all products with optional filters
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res, next) => {
  try {
    const { category, search, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT p.*, c.name as category_name, c.slug as category_slug FROM Products p LEFT JOIN Categories c ON p.category_id = c.id WHERE 1=1';
    const params = [];

    // Apply filters
    if (category) {
      query += ' AND c.slug = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ? OR EXISTS (SELECT 1 FROM ProductModels pm WHERE pm.product_id = p.id AND pm.model_code LIKE ?))';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Add ordering and pagination
    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [products] = await promisePool.query(query, params);
    await attachModelsToProducts(promisePool, products);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM Products p LEFT JOIN Categories c ON p.category_id = c.id WHERE 1=1';
    const countParams = [];

    if (category) {
      countQuery += ' AND c.slug = ?';
      countParams.push(category);
    }

    if (search) {
      countQuery += ' AND (p.name LIKE ? OR p.description LIKE ? OR EXISTS (SELECT 1 FROM ProductModels pm WHERE pm.product_id = p.id AND pm.model_code LIKE ?))';
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [countResult] = await promisePool.query(countQuery, countParams);

    res.status(200).json({
      success: true,
      count: products.length,
      total: countResult[0].total,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [products] = await promisePool.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug 
       FROM Products p 
       LEFT JOIN Categories c ON p.category_id = c.id 
       WHERE p.id = ?`,
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Parse metadata JSON if it exists
    const product = products[0];
    if (product.metadata) {
      try {
        product.metadata = JSON.parse(product.metadata);
      } catch (e) {
        // If parsing fails, keep as string
      }
    }

    // Get gallery images
    const [galleryImages] = await promisePool.query(
      'SELECT * FROM ProductImages WHERE product_id = ? ORDER BY sort_order ASC',
      [id]
    );
    product.gallery_images = galleryImages;
    await attachProductConfiguration(promisePool, product);

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:categoryId
// @access  Public
const getProductsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const [products] = await promisePool.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug 
       FROM Products p 
       LEFT JOIN Categories c ON p.category_id = c.id 
       WHERE p.category_id = ? 
       ORDER BY p.name ASC`,
      [categoryId]
    );
    await attachModelsToProducts(promisePool, products);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  let connection;
  try {
    const {
      category_id,
      name,
      description,
      wattage,
      durability_rating,
      battery_type,
      warranty_info,
      video_url,
      metadata,
      models,
      specifications
    } = req.body;

    connection = await promisePool.getConnection();
    await connection.beginTransaction();

    let image_url = req.body.image_url;
    let manual_pdf_url = req.body.manual_pdf_url;

    // Handle file uploads
    if (req.files) {
      if (req.files.image) {
        image_url = `/uploads/products/${req.files.image[0].filename}`;
      }
      if (req.files.manual) {
        manual_pdf_url = `/uploads/manuals/${req.files.manual[0].filename}`;
      }
    }

    // Validate required fields
    if (!category_id || !name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide category_id and name'
      });
    }

    // Validate category exists
    const [categoryExists] = await connection.query(
      'SELECT id FROM Categories WHERE id = ?',
      [category_id]
    );

    if (categoryExists.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category_id'
      });
    }

    // Convert metadata to JSON string if it's an object
    let metadataStr = metadata;
    if (typeof metadata === 'object') {
      metadataStr = JSON.stringify(metadata);
    }

    // Insert product
    const [result] = await connection.query(
      `INSERT INTO Products 
       (category_id, name, description, wattage, durability_rating, battery_type,
        warranty_info, image_url, manual_pdf_url, video_url, metadata)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        category_id,
        name,
        description,
        wattage,
        durability_rating,
        battery_type,
        warranty_info,
        image_url,
        manual_pdf_url,
        video_url,
        metadataStr
      ]
    );

    await syncProductConfiguration(connection, result.insertId, models, specifications);

    // Handle gallery images insertion
    if (req.files && req.files.gallery_images) {
      const galleryPromises = req.files.gallery_images.map((file, index) => {
        const imageUrl = `/uploads/products/${file.filename}`;
        return connection.query(
          'INSERT INTO ProductImages (product_id, image_url, sort_order) VALUES (?, ?, ?)',
          [result.insertId, imageUrl, index]
        );
      });
      await Promise.all(galleryPromises);
    }

    // Get the created product
    const [newProduct] = await connection.query(
      'SELECT * FROM Products WHERE id = ?',
      [result.insertId]
    );
    await attachProductConfiguration(connection, newProduct[0]);

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct[0]
    });
  } catch (error) {
    if (connection) await connection.rollback();
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  let connection;
  try {
    const { id } = req.params;
    const updateData = req.body;
    connection = await promisePool.getConnection();
    await connection.beginTransaction();

    // Handle file uploads
    if (req.files) {
      if (req.files.image) {
        updateData.image_url = `/uploads/products/${req.files.image[0].filename}`;
      }
      if (req.files.manual) {
        updateData.manual_pdf_url = `/uploads/manuals/${req.files.manual[0].filename}`;
      }
    }

    // Check if product exists
    const [existing] = await connection.query(
      'SELECT * FROM Products WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Build update query dynamically
    const updates = [];
    const values = [];

    const allowedFields = [
      'category_id',
      'name',
      'description',
      'wattage',
      'durability_rating',
      'battery_type',
      'warranty_info',
      'image_url',
      'manual_pdf_url',
      'video_url',
      'metadata'
    ];

    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        updates.push(`${field} = ?`);
        
        // Convert metadata to JSON string if it's an object
        if (field === 'metadata' && typeof updateData[field] === 'object') {
          values.push(JSON.stringify(updateData[field]));
        } else {
          values.push(updateData[field]);
        }
      }
    });

    if (updates.length === 0 && updateData.models === undefined && updateData.specifications === undefined) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    if (updates.length > 0) {
      values.push(id);
      await connection.query(
        `UPDATE Products SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    await syncProductConfiguration(connection, id, updateData.models, updateData.specifications);

    // Handle new gallery images insertion (append to existing)
    if (req.files && req.files.gallery_images) {
      const galleryPromises = req.files.gallery_images.map((file, index) => {
        const imageUrl = `/uploads/products/${file.filename}`;
        return connection.query(
          'INSERT INTO ProductImages (product_id, image_url, sort_order) VALUES (?, ?, ?)',
          [id, imageUrl, index]
        );
      });
      await Promise.all(galleryPromises);
    }

    // Get updated product
    const [updated] = await connection.query(
      'SELECT * FROM Products WHERE id = ?',
      [id]
    );
    await attachProductConfiguration(connection, updated[0]);

    await connection.commit();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updated[0]
    });
  } catch (error) {
    if (connection) await connection.rollback();
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const [existing] = await promisePool.query(
      'SELECT * FROM Products WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete product
    await promisePool.query('DELETE FROM Products WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product image
// @route   DELETE /api/products/images/:imageId
// @access  Private/Admin
const deleteProductImage = async (req, res, next) => {
  try {
    const { imageId } = req.params;

    // Check if image exists
    const [images] = await promisePool.query('SELECT id FROM ProductImages WHERE id = ?', [imageId]);
    if (images.length === 0) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    // Delete from database
    await promisePool.query('DELETE FROM ProductImages WHERE id = ?', [imageId]);

    res.status(200).json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage
};
