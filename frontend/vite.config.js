import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  // Expose the backend URL to the app as import.meta.env.VITE_API_URL
  // In production this is set via Netlify environment variables.
  // In development the proxy below forwards /api to localhost:5000.
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
