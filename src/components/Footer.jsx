import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="w-full border-t border-[rgba(158,190,246,0.12)] bg-[#070C15] text-[#CBD8ED] pt-14 pb-8 transition-colors">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8 pb-12 border-b border-white/[0.08]">
          {/* Brand Column (Left) */}
          <div className="lg:col-span-4 flex flex-col items-start space-y-4">
            {/* Logo: Sparkle cluster + CRAFTELLA */}
            <Link to="/" className="group flex items-center gap-3 transition-transform hover:scale-[1.01]">
              <svg
                className="h-10 w-10 shrink-0 text-[#E6BE8A] transition-transform duration-300 group-hover:rotate-6"
                viewBox="0 0 60 60"
                fill="currentColor"
                aria-hidden="true"
              >
                {/* Large 4-pointed star */}
                <path d="M 22 4 Q 22 24 2 24 Q 22 24 22 44 Q 22 24 42 24 Q 22 24 22 4 Z" fill="#E8C78B" />
                {/* Medium top-right star */}
                <path d="M 45 12 Q 45 22 35 22 Q 45 22 45 32 Q 45 22 55 22 Q 45 22 45 12 Z" fill="#E8C78B" />
                {/* Small bottom-right star */}
                <path d="M 41 37 Q 41 43 35 43 Q 41 43 41 49 Q 41 43 47 43 Q 41 43 41 37 Z" fill="#E8C78B" />
              </svg>

              <div>
                <span className="font-serif text-2xl font-bold tracking-[0.12em] text-white block leading-tight">
                  CRAFTELLA
                </span>
                <span className="font-sans text-[9px] font-semibold tracking-[0.3em] text-[#9BB1D3] block mt-0.5 uppercase">
                  DE ART WORKSHOP
                </span>
              </div>
            </Link>

            {/* Subtitle */}
            <p className="text-xs text-[#9BB1D3] max-w-xs leading-relaxed">
              Premium craft kits and creative experiences.
            </p>

            {/* Social Icons (Instagram only) */}
            <div className="flex items-center gap-2.5 pt-1">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Follow Craftella on Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[#9BB1D3] hover:border-[#E1306C] hover:bg-[#E1306C]/10 hover:text-[#E1306C] hover:scale-105 transition-all"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold text-white tracking-wide mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9BB1D3]">
              <li>
                <Link to="/book-tickets" className="hover:text-white transition-colors">
                  Book Tickets
                </Link>
              </li>
              <li>
                <Link to="/book-tickets" className="hover:text-white transition-colors">
                  Gift Cards
                </Link>
              </li>
              <li>
                <Link to="/book-tickets" className="hover:text-white transition-colors">
                  Event Add-Ons
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold text-white tracking-wide mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9BB1D3]">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/location" className="hover:text-white transition-colors">
                  Location
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-semibold text-white tracking-wide mb-4">
              Support
            </h4>
            <ul className="space-y-2.5 text-xs text-[#9BB1D3]">
              <li>
                <a href="mailto:hello@craftella.com" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column (Right) */}
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="text-sm font-semibold text-white tracking-wide mb-1">
              Join Our Newsletter
            </h4>
            <p className="text-xs text-[#9BB1D3] mb-3">
              Get the latest updates.
            </p>

            <form onSubmit={handleSubscribe} className="relative flex items-center w-full">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full border border-[rgba(158,190,246,0.22)] bg-[#0C1422] py-2.5 pl-4 pr-11 text-xs text-white placeholder-[#9BB1D3]/50 focus:border-[#7AA5F2] focus:outline-none focus:ring-1 focus:ring-[#7AA5F2] transition-all"
              />
              <button
                type="submit"
                aria-label="Submit Newsletter"
                className="absolute right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#16233B] border border-[rgba(158,190,246,0.25)] text-white hover:bg-[#7AA5F2] hover:text-[#070D1A] transition-all"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>

            {subscribed && (
              <span className="mt-2 text-[11px] font-medium text-emerald-400 flex items-center gap-1 animate-in fade-in duration-200">
                <Check className="h-3 w-3" />
                <span>Thank you for subscribing!</span>
              </span>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs text-[#9BB1D3]">
          {/* Copyright */}
          <div>
            © 2026 Craftella. All rights reserved.
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-3 text-xs text-[#9BB1D3]">
            <Link to="/about" className="hover:text-white transition-colors">
              Terms
            </Link>
            <span className="text-white/20">|</span>
            <Link to="/about" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <span className="text-white/20">|</span>
            <Link to="/about" className="hover:text-white transition-colors">
              Cookie
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
