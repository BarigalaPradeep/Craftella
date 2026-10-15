import React from 'react';
import { Sparkles, Clock, MapPin, ExternalLink } from 'lucide-react';

const iconMap = {
  sparkles: Sparkles,
  clock: Clock,
  mapPin: MapPin,
};

export default function EventInfoCard({ label, value, description, icon, href }) {
  const IconComponent = iconMap[icon] || Sparkles;
  const Component = href ? 'a' : 'article';
  const linkProps = href
    ? {
        href,
        target: '_blank',
        rel: 'noopener noreferrer',
        title: `Open ${value} in Google Maps (opens in a new tab)`,
      }
    : {};

  return (
    <Component
      {...linkProps}
      className={`group relative overflow-hidden rounded-[18px] border border-[rgba(158,190,246,0.2)] bg-gradient-to-br from-[rgba(22,35,59,0.9)] to-[rgba(12,19,34,0.95)] p-6 transition-all duration-300 hover:border-[rgba(158,190,246,0.45)] hover:shadow-[0_10px_30px_rgba(122,165,242,0.12)] hover:-translate-y-1 block ${
        href ? 'cursor-pointer hover:border-[#7AA5F2]' : ''
      }`}
    >
      {/* Decorative subtle ambient blue glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-[#7AA5F2]/10 blur-2xl transition-opacity group-hover:opacity-100" />

      {/* Top Bar: Icon & External Link Badge */}
      <div className="mb-5 flex items-center justify-between">
        <div
          className="flex h-[44px] w-[44px] items-center justify-center rounded-[13px] border border-[rgba(158,190,246,0.25)] bg-[rgba(122,165,242,0.1)] text-[#7AA5F2] shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:border-[#7AA5F2]/50 group-hover:text-[#9EBEF6]"
          aria-hidden="true"
        >
          <IconComponent className="h-5 w-5" />
        </div>

        {href && (
          <span className="inline-flex items-center gap-1 rounded-md bg-[#7AA5F2]/10 px-2 py-1 text-[10px] font-bold text-[#7AA5F2] border border-[#7AA5F2]/20 group-hover:bg-[#7AA5F2]/25 group-hover:text-white transition-all">
            <span>Maps</span>
            <ExternalLink className="h-2.5 w-2.5" />
          </span>
        )}
      </div>

      {/* Card Header Label */}
      <small className="block text-[10px] font-bold tracking-[0.2em] text-[#9BB1D3] uppercase">
        {label}
      </small>

      {/* Main Value */}
      <h3 className="mt-2 text-base font-semibold text-white leading-snug group-hover:text-[#7AA5F2] transition-colors">
        {value}
      </h3>

      {/* Additional Description */}
      <p className="mt-2 text-xs leading-relaxed text-[#9BB1D3]">
        {description}
      </p>
    </Component>
  );
}
