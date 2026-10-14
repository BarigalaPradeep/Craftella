import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Check } from 'lucide-react';

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

            {/* Social Icons (5 rounded buttons) */}
            <div className="flex items-center gap-2 pt-1">
              {/* 1. Notes / Community */}
              <a
                href="#community"
                aria-label="Craftella Community"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[#9BB1D3] hover:border-[#7AA5F2] hover:bg-white/[0.08] hover:text-white transition-all"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </a>

              {/* 2. Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[#9BB1D3] hover:border-[#7AA5F2] hover:bg-white/[0.08] hover:text-white transition-all"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>

              {/* 3. Pinterest */}
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pinterest"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[#9BB1D3] hover:border-[#7AA5F2] hover:bg-white/[0.08] hover:text-white transition-all"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0a12 12 0 0 0-4.37 23.18c-.06-.99-.1-2.53.2-3.62l1.35-5.74s-.35-.7-.35-1.74c0-1.63.95-2.85 2.12-2.85 1 0 1.48.75 1.48 1.65 0 1-.64 2.5-1 3.88-.28 1.17.59 2.12 1.74 2.12 2.09 0 3.7-2.2 3.7-5.38 0-2.81-2.02-4.78-4.9-4.78-3.34 0-5.3 2.5-5.3 5.09 0 1.01.39 2.09.88 2.68.1.12.11.23.08.35l-.33 1.35c-.05.22-.17.27-.4.16-1.5-.7-2.43-2.88-2.43-4.64 0-3.77 2.74-7.24 7.9-7.24 4.15 0 7.37 2.96 7.37 6.91 0 4.12-2.6 7.44-6.2 7.44-1.21 0-2.35-.63-2.74-1.38l-.75 2.85c-.27 1.04-1 2.34-1.49 3.14A12 12 0 1 0 12 0z" />
                </svg>
              </a>

              {/* 4. YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[#9BB1D3] hover:border-[#7AA5F2] hover:bg-white/[0.08] hover:text-white transition-all"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12a31.4 31.4 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.5 15.5V8.5l6.3 3.5-6.3 3.5z" />
                </svg>
              </a>

              {/* 5. TikTok */}
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[#9BB1D3] hover:border-[#7AA5F2] hover:bg-white/[0.08] hover:text-white transition-all"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.5 0h3.5a5.5 5.5 0 0 0 4 4v3.5a9 9 0 0 1-4-1V14a7 7 0 1 1-7-7c.7 0 1.4.1 2 .3V11a3.5 3.5 0 1 0 1.5 2.9V0z" />
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
              <li className="pt-1">
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#CBD8ED] hover:text-[#7AA5F2] transition-colors"
                  title="Admin Portal"
                >
                  <ShieldCheck className="h-3 w-3 text-[#7AA5F2]" />
                  <span>Admin Portal</span>
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
