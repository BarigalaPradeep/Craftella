import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { eventData } from '../data/eventData';

export default function BookingCTA() {
  const { bookingCTA } = eventData;

  return (
    <section
      className="mt-16 sm:mt-20 overflow-hidden rounded-[22px] border border-[rgba(158,190,246,0.2)] bg-[#111B2D] p-8 sm:p-10 shadow-2xl relative"
      style={{
        background:
          'radial-gradient(ellipse at right, rgba(87, 140, 230, 0.22), transparent 65%), #111B2D',
      }}
      aria-label="Booking call to action"
    >
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        {/* Left Copy */}
        <div className="max-w-xl">
          <div className="mb-2 inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.25em] text-[#7AA5F2] uppercase">
            <Sparkles className="h-3 w-3" />
            <span>Limited Spots</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-white">
            {bookingCTA.heading}
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-[#9BB1D3]">
            {bookingCTA.description}
          </p>
        </div>

        {/* Right CTA Button */}
        <Link
          to={bookingCTA.buttonLink}
          className="group inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2.5 rounded-[9px] border border-[#7AA5F2] bg-[#7AA5F2] px-6 text-xs font-extrabold uppercase tracking-wider text-white transition-all duration-200 hover:border-[#578CE6] hover:bg-[#578CE6] hover:shadow-[0_0_25px_rgba(122,165,242,0.4)] hover:-translate-y-0.5 active:translate-y-0"
        >
          <span className="text-white font-bold">{bookingCTA.buttonText}</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 text-white" />
        </Link>
      </div>
    </section>
  );
}
