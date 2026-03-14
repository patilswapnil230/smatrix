// ============================================================
// config/database.js — Sequelize connection factory
// Reads credentials from environment variables (never hardcode!)
// ============================================================

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME     || 'smatrix_db',
  process.env.DB_USER     || 'root',
  process.env.DB_PASSWORD || '',
  {
    host:    process.env.DB_HOST || 'localhost',
    port:    parseInt(process.env.DB_PORT, 10) || 3306,
    dialect: 'mysql',

    // Connection pool — keeps queries fast under load
    pool: {
      max:     10,
      min:     0,
      acquire: 30000,
      idle:    10000,
    },

    // Suppress verbose SQL logs in production
    logging: process.env.NODE_ENV === 'development' ? console.log : false,

    define: {
      // Automatically add createdAt / updatedAt to every model
      timestamps: true,
      underscored: true,  // Use snake_case column names in DB
    },
  }
);

module.exports = { sequelize };
