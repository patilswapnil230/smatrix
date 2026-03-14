// ============================================================
// models/User.js — Sequelize model for the `users` table
// Handles password hashing automatically via lifecycle hooks
// ============================================================

const { DataTypes } = require('sequelize');
const bcrypt        = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type:          DataTypes.INTEGER,
    primaryKey:    true,
    autoIncrement: true,
  },

  name: {
    type:      DataTypes.STRING(100),
    allowNull: false,
    validate:  { notEmpty: { msg: 'Name is required' } },
  },

  email: {
    type:      DataTypes.STRING(150),
    allowNull: false,
    unique:    true,
    validate:  { isEmail: { msg: 'Must be a valid email address' } },
  },

  // Store only the bcrypt hash — NEVER the plain-text password
  password: {
    type:      DataTypes.STRING(255),
    allowNull: false,
  },

  // 'admin' can CRUD content; 'user' is a regular visitor account
  role: {
    type:         DataTypes.ENUM('admin', 'user'),
    allowNull:    false,
    defaultValue: 'user',
  },
}, {
  tableName:  'users',
  timestamps: true,

  // ── Lifecycle hooks ──────────────────────────────────────────
  hooks: {
    // Hash password before every create or update
    beforeSave: async (user) => {
      if (user.changed('password')) {
        const saltRounds = 12;
        user.password = await bcrypt.hash(user.password, saltRounds);
      }
    },
  },
});

// ─── Instance method: compare a plain password against the stored hash ───
User.prototype.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

module.exports = User;
