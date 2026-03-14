// ============================================================
// routes/services.js — Public service endpoints (no auth needed)
// GET /api/services       → all active services
// GET /api/services/:slug → single service by slug
// ============================================================

const router  = require('express').Router();
const { Op }  = require('sequelize');
const Service = require('../models/Service');

// ─── GET /api/services ───────────────────────────────────────
// Returns all active services ordered by sort_order.
// The public landing page and services grid use this.
router.get('/', async (_req, res, next) => {
  try {
    const services = await Service.findAll({
      where: { is_active: true },
      // Only return fields needed for the card grid (keeps response lean)
      attributes: ['id', 'title', 'slug', 'description', 'icon', 'image_url', 'price_from', 'sort_order'],
    });

    res.json({ services });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/services/:slug ─────────────────────────────────
// Returns full service data for the detail page.
// Also serves the SEO meta fields consumed by react-helmet-async.
router.get('/:slug', async (req, res, next) => {
  try {
    const service = await Service.findOne({
      where: { slug: req.params.slug, is_active: true },
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({ service });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
