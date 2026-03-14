// src/pages/ContactPage.jsx
// Public contact form. Pre-populates the service dropdown from the DB.
// Submits to POST /api/contact.

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api';
import { useServices } from '../hooks/useServices';

// Initial blank form state — defined once, reused for reset
const INITIAL_FORM = {
  name: '', email: '', phone: '', service_id: '', message: '',
};

export default function ContactPage() {
  const [searchParams]           = useSearchParams();
  const { services }             = useServices();
  const [form,       setForm]    = useState({
    ...INITIAL_FORM,
    service_id: searchParams.get('service') || '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedback,   setFeedback]   = useState(null); // { type: 'success'|'error', msg }

  // ── Handle field changes ──────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ── Handle submit ─────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    // Basic client-side validation
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setFeedback({ type: 'error', msg: 'Please fill in all required fields.' });
      setSubmitting(false);
      return;
    }

    try {
      const { data } = await api.post('/contact', {
        ...form,
        service_id: form.service_id || null,
      });
      setFeedback({ type: 'success', msg: data.message });
      setForm(INITIAL_FORM); // Reset form on success
    } catch (err) {
      setFeedback({
        type: 'error',
        msg: err.response?.data?.error || 'Something went wrong. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | S-Matrix Solutions</title>
        <meta
          name="description"
          content="Get in touch with S-Matrix Solutions for a free quote on any home service — painting, plumbing, furniture, cleaning, and more."
        />
      </Helmet>

      <Navbar />

      <main>
        {/* ── Page header ───────────────────────────────────── */}
        <section className="bg-brand-900 text-white py-16">
          <div className="section-container">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Contact Us</h1>
            <p className="text-slate-300 text-lg max-w-xl">
              Send us a message and we'll get back to you with a free, detailed quote within 2 hours.
            </p>
          </div>
        </section>

        {/* ── Contact grid ──────────────────────────────────── */}
        <section className="py-16 bg-surface" aria-label="Contact form and info">
          <div className="section-container">
            <div className="grid md:grid-cols-3 gap-10 items-start">

              {/* ─── Contact info sidebar ────────────────────── */}
              <aside className="space-y-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-brand-900 mb-4">
                    Get In Touch
                  </h2>
                  <ul className="space-y-4 text-sm text-slate-600">
                    {[
                      { icon: '📧', label: 'Email',   value: 'contact@smatrixsolutions.com' },
                      { icon: '📞', label: 'Phone',   value: '+91 98765 43210' },
                      { icon: '📍', label: 'Address', value: 'Pune, Maharashtra, India' },
                      { icon: '🕐', label: 'Hours',   value: 'Mon–Sat: 8am – 8pm' },
                    ].map(({ icon, label, value }) => (
                      <li key={label} className="flex gap-3">
                        <span className="text-xl shrink-0">{icon}</span>
                        <div>
                          <p className="font-semibold text-brand-900 text-xs uppercase tracking-wide mb-0.5">{label}</p>
                          <p>{value}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-brand-700 text-white rounded-xl p-5">
                  <p className="font-semibold mb-1">Need urgent help?</p>
                  <p className="text-brand-200 text-sm">Call us directly for same-day service.</p>
                  <a href="tel:+919876543210" className="mt-3 inline-block font-bold text-accent-400 hover:text-white transition-colors">
                    +91 98765 43210 →
                  </a>
                </div>
              </aside>

              {/* ─── Contact form ────────────────────────────── */}
              <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <h2 className="font-display text-2xl font-bold text-brand-900 mb-6">
                  Send a Message
                </h2>

                {/* Success / error feedback banner */}
                {feedback && (
                  <div
                    role="alert"
                    className={`mb-6 p-4 rounded-lg text-sm font-medium ${
                      feedback.type === 'success'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                  >
                    {feedback.msg}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="grid sm:grid-cols-2 gap-5">

                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name" name="name" type="text"
                        value={form.name} onChange={handleChange}
                        placeholder="Riya Sharma"
                        className="form-input" required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email" name="email" type="email"
                        value={form.email} onChange={handleChange}
                        placeholder="riya@example.com"
                        className="form-input" required
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        id="phone" name="phone" type="tel"
                        value={form.phone} onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="form-input"
                      />
                    </div>

                    {/* Service dropdown — populated from DB */}
                    <div>
                      <label htmlFor="service_id" className="block text-sm font-medium text-slate-700 mb-1">
                        Service Required
                      </label>
                      <select
                        id="service_id" name="service_id"
                        value={form.service_id} onChange={handleChange}
                        className="form-input"
                      >
                        <option value="">Select a service…</option>
                        {services.map((s) => (
                          <option key={s.id} value={s.id}>{s.icon} {s.title}</option>
                        ))}
                      </select>
                    </div>

                    {/* Message */}
                    <div className="sm:col-span-2">
                      <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message" name="message" rows={5}
                        value={form.message} onChange={handleChange}
                        placeholder="Describe what you need…"
                        className="form-input resize-none" required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary mt-6 w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Sending…
                      </>
                    ) : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
