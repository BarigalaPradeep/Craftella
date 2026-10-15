import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Calendar, Clock, MapPin, ArrowRight, ShieldCheck, Ticket } from 'lucide-react';
import { usePaymentCards } from '../context/PaymentCardContext';
import PaymentCard from '../components/PaymentCard';

export default function Home() {
  const { activeCards, locationConfig } = usePaymentCards();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Craftella | De Art Workshop';
  }, []);

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative px-6 py-16 sm:px-8 sm:py-24 lg:py-28 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(122,165,242,0.16),transparent_70%)] pointer-events-none" />

        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start">
              <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-medium tracking-tight text-white leading-none">
                CRAFTELLA
              </h1>

              <h2 className="mt-2 font-serif text-2xl sm:text-3xl italic text-[#7AA5F2]">
                De Art Workshop
              </h2>

              <p className="mt-6 max-w-lg text-sm sm:text-base leading-relaxed text-[#9BB1D3]">
                Create. Sparkle. Express yourself. Join us for a creative rhinestone canvas art experience where your imagination becomes something you can take home.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/book-tickets"
                  className="animate-shimmer-sweep inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-lg bg-[#7AA5F2] px-6 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg shadow-[#7AA5F2]/25 hover:bg-[#578CE6] hover:shadow-[0_0_25px_rgba(122,165,242,0.55)] hover:-translate-y-0.5 transition-all"
                >
                  <Ticket className="h-4 w-4 text-white" />
                  <span className="text-white font-bold">Book Your Pass</span>
                </Link>

                <Link
                  to="/about"
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-[rgba(158,190,246,0.3)] bg-white/[0.03] px-6 text-xs font-bold tracking-wider text-white hover:border-[#7AA5F2] hover:bg-[rgba(122,165,242,0.1)] transition-all"
                >
                  <span>Discover Craftella</span>
                </Link>
              </div>
            </div>

            {/* Right Interactive Event Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="animate-float-slow spotlight-card w-full max-w-md rounded-3xl border border-[rgba(158,190,246,0.22)] bg-gradient-to-br from-[#16233B] via-[#111B2D] to-[#0A101C] p-8 shadow-2xl relative overflow-hidden group hover:border-[#7AA5F2]/45 transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(122,165,242,0.25),transparent_70%)]" />

                <div className="flex items-center justify-between border-b border-[rgba(158,190,246,0.15)] pb-4 text-[10px] font-bold tracking-[0.2em] text-[#9BB1D3]">
                  <span>THE EXPERIENCE</span>
                  <span className="rounded-full bg-[#7AA5F2]/15 px-2.5 py-1 text-[#7AA5F2] font-semibold uppercase">
                    {locationConfig?.eventDate
                      ? locationConfig.eventDate.replace(/^.*?,\s*/, '').slice(0, 11)
                      : '18 OCT 2026'}
                  </span>
                </div>

                <div className="my-6">
                  <div className="inline-block text-3xl text-[#7AA5F2] font-serif mb-2 animate-twinkle">✦</div>
                  <h3 className="font-serif text-3xl font-medium text-white">Craftella</h3>
                  <p className="text-xs tracking-wider text-[#7AA5F2] uppercase mt-1">
                    Rhinestone Canvas Art
                  </p>
                </div>

                <div className="space-y-3.5 border-t border-[rgba(158,190,246,0.15)] pt-6 text-xs">
                  <div className="flex items-center gap-3 text-[#CBD8ED]">
                    <Calendar className="h-4 w-4 text-[#7AA5F2]" />
                    <span>{locationConfig?.eventDate || 'Sunday, 18 October 2026'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[#CBD8ED]">
                    <Clock className="h-4 w-4 text-[#7AA5F2]" />
                    <span>{locationConfig?.eventTime || '2:00 PM – 5:00 PM'}</span>
                  </div>
                  <Link
                    to="/location"
                    className="flex items-center gap-3 text-[#CBD8ED] hover:text-[#7AA5F2] transition-colors group/venue"
                    title="View venue details & Google Maps directions"
                  >
                    <MapPin className="h-4 w-4 text-[#7AA5F2] group-hover/venue:scale-110 transition-transform" />
                    <span className="underline decoration-[#7AA5F2]/40 underline-offset-2">
                      {locationConfig?.venueName || '55 Bistro'}
                    </span>
                  </Link>
                </div>

                <div className="mt-8 pt-6 border-t border-[rgba(158,190,246,0.15)] flex items-center justify-between">
                  <span className="text-xs text-[#9BB1D3]">Passes from <strong className="text-white">₹499</strong></span>
                  <Link
                    to="/book-tickets"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#7AA5F2] px-4 py-2 text-xs font-bold text-white hover:bg-[#578CE6] transition-colors"
                  >
                    <span className="text-white font-bold">Book Pass</span>
                    <ArrowRight className="h-3.5 w-3.5 text-white" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED WORKSHOP PASSES (LIVE DYNAMIC CARDS FROM ADMIN) */}
      <section className="px-6 py-16 sm:px-8 border-t border-[rgba(158,190,246,0.15)] bg-[#0C1322]/80">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] text-[#7AA5F2] uppercase">
                CURATED PASSES
              </p>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-medium text-white">
                Live Workshop Passes
              </h2>
              <p className="mt-1 text-xs text-[#9BB1D3] max-w-xl">
                Every pass created in the Admin Dashboard is published here in real-time. Select a pass to reserve your spot.
              </p>
            </div>

            <Link
              to="/book-tickets"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#7AA5F2] hover:text-[#9EBEF6] transition-colors"
            >
              <span>Explore All Passes</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCards.slice(0, 3).map((card) => (
              <PaymentCard
                key={card.id}
                card={card}
                showSelectButton={true}
                actionButtonText="Reserve Pass"
                onSelect={() => {
                  navigate('/book-tickets');
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* QUICK LOCATION BANNER */}
      <section className="border-t border-[rgba(158,190,246,0.15)] bg-[#111B2D]/70 py-12 px-6 sm:px-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-[10px] font-bold tracking-[0.25em] text-[#7AA5F2] uppercase">VENUE PREVIEW</div>
            <h3 className="font-serif text-2xl text-white mt-1">Ready to find your way to {locationConfig?.venueName || '55 Bistro'}?</h3>
            <p className="text-xs text-[#9BB1D3] mt-1">Get directions, arrival guidelines, and step-by-step checklist on our dedicated location page.</p>
          </div>
          <Link
            to="/location"
            className="inline-flex items-center gap-2 rounded-lg border border-[#7AA5F2] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#7AA5F2] hover:bg-[#7AA5F2] hover:text-[#070D1A] transition-all shrink-0"
          >
            <span>Explore Location Page</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
