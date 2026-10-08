import path from 'path';
import { promisePool } from '../config/db.js';

const baseResourceSelect = `
  SELECT
    r.*,
    p.name AS product_name,
    c.name AS category_name,
    c.slug AS category_slug,
    k.name AS kit_name,
    k.slug AS kit_slug
  FROM ResourceUploads r
  LEFT JOIN Products p ON r.product_id = p.id
  LEFT JOIN Categories c ON r.category_id = c.id
  LEFT JOIN Kits k ON r.kit_id = k.id
`;

const getRelationType = (resource) => {
  if (resource.product_id) return 'product';
  if (resource.category_id) return 'category';
  if (resource.kit_id) return 'kit';
  return 'standalone';
};

const formatTitleFromFilename = (filename = '') =>
  path
    .parse(filename)
    .name
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const normalizeBoolean = (value) => {
  if (value === true || value === 1 || value === '1' || value === 'true') return 1;
  return 0;
};

const validateSingleRelation = ({ product_id, category_id, kit_id }) => {
  const relationCount = [product_id, category_id, kit_id].filter(Boolean).length;
  if (relationCount > 1) {
    const error = new Error('A resource can only be linked to one of product, category, or kit');
    error.statusCode = 400;
    throw error;
  }
};

const mapResource = (resource) => ({
  ...resource,
  is_featured: Boolean(resource.is_featured),
  relation_type: getRelationType(resource),
  relation_name:
    resource.product_name ||
    resource.category_name ||
    resource.kit_name ||
    'Standalone resource'
});

const buildFilters = (query = {}) => {
  const clauses = [];
  const params = [];

  if (query.search) {
    clauses.push(`(
      r.title LIKE ? OR
      r.description LIKE ? OR
      p.name LIKE ? OR
      c.name LIKE ? OR
      k.name LIKE ?
    )`);
    const likeValue = `%${query.search}%`;
    params.push(likeValue, likeValue, likeValue, likeValue, likeValue);
  }

  if (query.type) {
    clauses.push('r.resource_type = ?');
    params.push(query.type);
  }

  if (query.featured === 'true') {
    clauses.push('r.is_featured = 1');
  }

  if (query.product_id) {
    clauses.push('r.product_id = ?');
    params.push(query.product_id);
  }

  if (query.category_id) {
    clauses.push('r.category_id = ?');
    params.push(query.category_id);
  }

  if (query.kit_id) {
    clauses.push('r.kit_id = ?');
    params.push(query.kit_id);
  }

  if (query.relation_type === 'standalone') {
    clauses.push('r.product_id IS NULL AND r.category_id IS NULL AND r.kit_id IS NULL');
  } else if (query.relation_type === 'product') {
    clauses.push('r.product_id IS NOT NULL');
  } else if (query.relation_type === 'category') {
    clauses.push('r.category_id IS NOT NULL');
  } else if (query.relation_type === 'kit') {
    clauses.push('r.kit_id IS NOT NULL');
  }

  return {
    whereClause: clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '',
    params
  };
};

