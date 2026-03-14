// ============================================================
// models/ContactMessage.js — Stores public contact form data
// ============================================================

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Service       = require('./Service');

const ContactMessage = sequelize.define('ContactMessage', {
  id: {
    type:          DataTypes.INTEGER,
    primaryKey:    true,
    autoIncrement: true,
  },

  name: {
    type:      DataTypes.STRING(100),
    allowNull: false,
  },

  email: {
    type:      DataTypes.STRING(150),
    allowNull: false,
    validate:  { isEmail: true },
  },

  phone: {
    type:      DataTypes.STRING(20),
    allowNull: true,
  },

  // Which service the enquiry relates to (nullable FK)
  service_id: {
    type:       DataTypes.INTEGER,
    allowNull:  true,
    references: { model: Service, key: 'id' },
  },

  message: {
    type:      DataTypes.TEXT,
    allowNull: false,
  },

  // Admin marks messages as read inside the dashboard
  is_read: {
    type:         DataTypes.BOOLEAN,
    allowNull:    false,
    defaultValue: false,
  },
}, {
  tableName:  'contact_messages',
  timestamps: true,
  updatedAt:  false, // We only need createdAt for messages
});

// Association: a message may reference a service
ContactMessage.belongsTo(Service, { foreignKey: 'service_id', as: 'service' });

module.exports = ContactMessage;
