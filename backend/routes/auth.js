// ============================================================
// routes/auth.js — Authentication endpoints
// POST /api/auth/login    → returns JWT
// POST /api/auth/register → creates general user
// GET  /api/auth/me       → returns current user (protected)
// ============================================================

const router           = require('express').Router();
const jwt              = require('jsonwebtoken');
const User             = require('../models/User');
const { requireAuth }  = require('../middleware/auth');

// ─── Helper: generate a signed JWT ──────────────────────────
const signToken = (userId) =>
  jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

// ─── POST /api/auth/register ─────────────────────────────────
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Basic input validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Prevent duplicate registrations
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Create user — password is hashed automatically by the model's beforeSave hook
    const user  = await User.create({ name, email, password, role: 'user' });
    const token = signToken(user.id);

    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/auth/login ────────────────────────────────────
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ where: { email } });

    // Use generic error message to prevent user enumeration
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken(user.id);

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/auth/me (protected) ────────────────────────────
router.get('/me', requireAuth, (req, res) => {
  // req.user is attached by the requireAuth middleware
  res.json({ user: req.user });
});

// ─── POST /api/auth/seed-admin ───────────────────────────────
// ONE-TIME endpoint to create the default admin. Remove in production.
router.post('/seed-admin', async (req, res, next) => {
  try {
    const existing = await User.findOne({ where: { email: 'admin@smatrix.com' } });
    if (existing) {
      return res.status(409).json({ message: 'Admin already exists' });
    }

    await User.create({
      name:     'Admin',
      email:    'admin@smatrix.com',
      password: 'Admin@1234',  // Will be hashed by beforeSave hook
      role:     'admin',
    });

    res.json({ message: '✅ Admin created — admin@smatrix.com / Admin@1234' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
