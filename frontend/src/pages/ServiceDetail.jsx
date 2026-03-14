// src/pages/ServiceDetail.jsx
// Individual service page — fetched by :slug from the URL.
// Injects per-page SEO meta tags using react-helmet-async.

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { LoadingSpinner, ErrorMessage } from '../components/UIHelpers';
import api from '../utils/api';

export default function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    api.get(`/services/${slug}`)
      .then(({ data }) => setService(data.service))
      .catch((err) => {
        setError(err.response?.status === 404
          ? 'Service not found.'
          : 'Failed to load service. Please try again.'
        );
      })
      .finally(() => setLoading(false));
  }, [slug]); // Re-run when the slug changes (user navigates between services)

  return (
    <>
      {/* ── Dynamic per-page SEO ──────────────────────────── */}
      <Helmet>
        <title>{service?.meta_title || `${service?.title} | S-Matrix Solutions`}</title>
        <meta
          name="description"
          content={service?.meta_desc || service?.description || 'Professional home service by S-Matrix Solutions.'}
        />
        {/* Open Graph */}
        <meta property="og:title"       content={service?.meta_title || service?.title} />
        <meta property="og:description" content={service?.meta_desc  || service?.description} />
        {service?.image_url && (
          <meta property="og:image" content={service.image_url} />
        )}
      </Helmet>

      <Navbar />

      <main>
        {loading && (
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner message="Loading service…" />
          </div>
        )}

        {error && (
          <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <ErrorMessage message={error} />
            <Link to="/services" className="btn-secondary text-sm">
              ← Back to Services
            </Link>
          </div>
        )}

        {service && !loading && (
          <>
            {/* ── Hero banner ───────────────────────────────── */}
            <section
              className="relative h-64 md:h-80 bg-brand-900 overflow-hidden"
              aria-label="Service hero image"
            >
              {service.image_url && (
                <img
                  src={service.image_url}
                  alt={service.title}
                  className="w-full h-full object-cover opacity-40"
                />
              )}
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12
                              bg-gradient-to-t from-brand-900/90 to-transparent">
                <div className="section-container">
                  <Link
                    to="/services"
                    className="text-brand-300 hover:text-white text-sm mb-3 inline-flex items-center gap-1 transition-colors"
                  >
                    ← All Services
                  </Link>
                  {/* H1 for this page */}
                  <h1 className="font-display text-3xl md:text-5xl font-bold text-white flex items-center gap-3">
                    <span aria-hidden="true">{service.icon}</span>
                    {service.title}
                  </h1>
                  {service.price_from && (
                    <p className="text-accent-400 font-semibold mt-2">
                      Starting from ₹{Number(service.price_from).toLocaleString('en-IN')}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* ── Main content ──────────────────────────────── */}
            <section className="py-16 bg-surface" aria-label="Service details">
              <div className="section-container max-w-4xl">
                <div className="grid md:grid-cols-3 gap-10">
                  {/* Body text */}
                  <div className="md:col-span-2">
                    <h2 className="font-display text-2xl font-bold text-brand-900 mb-4">
                      About This Service
                    </h2>
                    <p className="text-slate-600 leading-relaxed mb-6 text-base">
                      {service.description}
                    </p>
                    {service.long_desc && (
                      <p className="text-slate-600 leading-relaxed text-base">
                        {service.long_desc}
                      </p>
                    )}
                  </div>

                  {/* Sidebar: booking CTA */}
                  <aside className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-fit">
                    <h3 className="font-display font-bold text-brand-900 text-lg mb-2">
                      Book This Service
                    </h3>
                    <p className="text-slate-500 text-sm mb-4">
                      Get a free, no-obligation quote from our certified team.
                    </p>
                    {service.price_from && (
                      <p className="text-2xl font-bold text-brand-700 mb-4">
                        ₹{Number(service.price_from).toLocaleString('en-IN')}
                        <span className="text-sm font-normal text-slate-400"> onwards</span>
                      </p>
                    )}
                    <Link
                      to={`/contact?service=${service.id}`}
                      className="btn-primary w-full justify-center"
                    >
                      Request a Quote
                    </Link>
                    <Link to="/services" className="btn-ghost text-sm mt-3 w-full justify-center">
                      Browse Other Services
                    </Link>
                  </aside>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