const groupResources = (resources, manualResources = []) => {
  const grouped = {
    standalone: [],
    products: [],
    categories: [],
    kits: [],
    featuredVideos: resources
      .filter((resource) => resource.resource_type === 'video' && resource.is_featured)
      .map(mapResource)
  };

  const productGroups = new Map();
  const categoryGroups = new Map();
  const kitGroups = new Map();

  const ensureEntityGroup = (map, key, seed) => {
    if (!map.has(key)) {
      map.set(key, { ...seed, resources: [] });
    }
    return map.get(key);
  };

  resources.forEach((resource) => {
    const mapped = mapResource(resource);
    if (mapped.relation_type === 'standalone') {
      grouped.standalone.push(mapped);
      return;
    }

    if (mapped.relation_type === 'product') {
      ensureEntityGroup(productGroups, mapped.product_id, {
        id: mapped.product_id,
        name: mapped.product_name
      }).resources.push(mapped);
      return;
    }

    if (mapped.relation_type === 'category') {
      ensureEntityGroup(categoryGroups, mapped.category_id, {
        id: mapped.category_id,
        name: mapped.category_name,
        slug: mapped.category_slug
      }).resources.push(mapped);
      return;
    }

    ensureEntityGroup(kitGroups, mapped.kit_id, {
      id: mapped.kit_id,
      name: mapped.kit_name,
      slug: mapped.kit_slug
    }).resources.push(mapped);
  });

  manualResources.forEach((manual) => {
    const group = ensureEntityGroup(productGroups, manual.product_id, {
      id: manual.product_id,
      name: manual.product_name
    });

    const alreadyExists = group.resources.some(
      (resource) => resource.file_url === manual.file_url
    );

    if (!alreadyExists) {
      group.resources.push({
        id: `manual-${manual.product_id}`,
        title: `${manual.product_name} Manual`,
        description: 'Product manual',
        resource_type: 'file',
        file_url: manual.file_url,
        youtube_url: null,
        original_file_name: null,
        mime_type: 'application/pdf',
        file_size: null,
        product_id: manual.product_id,
        category_id: null,
        kit_id: null,
        is_featured: false,
        created_at: null,
        updated_at: null,
        relation_type: 'product',
        relation_name: manual.product_name,
        product_name: manual.product_name,
        source: 'product_manual'
      });
    }
  });

  grouped.products = Array.from(productGroups.values()).sort((a, b) => a.name.localeCompare(b.name));
  grouped.categories = Array.from(categoryGroups.values()).sort((a, b) => a.name.localeCompare(b.name));
  grouped.kits = Array.from(kitGroups.values()).sort((a, b) => a.name.localeCompare(b.name));

  return grouped;
};

const getAllResources = async (req, res, next) => {
  try {
    const { whereClause, params } = buildFilters(req.query);
    const [resources] = await promisePool.query(
      `${baseResourceSelect}
       ${whereClause}
       ORDER BY r.is_featured DESC, r.updated_at DESC, r.created_at DESC`,
      params
    );

    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources.map(mapResource)
    });
  } catch (error) {
    next(error);
  }
};

const getDownloadResources = async (req, res, next) => {
  try {
    const { whereClause, params } = buildFilters(req.query);
    const [resources] = await promisePool.query(
      `${baseResourceSelect}
       ${whereClause}
       ORDER BY r.is_featured DESC, r.updated_at DESC, r.created_at DESC`,
      params
    );

    const [productManuals] = await promisePool.query(`
      SELECT id AS product_id, name AS product_name, manual_pdf_url AS file_url
      FROM Products
      WHERE manual_pdf_url IS NOT NULL AND manual_pdf_url <> ''
    `);

    const searchTerm = req.query.search?.trim().toLowerCase();
    const filteredManuals = productManuals.filter((manual) => {
      if (!searchTerm) return true;
      return manual.product_name?.toLowerCase().includes(searchTerm);
    });

    const relationType = req.query.relation_type;
    const includeManuals = req.query.type !== 'video' && (!relationType || relationType === 'product');
    const grouped = groupResources(
      resources,
      includeManuals ? filteredManuals : []
    );

    res.status(200).json({
      success: true,
      data: grouped
    });
  } catch (error) {
    next(error);
  }
};

