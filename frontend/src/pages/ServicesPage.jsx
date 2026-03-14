// src/pages/ServicesPage.jsx
// Displays ALL active services in a responsive grid.
// Users can filter by keyword (client-side search).

import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ServiceCard from '../components/ServiceCard';
import { LoadingSpinner, ErrorMessage } from '../components/UIHelpers';
import { useServices } from '../hooks/useServices';

export default function ServicesPage() {
  const { services, loading, error } = useServices();
  const [query, setQuery] = useState('');

  // Client-side filter — instant results without extra API calls
  const filtered = services.filter((s) =>
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>All Services | S-Matrix Solutions</title>
        <meta
          name="description"
          content="Browse all professional home services offered by S-Matrix Solutions — painting, plumbing, furniture assembly, cleaning, and more."
        />
      </Helmet>

      <Navbar />

      <main>
        {/* ── Page header ───────────────────────────────────── */}
        <section className="bg-brand-900 text-white py-16">
          <div className="section-container">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Our Services
            </h1>
            <p className="text-slate-300 max-w-xl text-lg">
              Explore our full catalogue of professional home services.
              Every job is backed by our satisfaction guarantee.
            </p>

            {/* Search box */}
            <div className="mt-8 max-w-md relative">
              <input
                type="search"
                placeholder="Search services…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/10 border border-white/20
                           text-white placeholder-slate-400 focus:outline-none focus:ring-2
                           focus:ring-accent-400 transition"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </section>

        {/* ── Services grid ─────────────────────────────────── */}
        <section className="py-16 bg-surface" aria-label="Services listing">
          <div className="section-container">
            {loading && <LoadingSpinner message="Fetching services…" />}
            {error   && <ErrorMessage message={error} />}

            {!loading && !error && (
              <>
                {filtered.length > 0 ? (
                  <>
                    <p className="text-slate-500 text-sm mb-6">
                      Showing {filtered.length} service{filtered.length !== 1 ? 's' : ''}
                      {query && ` for "${query}"`}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filtered.map((service) => (
                        <ServiceCard key={service.id} service={service} />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-16 text-slate-500">
                    <p className="text-2xl mb-2">🔍</p>
                    <p>No services match "<strong>{query}</strong>"</p>
                    <button
                      onClick={() => setQuery('')}
                      className="mt-4 btn-ghost text-sm"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
