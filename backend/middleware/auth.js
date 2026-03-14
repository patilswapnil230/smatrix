// ============================================================
// middleware/auth.js — JWT verification middleware
// Usage: router.get('/protected', requireAuth, requireAdmin, handler)
// ============================================================

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ─── requireAuth ─────────────────────────────────────────────
// Validates the Bearer token in the Authorization header.
// Attaches the decoded user to req.user on success.
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication token missing' });
    }

    const token = authHeader.split(' ')[1];

    // Throws if token is expired or tampered
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch fresh user data (ensures deactivated users are rejected)
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'name', 'email', 'role'],
    });

    if (!user) {
      return res.status(401).json({ error: 'User no longer exists' });
    }

    req.user = user; // Attach user to request object
    next();
  } catch (err) {
    // Handle specific JWT errors with clear messages
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired — please log in again' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    next(err);
  }
};

// ─── requireAdmin ────────────────────────────────────────────
// Must be chained AFTER requireAuth.
// Rejects non-admin users from accessing protected admin routes.
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

module.exports = { requireAuth, requireAdmin };
