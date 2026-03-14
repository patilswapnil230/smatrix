// src/utils/api.js — Centralised Axios instance
// Production (Netlify): set VITE_API_URL in Netlify environment variables
// Development: Vite proxy forwards /api → localhost:5000

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('smatrix_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally — clear auth and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('smatrix_token');
      localStorage.removeItem('smatrix_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;
