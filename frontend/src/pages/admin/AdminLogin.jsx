// src/pages/admin/AdminLogin.jsx
// Admin-only login screen. On success, stores JWT and redirects to /admin.

import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { login, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  const [form,  setForm]  = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  // Already logged in as admin — redirect immediately
  if (isAdmin) return <Navigate to="/admin" replace />;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await login(form.email, form.password);

    if (result.success) {
      navigate('/admin', { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | S-Matrix Solutions</title>
        <meta name="robots" content="noindex" /> {/* Hide login page from search engines */}
      </Helmet>

      <div className="min-h-screen bg-brand-900 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-display font-bold text-2xl">S</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-slate-400 text-sm mt-1">S-Matrix Solutions</p>
          </div>

          {/* Login card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="font-display text-xl font-bold text-brand-900 mb-6">Sign In</h2>

            {error && (
              <div role="alert" className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email" name="email" type="email"
                    value={form.email} onChange={handleChange}
                    placeholder="admin@smatrix.com"
                    className="form-input" required autoFocus
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                    Password
                  </label>
                  <input
                    id="password" name="password" type="password"
                    value={form.password} onChange={handleChange}
                    placeholder="••••••••"
                    className="form-input" required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center mt-6 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Signing in…
                  </>
                ) : 'Sign In'}
              </button>
            </form>
          </div>

          <p className="text-center text-slate-500 text-xs mt-6">
            This area is restricted to authorised administrators only.
          </p>
        </div>
      </div>
    </>
  );
}
