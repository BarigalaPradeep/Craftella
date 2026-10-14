import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function MainLayout() {
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-[#090E17] text-[#fff7fb] relative overflow-x-hidden">
      {/* Mobile Floral Framing Background (visible on mobile screens) */}
      <div
        className="fixed inset-0 pointer-events-none md:hidden z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-screen"
          style={{
            backgroundImage: "url('/images/mobile-bg.png')",
          }}
        />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{
            backgroundImage: "url('/images/mobile-bg-flowers.png')",
          }}
        />
        {/* Soft glowing ambient accents to highlight the flowers */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-[#7AA5F2]/20 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-[#7AA5F2]/20 blur-3xl" />
      </div>

      <Header />
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
