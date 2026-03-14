// src/components/Navbar.jsx
// Responsive top navigation bar with mobile hamburger menu.
// Highlights the active route link automatically.

import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/',         label: 'Home'     },
  { to: '/services', label: 'Services' },
  { to: '/contact',  label: 'Contact'  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // Active link styling helper
  const linkClass = ({ isActive }) =>
    isActive
      ? 'text-brand-600 font-semibold border-b-2 border-brand-600 pb-0.5'
      : 'text-slate-600 hover:text-brand-700 font-medium transition-colors duration-150';

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100">
      <nav className="section-container flex items-center justify-between h-16">

        {/* ── Logo ──────────────────────────────────────────── */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-brand-700 flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">S</span>
          </div>
          <span className="font-display font-bold text-brand-900 text-lg leading-tight hidden sm:block">
            S-Matrix <span className="text-brand-600 font-normal text-sm block leading-none">Solutions</span>
          </span>
        </Link>

        {/* ── Desktop links ─────────────────────────────────── */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ to, label }) => (
            <li key={to}>
              <NavLink to={to} end={to === '/'} className={linkClass}>{label}</NavLink>
            </li>
          ))}
        </ul>

        {/* ── CTA button (desktop) ──────────────────────────── */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/contact" className="btn-primary text-sm py-2 px-4">
            Get a Quote
          </Link>
        </div>

        {/* ── Hamburger (mobile) ────────────────────────────── */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
        >
          {mobileOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* ── Mobile menu drawer ────────────────────────────────── */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 py-4 animate-fade-in">
          <ul className="flex flex-col section-container gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <li className="mt-2">
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="btn-primary w-full justify-center text-sm"
              >
                Get a Quote
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
