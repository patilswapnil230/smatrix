// ============================================================
// models/Service.js — Generic service category model
// Adding a new service type requires ZERO code changes —
// just insert a row via the Admin Dashboard.
// ============================================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Service = sequelize.define('Service', {
  id: {
    type:          DataTypes.INTEGER,
    primaryKey:    true,
    autoIncrement: true,
  },

  // Human-readable name shown in UI — e.g., "Plumbing"
  title: {
    type:      DataTypes.STRING(150),
    allowNull: false,
    validate:  { notEmpty: { msg: 'Title is required' } },
  },

  // URL-friendly identifier — e.g., "plumbing"
  // Used in React Router: /services/:slug
  slug: {
    type:      DataTypes.STRING(150),
    allowNull: false,
    unique:    true,
    validate:  { notEmpty: { msg: 'Slug is required' } },
  },

  // Short text shown on service cards (≤ 200 chars recommended)
  description: {
    type:      DataTypes.TEXT,
    allowNull: false,
  },

  // Full content shown on the dedicated service detail page
  long_desc: {
    type:      DataTypes.TEXT,
    allowNull: true,
  },

  // Emoji or icon class/name — displayed on cards
  icon: {
    type:      DataTypes.STRING(100),
    allowNull: true,
  },

  // Full URL to a hero/card image (Unsplash, Cloudinary, etc.)
  image_url: {
    type:      DataTypes.STRING(500),
    allowNull: true,
  },

  // "Starting from ₹X" pricing displayed on cards
  price_from: {
    type:         DataTypes.DECIMAL(10, 2),
    allowNull:    true,
    defaultValue: null,
  },

  // Toggle to show/hide without deleting — handy for seasonal services
  is_active: {
    type:         DataTypes.BOOLEAN,
    allowNull:    false,
    defaultValue: true,
  },

  // Manual display ordering (lower number = shown first)
  sort_order: {
    type:         DataTypes.INTEGER,
    allowNull:    false,
    defaultValue: 0,
  },

  // ── SEO fields ──────────────────────────────────────────────
  // Injected via react-helmet-async on the service detail page

  meta_title: {
    type:      DataTypes.STRING(160),
    allowNull: true,
  },

  meta_desc: {
    type:      DataTypes.STRING(320),
    allowNull: true,
  },
}, {
  tableName:  'services',
  timestamps: true,
  // Default sort: by sort_order then creation date
  defaultScope: {
    order: [['sort_order', 'ASC'], ['created_at', 'ASC']],
  },
});

module.exports = Service;
