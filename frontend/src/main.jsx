// src/main.jsx — Application entry point
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* HelmetProvider wraps the whole app so any page can set dynamic <head> tags */}
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
