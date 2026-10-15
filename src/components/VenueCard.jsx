import React, { useState } from 'react';
import { ExternalLink, MapPin, Check, Copy, Navigation } from 'lucide-react';
import { eventData } from '../data/eventData';
import { usePaymentCards } from '../context/PaymentCardContext';

export default function VenueCard() {
  const [copied, setCopied] = useState(false);
  const { locationConfig } = usePaymentCards();
  const venue = locationConfig || eventData.venue;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(venue.googleMapsUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="mt-16 sm:mt-20" aria-labelledby="venue-heading">
      {/* Section Kicker */}
      <div className="mb-3 text-[10px] font-bold tracking-[0.3em] text-[#7AA5F2] uppercase">
        {venue.kicker}
      </div>

      {/* Heading */}
      <h2
        id="venue-heading"
        className="font-serif text-3xl font-normal sm:text-4xl md:text-5xl text-white"
      >
        {venue.heading}
      </h2>

      {/* Short venue description */}
      <p className="mt-3.5 max-w-[580px] text-sm leading-relaxed text-[#9BB1D3]">
        {venue.description}
      </p>

      {/* Official Event Venue Information Card */}
      <div className="spotlight-card mt-8 grid grid-cols-1 md:grid-cols-12 overflow-hidden rounded-[22px] border border-[rgba(158,190,246,0.2)] bg-[#111B2D] shadow-2xl transition-all duration-300 hover:border-[rgba(158,190,246,0.35)]">
        {/* Left Side: Venue Visual Orbit */}
        <div
          className="relative flex min-h-[260px] md:min-h-[360px] md:col-span-6 lg:col-span-5 items-center justify-center overflow-hidden bg-gradient-to-br from-[#16233B] to-[#0A101C]"
          aria-hidden="true"
        >
          {/* Radial glow backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(87,140,230,0.25),transparent_60%)]" />

          {/* Animated concentric orbit rings */}
          <div className="relative flex items-center justify-center">
            {/* Outer ring */}
            <div className="absolute h-[250px] w-[250px] rounded-full border border-[rgba(158,190,246,0.18)] animate-[pulse_4s_ease-in-out_infinite]" />
            {/* Middle ring */}
            <div className="absolute h-[190px] w-[190px] rounded-full border border-[rgba(158,190,246,0.15)]" />
            {/* Inner ring */}
            <div className="absolute h-[130px] w-[130px] rounded-full border border-[rgba(158,190,246,0.22)]" />

            {/* Glowing hydrangea venue pin */}
            <div className="animate-float-slow relative z-10 flex h-[86px] w-[86px] -rotate-6 items-center justify-center rounded-[28px] border border-[rgba(227,237,252,0.7)] bg-gradient-to-br from-[#9EBEF6] via-[#7AA5F2] to-[#578CE6] text-[#070D1A] shadow-[0_15px_50px_rgba(87,140,230,0.38)] transition-transform duration-300 hover:rotate-0 hover:scale-105">
              <MapPin className="h-10 w-10 text-[#070D1A] stroke-[2.2]" />
            </div>
          </div>
        </div>

        {/* Right Side: Venue Information */}
        <div className="flex flex-col items-start justify-center p-7 sm:p-9 md:col-span-6 lg:col-span-7">
          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-[rgba(158,190,246,0.25)] bg-[rgba(122,165,242,0.08)] px-3.5 py-1.5 text-[10px] font-bold tracking-[0.18em] text-[#7AA5F2]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#578CE6] animate-pulse" />
            {venue.status}
          </div>

          {/* Venue Name */}
          <h3 className="font-serif text-3xl font-medium sm:text-4xl text-white">
            {venue.venueName || venue.name}
          </h3>

          {/* Address */}
          {venue.address && (
            <p className="mt-1.5 text-xs text-[#7AA5F2] flex items-center gap-1.5 font-medium">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span>{venue.address}</span>
            </p>
          )}

          {/* Details */}
          <p className="mt-3.5 max-w-[500px] text-sm leading-relaxed text-[#9BB1D3]">
            {venue.infoText}
          </p>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {/* Get Directions Button */}
            <a
              href={venue.googleMapsUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="animate-shimmer-sweep inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[9px] border border-[#7AA5F2] bg-[#7AA5F2] px-6 text-xs font-extrabold uppercase tracking-wider text-[#070D1A] transition-all duration-200 hover:border-[#578CE6] hover:bg-[#578CE6] hover:shadow-[0_0_25px_rgba(122,165,242,0.4)] hover:-translate-y-0.5 active:translate-y-0"
              aria-label={`Get directions to ${venue.venueName || venue.name || 'Venue'} on Google Maps (opens in a new tab)`}
            >
              <Navigation className="h-4 w-4" />
              <span>{venue.buttonText}</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>

            {/* Copy Map Link Button */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[9px] border border-[rgba(158,190,246,0.25)] bg-transparent px-4 text-xs font-semibold text-[#CBD8ED] transition-colors hover:border-[#7AA5F2] hover:bg-[rgba(122,165,242,0.08)] hover:text-white"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span className="text-emerald-400">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy Map Link</span>
                </>
              )}
            </button>
          </div>

          {/* Venue Note */}
          <div className="mt-6 w-full max-w-[540px] rounded-r-md border-l-2 border-[#7AA5F2] bg-[rgba(122,165,242,0.08)] px-4 py-3 text-xs leading-relaxed text-[#E3EDFC]">
            {venue.note}
          </div>
        </div>
      </div>
    </section>
  );
}
