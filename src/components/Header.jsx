import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Home as HomeIcon,
  Ticket,
  MapPin,
  Info,
} from 'lucide-react';
import { eventData } from '../data/eventData';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu whenever route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Home', path: '/', icon: HomeIcon, desc: 'Event overview & highlights' },
    { label: 'Book Tickets', path: '/book-tickets', icon: Ticket, desc: 'Select pass & reserve seats' },
    { label: 'About Us', path: '/about', icon: Info, desc: 'Workshop details & story' },
    { label: 'Location & Venue', path: '/location', icon: MapPin, desc: '55 Bistro directions & timings' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[rgba(158,190,246,0.18)] bg-[#090E17]/95 backdrop-blur-md transition-all duration-200">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8 lg:px-12">
        {/* Brand Logo */}
        <Link
          to="/"
          className="group flex flex-col items-center text-center transition-transform hover:scale-[1.02]"
          aria-label="Craftella Home"
        >
          <span className="font-serif text-2xl font-semibold tracking-[0.12em] text-white group-hover:text-[#7AA5F2] transition-colors">
            {eventData.brand.name}
          </span>
          <span className="mt-0.5 font-sans text-[9px] font-bold tracking-[0.25em] text-[#7AA5F2]">
            {eventData.brand.subName}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex items-center gap-7 lg:gap-8"
        >
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `text-[13px] font-medium tracking-wide transition-all duration-200 hover:text-[#9EBEF6] ${
                  isActive
                    ? 'text-[#7AA5F2] font-semibold drop-shadow-[0_0_10px_rgba(122,165,242,0.4)]'
                    : 'text-[#CBD8ED]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* CTA Buttons & Admin portal toggle */}
        <div className="flex items-center gap-3">
          {/* Admin link button */}
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                isActive
                  ? 'border-[#7AA5F2] bg-[#7AA5F2]/20 text-white ring-1 ring-[#7AA5F2]/50 shadow-[0_0_15px_rgba(122,165,242,0.3)]'
                  : 'border-[rgba(158,190,246,0.25)] bg-white/[0.03] text-[#CBD8ED] hover:border-[#7AA5F2] hover:bg-[#7AA5F2]/10 hover:text-white'
              }`
            }
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#7AA5F2]" />
            <span>Admin</span>
          </NavLink>

          {/* Book Pass CTA */}
          <Link
            to="/book-tickets"
            className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-[#7AA5F2] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-white transition-all duration-200 hover:bg-[#578CE6] hover:shadow-[0_0_20px_rgba(122,165,242,0.45)] hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="text-white font-bold">Book Pass</span>
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex md:hidden items-center justify-center rounded-lg border border-[rgba(158,190,246,0.25)] p-2 text-[#7AA5F2] hover:bg-[#7AA5F2]/10 focus:outline-none focus:ring-2 focus:ring-[#7AA5F2]"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Rendered via Portal onto document.body to break free from header stacking context) */}
      {mobileMenuOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            id="mobile-navigation-modal"
            className="fixed inset-0 z-[99999] md:hidden flex flex-col bg-[#090E17] text-white w-screen h-[100dvh] overflow-hidden"
            style={{
              backgroundColor: '#090E17',
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 99999,
            }}
            role="dialog"
            aria-modal="true"
          >
            {/* Top Bar with brand logo, Admin button, and Close button */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(158,190,246,0.18)] bg-[#090E17] shrink-0 z-20">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-col items-start"
                aria-label="Craftella Home"
              >
                <span className="font-serif text-2xl font-semibold tracking-[0.12em] text-white">
                  {eventData.brand.name}
                </span>
                <span className="mt-0.5 font-sans text-[9px] font-bold tracking-[0.25em] text-[#7AA5F2]">
                  {eventData.brand.subName}
                </span>
              </Link>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/admin');
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider border border-[rgba(158,190,246,0.25)] bg-white/[0.04] text-[#CBD8ED] hover:text-white"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#7AA5F2]" />
                  <span>Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center rounded-lg border border-[rgba(158,190,246,0.25)] p-2 text-[#7AA5F2] hover:bg-[#7AA5F2]/10 focus:outline-none cursor-pointer"
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Floral Wallpaper framing layer */}
            <div
              className="absolute inset-0 pointer-events-none opacity-25 bg-cover bg-center"
              style={{
                backgroundImage: "url('/images/mobile-bg-flowers.png')",
              }}
              aria-hidden="true"
            />

            {/* Navigation Links Content */}
            <div className="relative z-10 flex flex-col flex-1 px-6 py-5 justify-between overflow-y-auto">
              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#9BB1D3] uppercase mb-1">
                  Menu Navigation
                </span>

                {navLinks.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate(item.path);
                      }}
                      className={`w-full flex items-center justify-between rounded-xl px-4 py-3.5 text-sm transition-all text-left cursor-pointer border ${
                        isActive
                          ? 'bg-[rgba(122,165,242,0.18)] text-[#7AA5F2] font-semibold border-[#7AA5F2] shadow-sm'
                          : 'text-[#CBD8ED] bg-[#111B2D]/90 hover:bg-[#16233B] border-[rgba(158,190,246,0.15)] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                            isActive
                              ? 'bg-[#7AA5F2] text-[#070D1A]'
                              : 'bg-white/[0.05] text-[#7AA5F2]'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">{item.label}</div>
                          <div className="text-[11px] text-[#9BB1D3]">{item.desc}</div>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#7AA5F2] opacity-70 shrink-0" />
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/admin');
                  }}
                  className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-sm transition-all text-left mt-1 border cursor-pointer ${
                    location.pathname === '/admin'
                      ? 'border-[#7AA5F2] bg-[#7AA5F2]/20 text-white font-semibold'
                      : 'border-white/10 bg-[#111B2D]/70 text-[#CBD8ED] hover:bg-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] text-[#7AA5F2]">
                      <ShieldCheck className="w-4 h-4 text-[#7AA5F2]" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Admin Management Portal</div>
                      <div className="text-[10px] text-[#9BB1D3]">Edit passes, payments &amp; venue</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#7AA5F2] opacity-70 shrink-0" />
                </button>
              </div>

              <div className="pt-4 pb-4 border-t border-[rgba(158,190,246,0.15)] flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/book-tickets');
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#578CE6] to-[#7AA5F2] py-3.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(122,165,242,0.45)] hover:from-[#4375CE] hover:to-[#578CE6] active:scale-[0.99] transition-all cursor-pointer"
                >
                  <span className="text-white font-bold text-sm tracking-wider">Book Pass Now</span>
                  <Sparkles className="w-4 h-4 text-white" />
                </button>
                <div className="text-center text-[11px] text-white/90">
                  Craftella • 18 October 2026 • 55 Bistro
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
}
