import express from 'express';
import { applicationSectors } from '../config/applicationSectors.js';
import { promisePool } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { uploadProjectFiles, handleUploadError } from '../middleware/upload.js';
import { unlink } from 'node:fs/promises';
const router = express.Router();
const invalid = message => Object.assign(new Error(message), { statusCode: 400 });
const ids = value => {
  let parsed;
  try { parsed = JSON.parse(value || '[]'); } catch { throw invalid('Invalid linked items'); }
  if (!Array.isArray(parsed) || parsed.some(id => !Number.isInteger(Number(id)) || Number(id) <= 0)) throw invalid('Invalid linked items');
  return [...new Set(parsed.map(Number))];
};
router.get('/', async (req, res, next) => {
  try {
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 100));
    const [data] = req.query.limit === undefined
      ? await promisePool.query('SELECT * FROM Projects ORDER BY created_at DESC, id DESC')
      : await promisePool.query('SELECT * FROM Projects ORDER BY created_at DESC, id DESC LIMIT ?', [limit]);
    res.json({ success: true, data });
  } catch (e) { next(e); }
});
router.get('/:id', async (req, res, next) => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM Projects WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Project not found' });
    const [images] = await promisePool.query('SELECT * FROM ProjectImages WHERE project_id = ? ORDER BY sort_order, id', [req.params.id]);
    const [products] = await promisePool.query('SELECT p.id, p.name, p.image_url FROM Products p JOIN ProjectProducts pp ON pp.product_id = p.id WHERE pp.project_id = ?', [req.params.id]);
    const [kits] = await promisePool.query('SELECT k.id, k.name, k.slug, k.image_url FROM Kits k JOIN ProjectKits pk ON pk.kit_id = k.id WHERE pk.project_id = ?', [req.params.id]);
    res.json({ success: true, data: { ...rows[0], images, products, kits } });
  } catch (e) { next(e); }
});
async function save(req, res, next) {
  let db;
  const files = Object.values(req.files || {}).flat();
  try {
    const fields = ['title', 'category', 'application_sector', 'description', 'location_name'];
    const values = fields.map(field => String(req.body[field] || '').trim());
    if (!applicationSectors.includes(values[2])) throw invalid('Choose one of the predefined application sectors');
    if (values.some(v => !v)) throw invalid('Title, category, sector, description and location are required');
    if (values.some((v, i) => i !== 3 && v.length > (i === 1 || i === 2 ? 100 : 200))) throw invalid('A project field is too long');
    const lat = Number(req.body.latitude), lng = Number(req.body.longitude);
    if (!String(req.body.latitude ?? '').trim() || !String(req.body.longitude ?? '').trim() || !Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) throw invalid('Select a valid project location');
    const products = ids(req.body.product_ids), kits = ids(req.body.kit_ids), retained = ids(req.body.retained_image_ids);
    db = await promisePool.getConnection();
    await db.beginTransaction();
    let existing;
    if (req.params.id) {
      const [rows] = await db.query('SELECT * FROM Projects WHERE id = ? FOR UPDATE', [req.params.id]);
      existing = rows[0];
      if (!existing) throw Object.assign(new Error('Project not found'), { statusCode: 404 });
    }
    const image = req.files?.image?.[0];
    const gallery = req.files?.gallery_images || [];
    if (!existing && !image) throw invalid('Upload a main image');
    const [oldImages] = existing ? await db.query('SELECT id FROM ProjectImages WHERE project_id = ?', [existing.id]) : [[]];
    if (retained.some(id => !oldImages.some(row => row.id === id))) throw invalid('Invalid gallery selection');
    if (retained.length + gallery.length < 1 || retained.length + gallery.length > 10) throw invalid('Provide between 1 and 10 gallery images');
    for (const [table, selected] of [['Products', products], ['Kits', kits]]) {
      if (selected.length) {
        const [rows] = await db.query(`SELECT id FROM ${table} WHERE id IN (?)`, [selected]);
        if (rows.length !== selected.length) throw invalid('A linked product or kit no longer exists');
      }
    }
    const payload = [...values, lat, lng, image ? `/uploads/projects/${image.filename}` : existing.image_url];
    let id = existing?.id;
    if (existing) await db.query('UPDATE Projects SET title=?, category=?, application_sector=?, description=?, location_name=?, latitude=?, longitude=?, image_url=? WHERE id=?', [...payload, id]);
    else {
      const [result] = await db.query('INSERT INTO Projects (title, category, application_sector, description, location_name, latitude, longitude, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', payload);
      id = result.insertId;
    }
    if (retained.length) await db.query('DELETE FROM ProjectImages WHERE project_id=? AND id NOT IN (?)', [id, retained]);
    else await db.query('DELETE FROM ProjectImages WHERE project_id=?', [id]);
    for (const [order, file] of gallery.entries()) await db.query('INSERT INTO ProjectImages (project_id, image_url, sort_order) VALUES (?, ?, ?)', [id, `/uploads/projects/${file.filename}`, retained.length + order]);
    for (const [table, column, selected] of [['ProjectProducts', 'product_id', products], ['ProjectKits', 'kit_id', kits]]) {
      await db.query(`DELETE FROM ${table} WHERE project_id=?`, [id]);
      for (const item of selected) await db.query(`INSERT INTO ${table} (project_id, ${column}) VALUES (?, ?)`, [id, item]);
    }
    await db.commit();
    res.status(existing ? 200 : 201).json({ success: true, data: { id } });
  } catch (e) {
    if (db) await db.rollback();
    await Promise.allSettled(files.map(file => unlink(file.path)));
    next(e);
  } finally { db?.release(); }
}
router.post('/', authenticateToken, uploadProjectFiles, handleUploadError, save);
router.put('/:id', authenticateToken, uploadProjectFiles, handleUploadError, save);
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const [result] = await promisePool.query('DELETE FROM Projects WHERE id=?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true });
  } catch (e) { next(e); }
});
export default router;
