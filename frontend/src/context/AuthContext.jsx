// src/context/AuthContext.jsx
// Provides authentication state to every component via React Context.
// Avoids prop-drilling auth data through the component tree.

import { createContext, useContext, useState, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialise from localStorage so the user stays logged in on refresh
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('smatrix_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // ── login: POST credentials, store token + user ─────────────
  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('smatrix_token', data.token);
      localStorage.setItem('smatrix_user', JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── logout: clear everything ─────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('smatrix_token');
    localStorage.removeItem('smatrix_user');
    setUser(null);
  }, []);

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for convenient consumption
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
