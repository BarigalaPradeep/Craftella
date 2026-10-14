import React from 'react';
import { Sparkles, Clock, MapPin } from 'lucide-react';

const iconMap = {
  sparkles: Sparkles,
  clock: Clock,
  mapPin: MapPin,
};

export default function EventInfoCard({ label, value, description, icon }) {
  const IconComponent = iconMap[icon] || Sparkles;

  return (
    <article className="group relative overflow-hidden rounded-[18px] border border-[rgba(158,190,246,0.2)] bg-gradient-to-br from-[rgba(22,35,59,0.9)] to-[rgba(12,19,34,0.95)] p-6 transition-all duration-300 hover:border-[rgba(158,190,246,0.45)] hover:shadow-[0_10px_30px_rgba(122,165,242,0.12)] hover:-translate-y-1">
      {/* Decorative subtle ambient blue glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-[#7AA5F2]/10 blur-2xl transition-opacity group-hover:opacity-100" />

      {/* Icon */}
      <div
        className="mb-5 flex h-[44px] w-[44px] items-center justify-center rounded-[13px] border border-[rgba(158,190,246,0.25)] bg-[rgba(122,165,242,0.1)] text-[#7AA5F2] shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:border-[#7AA5F2]/50 group-hover:text-[#9EBEF6]"
        aria-hidden="true"
      >
        <IconComponent className="h-5 w-5" />
      </div>

      {/* Card Header Label */}
      <small className="block text-[10px] font-bold tracking-[0.2em] text-[#9BB1D3] uppercase">
        {label}
      </small>

      {/* Main Value */}
      <h3 className="mt-2 text-base font-semibold text-white leading-snug">
        {value}
      </h3>

      {/* Additional Description */}
      <p className="mt-2 text-xs leading-relaxed text-[#9BB1D3]">
        {description}
      </p>
    </article>
  );
}
