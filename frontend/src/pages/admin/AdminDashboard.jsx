// src/pages/admin/AdminDashboard.jsx
// Protected admin dashboard. Two tabs:
//   1. Services — full CRUD with modal form
//   2. Messages — view contact form submissions

import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

// ── Blank service template for the "Add" form ────────────────
const BLANK_SERVICE = {
  title: '', slug: '', description: '', long_desc: '',
  icon: '', image_url: '', price_from: '', is_active: true,
  sort_order: 0, meta_title: '', meta_desc: '',
};

// ── Auto-generate slug from title ────────────────────────────
const toSlug = (str) =>
  str.toLowerCase().trim()
     .replace(/[^a-z0-9\s-]/g, '')
     .replace(/\s+/g, '-');

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();

  const [activeTab,  setActiveTab]  = useState('services');
  const [services,   setServices]   = useState([]);
  const [messages,   setMessages]   = useState([]);
  const [svcLoading, setSvcLoading] = useState(true);
  const [msgLoading, setMsgLoading] = useState(false);
  const [error,      setError]      = useState('');

  // ── Modal state ────────────────────────────────────────────
  const [showModal,  setShowModal]  = useState(false);
  const [editTarget, setEditTarget] = useState(null);    // null = new, id = edit
  const [formData,   setFormData]   = useState(BLANK_SERVICE);
  const [saving,     setSaving]     = useState(false);
  const [formError,  setFormError]  = useState('');

  // ── Confirm-delete state ───────────────────────────────────
  const [deleteId,   setDeleteId]   = useState(null);
  const [deleting,   setDeleting]   = useState(false);

  // ─── Fetch all services (incl. inactive) ──────────────────
  const fetchServices = useCallback(async () => {
    setSvcLoading(true);
    try {
      const { data } = await api.get('/admin/services');
      setServices(data.services);
    } catch {
      setError('Failed to load services');
    } finally {
      setSvcLoading(false);
    }
  }, []);

  // ─── Fetch contact messages ────────────────────────────────
  const fetchMessages = useCallback(async () => {
    setMsgLoading(true);
    try {
      const { data } = await api.get('/admin/contact');
      setMessages(data.messages);
    } catch {
      setError('Failed to load messages');
    } finally {
      setMsgLoading(false);
    }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);
  useEffect(() => {
    if (activeTab === 'messages') fetchMessages();
  }, [activeTab, fetchMessages]);

  // ─── Open modal for create or edit ────────────────────────
  const openModal = (service = null) => {
    setFormError('');
    if (service) {
      setEditTarget(service.id);
      setFormData({ ...service, price_from: service.price_from ?? '' });
    } else {
      setEditTarget(null);
      setFormData(BLANK_SERVICE);
    }
    setShowModal(true);
  };

  // ─── Handle form field changes ────────────────────────────
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: type === 'checkbox' ? checked : value };
      // Auto-generate slug when the title changes (only on new services)
      if (name === 'title' && !editTarget) {
        updated.slug = toSlug(value);
      }
      return updated;
    });
  };

  // ─── Save (create or update) ──────────────────────────────
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.slug || !formData.description) {
      setFormError('Title, slug, and description are required.');
      return;
    }

    setSaving(true);
    setFormError('');
    try {
      if (editTarget) {
        await api.put(`/admin/services/${editTarget}`, formData);
      } else {
        await api.post('/admin/services', formData);
      }
      setShowModal(false);
      fetchServices();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete ───────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/admin/services/${deleteId}`);
      setDeleteId(null);
      fetchServices();
    } catch {
      setError('Delete failed. Try again.');
    } finally {
      setDeleting(false);
    }
  };

  // ─── Mark message as read ─────────────────────────────────
  const markRead = async (id) => {
    try {
      await api.patch(`/admin/contact/${id}/read`);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_read: true } : m))
      );
    } catch {
      /* silent fail */
    }
  };

  // ─── Logout ───────────────────────────────────────────────
  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | S-Matrix Solutions</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-screen bg-slate-50 flex flex-col">

        {/* ── Top bar ─────────────────────────────────────── */}
        <header className="bg-brand-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <span className="font-display font-bold text-sm">S</span>
            </div>
            <div>
              <span className="font-display font-bold text-lg hidden sm:inline">S-Matrix</span>
              <span className="text-brand-300 text-sm ml-2 hidden sm:inline">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-300 text-sm hidden md:inline">
              👋 {user?.name}
            </span>
            <a href="/" target="_blank" rel="noreferrer"
               className="text-slate-300 hover:text-white text-sm transition-colors">
              View Site ↗
            </a>
            <button onClick={handleLogout}
                    className="bg-white/10 hover:bg-white/20 text-white text-sm px-3 py-1.5 rounded-lg transition-colors">
              Logout
            </button>
          </div>
        </header>

        {/* ── Main content ────────────────────────────────── */}
        <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">

          {/* Page heading */}
          <h1 className="font-display text-2xl font-bold text-brand-900 mb-6">
            Dashboard
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* ── Tabs ──────────────────────────────────────── */}
          <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 shadow-sm border border-slate-100 w-fit">
            {[
              { key: 'services', label: '🛠 Services',  count: services.length },
              { key: 'messages', label: '✉️ Messages',  count: unreadCount || null },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center gap-2 ${
                  activeTab === key
                    ? 'bg-brand-700 text-white shadow'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {label}
                {count !== null && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === key ? 'bg-white/20 text-white' : 'bg-brand-100 text-brand-700'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ══════════════════════════════════════════════════
              TAB: SERVICES
          ══════════════════════════════════════════════════ */}
          {activeTab === 'services' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-700">
                  {services.length} Service{services.length !== 1 ? 's' : ''}
                </h2>
                <button onClick={() => openModal()} className="btn-primary text-sm py-2 px-4">
                  + Add Service
                </button>
              </div>

              {svcLoading ? (
                <div className="text-center py-10 text-slate-500">Loading…</div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          {['Icon', 'Title', 'Slug', 'Price From', 'Status', 'Order', 'Actions'].map((h) => (
                            <th key={h} className="text-left px-4 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wide whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {services.map((svc) => (
                          <tr key={svc.id} className="admin-tr">
                            <td className="px-4 py-3 text-xl">{svc.icon || '—'}</td>
                            <td className="px-4 py-3 font-medium text-brand-900 whitespace-nowrap">{svc.title}</td>
                            <td className="px-4 py-3 font-mono text-xs text-slate-500">{svc.slug}</td>
                            <td className="px-4 py-3 text-slate-600">
                              {svc.price_from ? `₹${Number(svc.price_from).toLocaleString('en-IN')}` : '—'}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`badge ${svc.is_active ? '' : 'bg-slate-100 text-slate-500'}`}>
                                {svc.is_active ? '✅ Active' : '⛔ Hidden'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-500">{svc.sort_order}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => openModal(svc)}
                                  className="text-brand-600 hover:text-brand-800 text-xs font-medium hover:underline"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => setDeleteId(svc.id)}
                                  className="text-red-500 hover:text-red-700 text-xs font-medium hover:underline"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {services.length === 0 && (
                      <p className="text-center text-slate-500 py-12 text-sm">
                        No services yet. Click "+ Add Service" to create the first one.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════
              TAB: MESSAGES
          ══════════════════════════════════════════════════ */}
          {activeTab === 'messages' && (
            <div>
              <h2 className="font-semibold text-slate-700 mb-4">
                {messages.length} Message{messages.length !== 1 ? 's' : ''}
                {unreadCount > 0 && (
                  <span className="ml-2 badge">{unreadCount} unread</span>
                )}
              </h2>

              {msgLoading ? (
                <div className="text-center py-10 text-slate-500">Loading…</div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`bg-white rounded-xl p-5 shadow-sm border transition-all ${
                        msg.is_read ? 'border-slate-100' : 'border-brand-300 border-l-4'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <p className="font-semibold text-brand-900">{msg.name}</p>
                          <p className="text-slate-500 text-xs">{msg.email}{msg.phone ? ` • ${msg.phone}` : ''}</p>
                          {msg.service && (
                            <p className="text-xs text-brand-600 mt-0.5">Re: {msg.service.title}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs text-slate-400">
                            {new Date(msg.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })}
                          </span>
                          {!msg.is_read && (
                            <button
                              onClick={() => markRead(msg.id)}
                              className="text-xs text-brand-600 hover:text-brand-800 font-medium hover:underline"
                            >
                              Mark Read
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="mt-3 text-slate-700 text-sm leading-relaxed border-t border-slate-100 pt-3">
                        {msg.message}
                      </p>
                    </div>
                  ))}

                  {messages.length === 0 && (
                    <p className="text-center text-slate-500 py-12 text-sm bg-white rounded-2xl border border-slate-100">
                      No messages yet.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          SERVICE MODAL (Create / Edit)
      ════════════════════════════════════════════════════ */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="font-display font-bold text-brand-900 text-xl">
                {editTarget ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                  {formError}
                </div>
              )}

              {/* Two-col grid for short fields */}
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Title *"      name="title"      value={formData.title}      onChange={handleFormChange} placeholder="e.g., Electrical" />
                <FormField label="Slug *"       name="slug"       value={formData.slug}       onChange={handleFormChange} placeholder="e.g., electrical" hint="URL identifier — auto-generated from title" />
                <FormField label="Icon (emoji)" name="icon"       value={formData.icon}       onChange={handleFormChange} placeholder="⚡" />
                <FormField label="Price From (₹)" name="price_from" value={formData.price_from} onChange={handleFormChange} type="number" placeholder="499" />
                <FormField label="Image URL"    name="image_url"  value={formData.image_url}  onChange={handleFormChange} placeholder="https://…" className="sm:col-span-2" />
                <FormField label="Sort Order"   name="sort_order" value={formData.sort_order} onChange={handleFormChange} type="number" placeholder="0" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Short Description *
                </label>
                <textarea
                  name="description" rows={3}
                  value={formData.description} onChange={handleFormChange}
                  placeholder="Brief description shown on service cards…"
                  className="form-input resize-none" required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Description
                </label>
                <textarea
                  name="long_desc" rows={4}
                  value={formData.long_desc} onChange={handleFormChange}
                  placeholder="Detailed content shown on the service detail page…"
                  className="form-input resize-none"
                />
              </div>

              {/* SEO fields */}
              <details className="border border-slate-200 rounded-lg p-4">
                <summary className="text-sm font-medium text-slate-600 cursor-pointer select-none">
                  SEO Settings (optional)
                </summary>
                <div className="mt-4 space-y-3">
                  <FormField label="Meta Title (≤160 chars)"  name="meta_title" value={formData.meta_title} onChange={handleFormChange} placeholder="Electrical Services | S-Matrix Solutions" />
                  <FormField label="Meta Description (≤320 chars)" name="meta_desc" value={formData.meta_desc} onChange={handleFormChange} placeholder="Safe, certified electrical services…" />
                </div>
              </details>

              {/* Active toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox" name="is_active"
                  checked={formData.is_active} onChange={handleFormChange}
                  className="w-4 h-4 accent-brand-600"
                />
                <span className="text-sm font-medium text-slate-700">Visible to the public</span>
              </label>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary text-sm py-2 px-4">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary text-sm py-2 px-4 disabled:opacity-60">
                  {saving ? 'Saving…' : editTarget ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          DELETE CONFIRMATION MODAL
      ════════════════════════════════════════════════════ */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
            <p className="text-3xl mb-3">⚠️</p>
            <h3 className="font-display font-bold text-brand-900 text-lg mb-2">Delete Service?</h3>
            <p className="text-slate-500 text-sm mb-6">
              This action cannot be undone. The service will be permanently removed.
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteId(null)} className="btn-secondary text-sm py-2 px-4">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-60"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Tiny DRY helper for form fields ──────────────────────────
function FormField({ label, name, value, onChange, type = 'text', placeholder, hint, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder}
        className="form-input"
      />
      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}
