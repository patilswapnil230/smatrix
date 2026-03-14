// src/components/ServiceCard.jsx
// Reusable card component for displaying a service in a grid.
// Used on HomePage, ServicesPage, and anywhere a service list is rendered.

import { Link } from 'react-router-dom';

export default function ServiceCard({ service }) {
  const { title, slug, description, icon, image_url, price_from } = service;

  return (
    <article className="card group flex flex-col h-full">

      {/* ── Card image ──────────────────────────────────────── */}
      <div className="relative h-48 overflow-hidden bg-slate-100 shrink-0">
        {image_url ? (
          <img
            src={image_url}
            alt={`${title} service`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          /* Fallback gradient with icon when no image is set */
          <div className="w-full h-full bg-gradient-to-br from-brand-700 to-accent-500
                          flex items-center justify-center text-5xl">
            {icon || '🔧'}
          </div>
        )}

        {/* Price badge — shown only if price_from is set */}
        {price_from && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm
                          text-brand-800 text-xs font-bold px-2 py-1 rounded-full shadow">
            From ₹{Number(price_from).toLocaleString('en-IN')}
          </div>
        )}
      </div>

      {/* ── Card body ───────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl" aria-hidden="true">{icon}</span>
          {/* Semantic H3 — inside a section with an H2, this is correct hierarchy */}
          <h3 className="font-display font-bold text-brand-900 text-lg leading-tight">
            {title}
          </h3>
        </div>

        <p className="text-slate-500 text-sm leading-relaxed flex-1 line-clamp-3">
          {description}
        </p>

        <Link
          to={`/services/${slug}`}
          className="mt-4 btn-secondary text-sm py-2 justify-center"
          aria-label={`Learn more about ${title}`}
        >
          Learn More →
        </Link>
      </div>
    </article>
  );
}
