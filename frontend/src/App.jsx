// src/App.jsx — Root application component
// Sets up React Router, Auth context, and top-level route structure.

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public pages
import HomePage        from './pages/HomePage';
import ServicesPage    from './pages/ServicesPage';
import ServiceDetail   from './pages/ServiceDetail';
import ContactPage     from './pages/ContactPage';
import NotFoundPage    from './pages/NotFoundPage';

// Admin pages
import AdminLogin      from './pages/admin/AdminLogin';
import AdminDashboard  from './pages/admin/AdminDashboard';

// ── ProtectedRoute: redirects non-admins to login ────────────
function ProtectedRoute({ children }) {
  const { user, isAdmin } = useAuth();
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Public routes ──────────────────────────────── */}
          <Route path="/"               element={<HomePage />} />
          <Route path="/services"       element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/contact"        element={<ContactPage />} />

          {/* ── Admin routes ───────────────────────────────── */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* ── 404 fallback ───────────────────────────────── */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
