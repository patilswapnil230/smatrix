// src/pages/HomePage.jsx
// Public landing page with Hero, Services Grid, Stats, and CTA sections.
// Services are fetched live from the API — fully dynamic.

import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ServiceCard from '../components/ServiceCard';
import { LoadingSpinner, ErrorMessage } from '../components/UIHelpers';
import { useServices } from '../hooks/useServices';

// ── Stats data — update as needed ────────────────────────────
const STATS = [
  { value: '5,000+', label: 'Happy Customers' },
  { value: '12+',    label: 'Service Categories' },
  { value: '98%',    label: 'Satisfaction Rate' },
  { value: '24/7',   label: 'Support Available' },
];

// ── Why-choose-us bullets ─────────────────────────────────────
const WHY_US = [
  { icon: '✅', title: 'Verified Professionals', desc: 'Every technician is background-checked and certified.' },
  { icon: '⚡', title: 'Fast Response',          desc: 'Book same-day or schedule at your convenience.' },
  { icon: '💰', title: 'Transparent Pricing',    desc: 'No surprises — see the full quote before we start.' },
  { icon: '🔒', title: 'Insured & Guaranteed',   desc: '100% satisfaction guarantee on every job.' },
];

export default function HomePage() {
  const { services, loading, error } = useServices();

  // Show only the first 4 on the homepage; the rest live on /services
  const featuredServices = services.slice(0, 4);

  return (
    <>
      {/* ── Dynamic SEO tags via react-helmet-async ─────────── */}
      <Helmet>
        <title>S-Matrix Solutions Pvt. Ltd. — Professional Home Services</title>
        <meta
          name="description"
          content="S-Matrix Solutions offers expert painting, plumbing, furniture, and maid services. Book certified professionals in minutes."
        />
        <meta property="og:title" content="S-Matrix Solutions — Home Services" />
        <meta property="og:description" content="Professional home services at your doorstep." />
      </Helmet>

      <Navbar />

      <main>
        {/* ════════════════════════════════════════════════════
            HERO SECTION
        ════════════════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden bg-brand-900 text-white"
          aria-label="Hero"
        >
          {/* Decorative background shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-700/40 blur-3xl" />
            <div className="absolute bottom-0 -left-24 w-80 h-80 rounded-full bg-accent-500/20 blur-3xl" />
            {/* Subtle grid texture */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />
          </div>

          <div className="section-container relative py-24 md:py-36">
            <div className="max-w-3xl">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 bg-brand-700/60 backdrop-blur-sm
                              border border-white/10 rounded-full px-4 py-1.5 mb-6
                              text-accent-400 text-sm font-medium animate-fade-up">
                <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse-soft" />
                Trusted by 5,000+ homeowners across India
              </div>

              {/* H1 — most important heading on the page for SEO */}
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 animate-fade-up stagger-1">
                Your Home Deserves{' '}
                <span className="gradient-text">Expert Care</span>
              </h1>

              <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-10 max-w-xl animate-fade-up stagger-2">
                From a fresh coat of paint to a complete plumbing overhaul — S-Matrix Solutions
                connects you with certified professionals who get it right the first time.
              </p>

              <div className="flex flex-wrap gap-4 animate-fade-up stagger-3">
                <Link to="/services" className="btn-primary text-base">
                  Explore Services
                </Link>
                <Link to="/contact" className="btn-secondary border-white/30 text-white
                                               hover:bg-white/10 hover:text-white text-base">
                  Get Free Quote
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            STATS BAR
        ════════════════════════════════════════════════════ */}
        <section className="bg-brand-700 text-white py-8" aria-label="Statistics">
          <div className="section-container">
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {STATS.map(({ value, label }) => (
                <div key={label} className="flex flex-col gap-1">
                  <dt className="font-display text-3xl font-bold text-white">{value}</dt>
                  <dd className="text-brand-200 text-sm">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            FEATURED SERVICES GRID
        ════════════════════════════════════════════════════ */}
        <section className="py-20 bg-surface" aria-labelledby="services-heading">
          <div className="section-container">
            {/* Section header */}
            <div className="text-center mb-12">
              <span className="badge mb-3">What We Offer</span>
              {/* H2 — section heading */}
              <h2 id="services-heading" className="section-heading mb-4">
                Our Popular Services
              </h2>
              <p className="text-slate-500 max-w-xl mx-auto">
                All services are performed by background-verified, insured professionals.
                Book online in under 2 minutes.
              </p>
            </div>

            {/* Dynamic grid from DB */}
            {loading && <LoadingSpinner message="Loading services…" />}
            {error   && <ErrorMessage message={error} />}

            {!loading && !error && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredServices.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}
                </div>

                {services.length > 4 && (
                  <div className="text-center mt-10">
                    <Link to="/services" className="btn-primary">
                      View All {services.length} Services
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            WHY CHOOSE US
        ════════════════════════════════════════════════════ */}
        <section className="py-20 bg-white" aria-labelledby="why-us-heading">
          <div className="section-container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left: copy */}
              <div>
                <span className="badge mb-3">Why S-Matrix</span>
                <h2 id="why-us-heading" className="section-heading mb-6">
                  The S-Matrix Difference
                </h2>
                <ul className="space-y-5">
                  {WHY_US.map(({ icon, title, desc }) => (
                    <li key={title} className="flex gap-4">
                      <span className="text-2xl shrink-0 mt-0.5" aria-hidden="true">{icon}</span>
                      <div>
                        <h3 className="font-semibold text-brand-900 mb-0.5">{title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link to="/contact" className="btn-primary">Book a Service Today</Link>
                </div>
              </div>

              {/* Right: visual block */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl h-80 md:h-96 bg-gradient-to-br from-brand-800 to-brand-600 flex items-center justify-center">
                <div className="text-center text-white px-8">
                  <p className="font-display text-5xl font-bold mb-3">5★</p>
                  <p className="text-brand-200 text-lg">Average rating</p>
                  <p className="text-brand-300 text-sm mt-2">Across 3,200+ reviews</p>
                </div>
                {/* Decorative circles */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/5" aria-hidden="true" />
                <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-accent-500/20" aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            CTA BANNER
        ════════════════════════════════════════════════════ */}
        <section className="py-16 bg-brand-700 text-white" aria-label="Call to action">
          <div className="section-container text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Home?
            </h2>
            <p className="text-brand-200 mb-8 max-w-xl mx-auto">
              Get in touch today for a free, no-obligation quote from our expert team.
            </p>
            <Link to="/contact" className="bg-white text-brand-700 hover:bg-brand-50
                                           font-semibold px-8 py-3 rounded-lg
                                           transition-all duration-200 shadow-md hover:shadow-lg
                                           hover:-translate-y-0.5 inline-flex items-center gap-2">
              Contact Us Now →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