const createResource = async (req, res, next) => {
  try {
    const {
      title,
      description,
      youtube_url,
      product_id = null,
      category_id = null,
      kit_id = null
    } = req.body;

    const files = req.files?.files || [];
    const is_featured = normalizeBoolean(req.body.is_featured);

    validateSingleRelation({ product_id, category_id, kit_id });

    if (!youtube_url && files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one file or provide a YouTube link'
      });
    }

    if (youtube_url && files.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload files or provide a YouTube link, not both at once'
      });
    }

    if (youtube_url && !title?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a title for the video resource'
      });
    }

    if (youtube_url) {
      const [result] = await promisePool.query(
        `INSERT INTO ResourceUploads
          (title, description, resource_type, youtube_url, product_id, category_id, kit_id, is_featured)
         VALUES (?, ?, 'video', ?, ?, ?, ?, ?)`,
        [title.trim(), description || null, youtube_url.trim(), product_id || null, category_id || null, kit_id || null, is_featured]
      );

      const [created] = await promisePool.query(
        `${baseResourceSelect} WHERE r.id = ?`,
        [result.insertId]
      );

      return res.status(201).json({
        success: true,
        message: 'Video resource created successfully',
        data: created.map(mapResource)
      });
    }

    const inserts = files.map((file, index) => [
      files.length === 1 && title?.trim()
        ? title.trim()
        : formatTitleFromFilename(file.originalname) || `Resource ${index + 1}`,
      description || null,
      `/uploads/resources/${file.filename}`,
      file.originalname,
      file.mimetype,
      file.size,
      product_id || null,
      category_id || null,
      kit_id || null,
      is_featured
    ]);

    const [insertResult] = await promisePool.query(
      `INSERT INTO ResourceUploads
        (title, description, resource_type, file_url, original_file_name, mime_type, file_size, product_id, category_id, kit_id, is_featured)
       VALUES ?`,
      [inserts.map((row) => [row[0], row[1], 'file', row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9]])]
    );

    const [created] = await promisePool.query(
      `${baseResourceSelect} WHERE r.id BETWEEN ? AND ? ORDER BY r.id ASC`,
      [
        insertResult.insertId,
        insertResult.insertId + inserts.length - 1
      ]
    );

    res.status(201).json({
      success: true,
      message: files.length > 1 ? 'Resources uploaded successfully' : 'Resource uploaded successfully',
      data: created.map(mapResource)
    });
  } catch (error) {
    next(error);
  }
};

const updateResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [existingRows] = await promisePool.query(
      'SELECT * FROM ResourceUploads WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    const existing = existingRows[0];
    const uploadedFile = req.files?.files?.[0] || null;

    const payload = {
      title: req.body.title?.trim() || existing.title,
      description: req.body.description !== undefined ? req.body.description : existing.description,
      product_id: req.body.product_id === '' ? null : req.body.product_id ?? existing.product_id,
      category_id: req.body.category_id === '' ? null : req.body.category_id ?? existing.category_id,
      kit_id: req.body.kit_id === '' ? null : req.body.kit_id ?? existing.kit_id,
      is_featured: req.body.is_featured !== undefined ? normalizeBoolean(req.body.is_featured) : existing.is_featured,
      youtube_url: req.body.youtube_url !== undefined ? req.body.youtube_url?.trim() || null : existing.youtube_url
    };

    validateSingleRelation(payload);

    const updates = [
      'title = ?',
      'description = ?',
      'product_id = ?',
      'category_id = ?',
      'kit_id = ?',
      'is_featured = ?'
    ];
    const values = [
      payload.title,
      payload.description || null,
      payload.product_id || null,
      payload.category_id || null,
      payload.kit_id || null,
      payload.is_featured
    ];

    if (uploadedFile) {
      updates.push(
        'resource_type = ?',
        'file_url = ?',
        'youtube_url = ?',
        'original_file_name = ?',
        'mime_type = ?',
        'file_size = ?'
      );
      values.push(
        'file',
        `/uploads/resources/${uploadedFile.filename}`,
        null,
        uploadedFile.originalname,
        uploadedFile.mimetype,
        uploadedFile.size
      );
    } else if (req.body.youtube_url !== undefined) {
      if (!payload.youtube_url) {
        return res.status(400).json({
          success: false,
          message: 'Video resources require a YouTube link'
        });
      }
      updates.push(
        'resource_type = ?',
        'youtube_url = ?',
        'file_url = ?',
        'original_file_name = ?',
        'mime_type = ?',
        'file_size = ?'
      );
      values.push('video', payload.youtube_url, null, null, null, null);
    }

    values.push(id);

    await promisePool.query(
      `UPDATE ResourceUploads SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const [updated] = await promisePool.query(
      `${baseResourceSelect} WHERE r.id = ?`,
      [id]
    );

    res.status(200).json({
      success: true,
      message: 'Resource updated successfully',
      data: updated.map(mapResource)[0]
    });
  } catch (error) {
    next(error);
  }
};

const deleteResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [existing] = await promisePool.query(
      'SELECT id FROM ResourceUploads WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found'
      });
    }

    await promisePool.query('DELETE FROM ResourceUploads WHERE id = ?', [id]);

    res.status(200).json({
      success: true,
      message: 'Resource deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export {
  getAllResources,
  getDownloadResources,
  createResource,
  updateResource,
  deleteResource
};
