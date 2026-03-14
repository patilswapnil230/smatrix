// src/hooks/useServices.js
// Fetches services from the API.
// Falls back to built-in mock data if no backend is configured
// (e.g. when deployed as a static frontend on Netlify without a backend).

import { useState, useEffect } from 'react';
import api from '../utils/api';

// ── Mock data — shown when API is unavailable ─────────────────
// Update these or remove once you connect a real backend.
const MOCK_SERVICES = [
  {
    id: 1, title: 'Building Color', slug: 'building-color',
    description: 'Professional interior and exterior painting services using premium, durable paints. We bring colour and life to every wall.',
    icon: '🎨', image_url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&auto=format&fit=crop',
    price_from: 999,
  },
  {
    id: 2, title: 'Plumbing', slug: 'plumbing',
    description: 'Certified plumbers for leak repairs, pipe installations, bathroom fittings, and complete plumbing solutions.',
    icon: '🔧', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop',
    price_from: 499,
  },
  {
    id: 3, title: 'Furniture', slug: 'furniture',
    description: 'Custom furniture assembly, repair, and carpentry. From flat-pack to bespoke built-ins, we handle it all.',
    icon: '🪑', image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop',
    price_from: 799,
  },
  {
    id: 4, title: 'Maid Services', slug: 'maid-services',
    description: 'Thorough home cleaning, deep sanitisation, and regular housekeeping by trained, verified professionals.',
    icon: '🏠', image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop',
    price_from: 299,
  },
];

export function useServices() {
  const [services, setServices] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    let cancelled = false;

    api.get('/services')
      .then(({ data }) => {
        if (!cancelled) setServices(data.services);
      })
      .catch(() => {
        // API unavailable — use mock data so the UI still renders
        if (!cancelled) setServices(MOCK_SERVICES);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { services, loading, error };
}
