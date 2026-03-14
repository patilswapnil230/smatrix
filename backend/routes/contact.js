// ============================================================
// routes/contact.js — Public contact form submission
// POST /api/contact — saves message to DB
// ============================================================

const router         = require('express').Router();
const ContactMessage = require('../models/ContactMessage');

router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, service_id, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const contact = await ContactMessage.create({
      name,
      email,
      phone:      phone      || null,
      service_id: service_id || null,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been received. We\'ll be in touch shortly!',
      id: contact.id,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
