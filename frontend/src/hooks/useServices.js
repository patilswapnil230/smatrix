// src/hooks/useServices.js
// Reusable hook that fetches and caches the services list.
// Components call this instead of duplicating the fetch logic.

import { useState, useEffect } from 'react';
import api from '../utils/api';

export function useServices() {
  const [services, setServices] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    let cancelled = false; // Prevent state update if component unmounts

    api.get('/services')
      .then(({ data }) => {
        if (!cancelled) setServices(data.services);
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.error || 'Failed to load services');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { services, loading, error };
}
