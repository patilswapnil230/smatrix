// ============================================================
// routes/admin.js — Protected admin endpoints (JWT + admin role)
// All routes require: Authorization: Bearer <token> (admin role)
// ============================================================

const router                    = require('express').Router();
const Service                   = require('../models/Service');
const ContactMessage            = require('../models/ContactMessage');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Apply auth middleware to all admin routes
router.use(requireAuth, requireAdmin);

// ═══════════════════════════════════════════════════
//  SERVICE CRUD
// ═══════════════════════════════════════════════════

// ─── GET /api/admin/services ─────────────────────────────────
// Returns ALL services including inactive ones (for admin view)
router.get('/services', async (_req, res, next) => {
  try {
    const services = await Service.unscoped().findAll({
      order: [['sort_order', 'ASC'], ['created_at', 'ASC']],
    });
    res.json({ services });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/admin/services ────────────────────────────────
// Create a new service category — no code changes needed!
router.post('/services', async (req, res, next) => {
  try {
    const {
      title, slug, description, long_desc,
      icon, image_url, price_from, is_active,
      sort_order, meta_title, meta_desc,
    } = req.body;

    // Validate required fields
    if (!title || !slug || !description) {
      return res.status(400).json({ error: 'title, slug, and description are required' });
    }

    const service = await Service.create({
      title, slug: slug.toLowerCase().trim(),
      description, long_desc, icon, image_url,
      price_from, is_active: is_active ?? true,
      sort_order: sort_order ?? 0,
      meta_title, meta_desc,
    });

    res.status(201).json({ service });
  } catch (err) {
    // Sequelize unique constraint violation (duplicate slug)
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'A service with this slug already exists' });
    }
    next(err);
  }
});

// ─── PUT /api/admin/services/:id ─────────────────────────────
// Update any field of an existing service
router.put('/services/:id', async (req, res, next) => {
  try {
    const service = await Service.unscoped().findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });

    // Only update fields that are explicitly provided in the request body
    const updatableFields = [
      'title', 'slug', 'description', 'long_desc',
      'icon', 'image_url', 'price_from', 'is_active',
      'sort_order', 'meta_title', 'meta_desc',
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        service[field] = field === 'slug'
          ? req.body[field].toLowerCase().trim()
          : req.body[field];
      }
    });

    await service.save();
    res.json({ service });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Slug already in use by another service' });
    }
    next(err);
  }
});

// ─── DELETE /api/admin/services/:id ──────────────────────────
router.delete('/services/:id', async (req, res, next) => {
  try {
    const service = await Service.unscoped().findByPk(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });

    await service.destroy();
    res.json({ message: `Service "${service.title}" deleted successfully` });
  } catch (err) {
    next(err);
  }
});

// ═══════════════════════════════════════════════════
//  CONTACT MESSAGES (read-only + mark-read)
// ═══════════════════════════════════════════════════

// ─── GET /api/admin/contact ───────────────────────────────────
router.get('/contact', async (_req, res, next) => {
  try {
    const messages = await ContactMessage.findAll({
      include: [{ association: 'service', attributes: ['title'] }],
      order: [['created_at', 'DESC']],
    });
    res.json({ messages });
  } catch (err) {
    next(err);
  }
});

// ─── PATCH /api/admin/contact/:id/read ───────────────────────
router.patch('/contact/:id/read', async (req, res, next) => {
  try {
    const msg = await ContactMessage.findByPk(req.params.id);
    if (!msg) return res.status(404).json({ error: 'Message not found' });

    msg.is_read = true;
    await msg.save();
    res.json({ message: 'Marked as read', id: msg.id });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
