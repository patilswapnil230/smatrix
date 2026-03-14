// ============================================================
// server.js — Express application entry point
// Bootstraps middleware, routes, DB connection, and starts server
// ============================================================

require('dotenv').config(); // Load .env variables first

const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');

const { sequelize } = require('./config/database');
const authRoutes    = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const adminRoutes   = require('./routes/admin');
const contactRoutes = require('./routes/contact');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ──────────────────────────────────────────────
app.use(helmet());          // Security headers
app.use(morgan('dev'));      // Request logging

// Allow requests from the React frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());        // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse form data

// ─── Routes ─────────────────────────────────────────────────
app.use('/api/auth',    authRoutes);      // Public auth endpoints
app.use('/api/services', serviceRoutes); // Public service endpoints
app.use('/api/admin',   adminRoutes);    // Protected admin endpoints
app.use('/api/contact', contactRoutes);  // Public contact form

// ─── Health check ────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// ─── Global error handler ────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[Error]', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// ─── Start ───────────────────────────────────────────────────
async function startServer() {
  try {
    // Test DB connection and sync models (alter:true updates schema safely in dev)
    await sequelize.authenticate();
    console.log('✅ Database connected');

    await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });
    console.log('✅ Models synced');

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
