// src/pages/NotFoundPage.jsx

import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>Page Not Found | S-Matrix Solutions</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Navbar />
      <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20 bg-surface">
        <p className="text-7xl mb-6">🏗️</p>
        <h1 className="font-display text-4xl font-bold text-brand-900 mb-3">
          Page Not Found
        </h1>
        <p className="text-slate-500 max-w-md mb-8">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/" className="btn-primary">Go to Homepage</Link>
          <Link to="/services" className="btn-secondary">Browse Services</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
