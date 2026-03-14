// src/components/Footer.jsx

import { Link } from 'react-router-dom';

const FOOTER_LINKS = [
  { to: '/',         label: 'Home'     },
  { to: '/services', label: 'Services' },
  { to: '/contact',  label: 'Contact'  },
  { to: '/admin',    label: 'Admin'    },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-900 text-slate-300 pt-14 pb-8 mt-auto">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-white/10">

          {/* ── Brand column ──────────────────────────────────── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                <span className="text-white font-display font-bold text-sm">S</span>
              </div>
              <span className="font-display font-bold text-white text-lg">S-Matrix Solutions</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Professional home services delivered by certified experts.
              Quality you can trust, every time.
            </p>
          </div>

          {/* ── Quick links ───────────────────────────────────── */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-slate-400 hover:text-white text-sm transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact info ──────────────────────────────────── */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>📧 contact@smatrixsolutions.com</li>
              <li>📞 +91 98765 43210</li>
              <li>📍 Pune, Maharashtra, India</li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────────────── */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>© {year} S-Matrix Solutions Pvt. Ltd. All rights reserved.</p>
          <p>Built with React &amp; Express</p>
        </div>
      </div>
    </footer>
  );
}
