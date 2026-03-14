// src/utils/api.js — Centralised Axios instance
// All API calls go through this helper so base URL and
// auth headers are set in ONE place (DRY principle).

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',          // Proxied to Express via Vite in dev
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach JWT if present ───────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('smatrix_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: handle 401 globally ────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — clear storage and redirect to login
      localStorage.removeItem('smatrix_token');
      localStorage.removeItem('smatrix_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;
